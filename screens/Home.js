import React, { useState, useEffect, useContext } from 'react';
import {
    View,
    Text,
    StyleSheet,
    Platform,
    Pressable,
    Image,
    FlatList
} from 'react-native';

import {
    createTable,
    getMenuItems,
    saveMenuItems,
    filterByQueryAndCategories,
} from '../database';
import { useUpdateEffect } from '../utils';

import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { TextInput } from 'react-native-gesture-handler';

import { Context } from '../App';
import { generateProfilePic } from 'utils';

const DEFAULT_PROFILE_PICTURE = "";
const sections = ['starters', 'mains', 'desserts', 'drinks'];

export default function Home({ navigation }) {
    const { userData, setUserData } = React.useContext(Context);
    const [localFirstName, setLocalFirstName] = useState(userData.firstName)
    const [localLastName, setLocalLastName] = useState(userData.lastName)
    const [localProfilePicture, setLocalProfilePicture] = useState(userData.profilePicture || DEFAULT_PROFILE_PICTURE);

    const [localMenuData, setLocalMenuData] = useState([]);
    const [searchBarText, setSearchBarText] = useState('');
    const [query, setQuery] = useState([]);

    const [showStarters, setShowStarters] = useState(false)
    const [showMains, setShowMains] = useState(false)
    const [showDesserts, setShowDesserts] = useState(false)
    const [showDrinks, setShowDrinks] = useState(false)

    const API_URL = 'https://raw.githubusercontent.com/Meta-Mobile-Developer-PC/Working-With-Data-API/main/capstone.json'

    const welcomeMessage = 'We are a family owned Mediterranean restaurant, focused on traditional recipes served with a modern twist'

    const removeCategoryFromQuery = (category) => {
        setQuery(query.filter(item => item !== category))
    }

    const addCategoryToQuery = (category) => {
        const index = query.indexOf(category);
        if (index === -1) {
            setQuery([...query, category])
        }
    }

    const adjustQuery = (prevState, category) => {
        if (prevState) {
            removeCategoryFromQuery(category)
        } else {
            addCategoryToQuery(category)
        }
    }

    const fetchData = async () => {
        // Fetch the menu from the API_URL endpoint. You can visit the API_URL in your browser to inspect the data returned
        // The category field comes as an object with a property called "title". You just need to get the title value and set it under the key "category".
        // So the server response should be slighly transformed in this function (hint: map function) to flatten out each menu item in the array,

        try {
            const response = await fetch(API_URL);
            const { menu } = await response.json();

            return menu.map((item) => ({
                name: item.name,
                price: String(item.price),
                description: item.description,
                image: item.image,
                category: item.category
            }));
        } catch (error) {
            console.error(error);
            return []
        }
    }

    useEffect(() => {// effect to set up the local database
        (async () => {
            try {
                await createTable();
                let menuItems = await getMenuItems();
                // The application only fetches the menu data once from a remote URL
                // and then stores it into a SQLite database.
                // After that, every application restart loads the menu from the database
                if (!menuItems.length) {
                    const menuItems = await fetchData();
                    await saveMenuItems(menuItems);
                    setLocalMenuData(menuItems);
                }
                else {
                    setLocalMenuData(menuItems);
                }
            } catch (e) {
                // Handle error
                Alert.alert(e.message);
            }
        })();
    }, []);
    // End of useEffect for fetching data and setting the localMenuData state

    useUpdateEffect(() => {
        (async () => {
            try {
                const menuItems = await filterByQueryAndCategories(
                    searchBarText,
                    query  // query is already an array of selected categories
                );
                setLocalMenuData(menuItems);
            } catch (e) {
                Alert.alert(e.message);
            }
        })();
    }, [searchBarText, query]);

    const renderMenuItem = ({ item }) => {

        let imageSource;

        if (item.image === "lemonDessert.jpg") {
            imageSource = require('../assets/img/Lemon dessert.png');
        } else if (item.image === "grilledFish.jpg") {
            imageSource = require('../assets/img/Grilled fish.png');
        } else {
            imageSource = {
                uri: `https://github.com/Meta-Mobile-Developer-PC/Working-With-Data-API/blob/main/images/${item.image}?raw=true`
            };
        }
        return (
            <View style={styles.menuItemOuterContainer}>
                <View style={styles.menuItemInnerContainer}>
                    <View style={styles.menuItemDescriptonContainer}>
                        <Text style={styles.menuItemName}>{item.name}</Text>
                        <Text style={styles.menuItemDescription}>{item.description}</Text>
                        <Text style={styles.menuItemPrice}>${item.price}</Text>
                    </View>
                    <Image
                        source={imageSource}
                        style={styles.menuItemImage}
                        resizeMode="cover"
                    />
                </View>
            </View>
        )
    };

    return (
        <KeyboardAwareScrollView
            style={styles.container}
            contentContainerStyle={styles.scrollViewContent}
            keyboardShouldPersistTaps="handled"
            enableOnAndroid={true}
            enableAutomaticScroll={true}
            extraScrollHeight={20}
            extraHeight={Platform.OS === 'ios' ? 20 : 40}
        >
            <View style={styles.topRow}>
                <Image
                    style={styles.headerImage}
                    source={require('../assets/img/Logo.png')} />
                <Pressable
                    onPress={() => {
                        navigation.navigate('Profile');
                    }}
                >
                    {generateProfilePic(localProfilePicture, localFirstName, localLastName, DEFAULT_PROFILE_PICTURE, true)}
                </Pressable>
            </View>

            <View style={styles.heroSection}>
                <Text style={styles.heroH1}>Little Lemon</Text>
                <View style={styles.heroInnerContainer}>
                    <View style={styles.heroTextContainer}>
                        <Text style={styles.heroH2}>Chicago</Text>
                        <Text style={styles.heroText}>{welcomeMessage} </Text>
                        <TextInput
                            style={styles.searchBox}
                            value={searchBarText}
                            onChangeText={setSearchBarText}
                            placeholder={'Search for a dish'}
                            keyboardType={'email-address'}
                            placeholderTextColor={cream}
                        />
                    </View>
                    <Image
                        source={require('../assets/img/Hero image.png')}
                        style={styles.heroImage}
                        resizeMode="stretch"
                    />
                </View>
            </View>

            <View style={{ alignSelf: 'flex-start', paddingLeft: '4%', paddingTop: '3%' }}>
                <Text style={styles.menuItemName}>ORDER FOR DELIVERY</Text>
            </View>

            <View style={[styles.buttonRow]}>
                <Pressable
                    onPress={() => { adjustQuery(showStarters, "starters"); setShowStarters(!showStarters) }}
                    style={showStarters ? styles.solidGreenButton : styles.hollowGreenButton}
                >
                    <Text style={showStarters ? styles.solidGreenButtonText : styles.hollowGreenButtonText}>Starters</Text>
                </Pressable>

                <Pressable
                    onPress={() => { adjustQuery(showMains, "mains"); setShowMains(!showMains) }}
                    style={showMains ? styles.solidGreenButton : styles.hollowGreenButton}
                >
                    <Text style={showMains ? styles.solidGreenButtonText : styles.hollowGreenButtonText}>Mains</Text>
                </Pressable>
                <Pressable
                    onPress={() => { adjustQuery(showDesserts, "desserts"); setShowDesserts(!showDesserts) }}
                    style={showDesserts ? styles.solidGreenButton : styles.hollowGreenButton}
                >
                    <Text style={showDesserts ? styles.solidGreenButtonText : styles.hollowGreenButtonText}>Desserts</Text>
                </Pressable>

                <Pressable
                    onPress={() => { adjustQuery(showDrinks, "drinks"); setShowDrinks(!showDrinks) }}
                    style={showDrinks ? styles.solidGreenButton : styles.hollowGreenButton}
                >
                    <Text style={showDrinks ? styles.solidGreenButtonText : styles.hollowGreenButtonText}>Drinks</Text>
                </Pressable>
            </View>

            <View style={styles.flatListContainer}>
                <FlatList
                    scrollEnabled={false} // Important!
                    data={localMenuData}
                    renderItem={renderMenuItem}
                    ItemSeparatorComponent={() => (
                        <View style={{ height: 1, backgroundColor: '#d3d3d3', marginHorizontal: 10 }} />
                    )}
                />
            </View>


        </KeyboardAwareScrollView>
    );
}


