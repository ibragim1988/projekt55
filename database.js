import * as SQLite from 'expo-sqlite';

const db = SQLite.openDatabaseSync('little_lemon');

export async function createTable() {
    try {
        await db.execAsync(
            'CREATE TABLE IF NOT EXISTS menuitems (id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT, price TEXT, description TEXT, image TEXT, category TEXT);'
        );
    } catch (error) {
        throw new Error(`Error creating table: ${error}`);
    }
}

export async function getMenuItems() {
    try {
        const result = await db.getAllAsync('SELECT * FROM menuitems WHERE name IS NOT NULL');
        return result;
    } catch (error) {
        throw new Error(`Error fetching menu items: ${error}`);
    }
}

export async function saveMenuItems(menuItems) {

    try {
        await db.withTransactionAsync(async () => {
            // Delete all existing data
            await db.execAsync("DELETE FROM menuitems;");

            const placeholders = menuItems.map(() => '(?, ?, ?, ?, ?)').join(', ');
            const values = menuItems.flatMap(item => [
                item.name,
                item.price,
                item.description,
                item.image,
                item.category
            ]);

            // Fix: Add string template literals
            const query = `INSERT INTO menuitems (name, price, description, image, category) VALUES ${placeholders}`;

            // Fix: Use runAsync instead of execAsync for parameterized queries
            await db.runAsync(query, values);
        });
    } catch (error) {
        // Fix: Add template literal syntax
        throw new Error(`Error saving menu items: ${error}`);
    }
}


export async function filterByQueryAndCategories(searchBarText, activeCategories) {
    if (activeCategories.length == 0) {
        activeCategories = ['starters', 'mains', 'desserts', 'drinks']
    }

    try {
        // First check what's in the table
        const allItems = await db.getAllAsync('SELECT * FROM menuitems');

        const queryString = `SELECT * FROM menuitems 
                            WHERE name LIKE ? 
                            AND category IN (${activeCategories.map(() => '?').join(',')})`;

        const params = ['%' + searchBarText + '%', ...activeCategories];

        const result = await db.getAllAsync(queryString, params);
        return result;
    } catch (error) {
        console.error('Filter error:', error);
        throw new Error(`Error filtering menu items: ${error}`);
    }
}