const cream = '#ebe8df'
const green = '#4A5E57'
const darkerGreen = '#384742'
const yellow = "#F4CD14"

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: cream,
    },
    scrollViewContent: {
        alignItems: 'center',
        justifyContent: 'flex-start',
        flexGrow: 1  // This ensures content can grow and be scrollable
    },
    topRow: {
        padding: '5%',
        width: '100%',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    headerImage: {
        height: 50,
        resizeMode: 'cover',
    },
    searchBox: {
        // alignSelf: 'left',
        color: cream,
        marginTop: '5%',
        height: 35,
        borderWidth: 1,
        borderColor: cream,
        padding: 10,
        fontSize: 15,
        borderRadius: 8,
        marginBottom: 10,
    },
    heroSection: {
        minHeight: 200,
        width: '100%',
        padding: '8%',
        backgroundColor: green,
    },
    heroH1: {
        color: yellow,
        fontSize: 40,
        fontWeight: 'bold',
        fontFamily: '../assets/fonts/Karla-Regular',
        paddingBottom: '3%',
    },
    heroH2: {
        color: cream,
        fontSize: 30,
        fontWeight: 'bold',
        fontFamily: '../assets/fonts/MarkaziText-Regular',
    },
    heroInnerContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start', // Align items to top
        flex: 1, // Take up available space
    },
    heroTextContainer: {
        flex: 1,
        paddingRight: 16,
        justifyContent: 'space-between',
    },
    heroText: {
        color: 'white',
        fontSize: 17,
        fontFamily: '../assets/fonts/Karla-Regular',
        paddingTop: '5%',
        paddingBottom: '2%',
        paddingRight: '5%',
    },
    heroImage: {
        width: 100,
        aspectRatio: 2 / 3, // Instead of fixed height
        borderRadius: 8,
        flex: 0, // Remove flex to prevent stretching
        alignSelf: 'center'
    },
    buttonRow: {
        width: '100%',
        flexDirection: 'row',
        justifyContent: 'space-evenly',
        alignItems: 'center',
        paddingHorizontal: '3%',
        gap: 10,
    },
    flatListContainer: {
        flex: 1,
        width: '100%',
    },
    menuItemOuterContainer: {
        padding: 16,
        width: '100%'
    },
    menuItemInnerContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    menuItemDescriptonContainer: {
        flex: 3,
        paddingRight: 16
    },
    menuItemName: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 8
    },
    menuItemDescription: {
        fontSize: 14,
        color: '#495E57',
        marginBottom: 8
    },
    menuItemPrice: {
        fontSize: 15,
        color: '#495E57'
    },
    menuItemImage: {
        width: 100,
        height: 100,
        borderRadius: 8,
        flex: 1
    },
    inputBox: {
        height: 40,
        margin: 20,
        borderWidth: 1,
        padding: 10,
        fontSize: 16,
        borderColor: 'grey',
        backgroundColor: '#EFEFEE',
    },
    solidGreenButton: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        padding: 10,
        backgroundColor: green,
        borderColor: darkerGreen,
        borderWidth: 1,
        borderRadius: 20,
    },
    solidGreenButtonText: {
        color: 'white',
        fontSize: 14,
        fontWeight: 'bold',
    },
    hollowGreenButton: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        padding: 10,
        borderColor: darkerGreen,
        borderWidth: 1,
        borderRadius: 20,
    },
    hollowGreenButtonText: {
        color: green,
        fontSize: 14,
        fontWeight: 'bold',
    },
})