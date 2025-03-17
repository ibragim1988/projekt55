<h1 align="center"> The Little Lemon Restaurant App</h1>
<p align="center">
<img src="./assets/img/Logo.png" width="200"/>
</p>
<h3 align="center">
A React Native mobile application built as the capstone project for Meta's React Native Specialization on Coursera
</h3>

Video Preview of the app:

https://github.com/user-attachments/assets/2ce0948a-e9ee-4380-8c9a-8e9030b00f46

## Project Overview

The Little Lemon App is a fully-functional restaurant application that allows users to browse the restaurant's menu, filter items by category, search for specific dishes, and maintain their user profile. The app implements a complete user authentication flow, persistent storage, and real-time menu filtering capabilities.

This project was developed as the capstone for Meta's React Native Specialization on Coursera, demonstrating proficiency in React Native application development, state management, navigation, and data persistence.

## Key Features

- **User Authentication**: Complete onboarding flow with user registration and login functionality
- **Profile Management**: Users can update their personal information, including profile pictures and notification preferences
- **API Integration**: Fetches restaurant menu data from a REST API endpoint
- **Menu Browsing**: Dynamic menu display with images and descriptions of each dish
- **Advanced Filtering**: Real-time filtering of menu items by category (starters, mains, desserts, drinks)
- **Search Functionality**: Search capability to find specific dishes
- **Data Persistence**: Local storage of user preferences and authentication state
- **SQLite Integration**: Menu data stored and retrieved using SQLite database
- **Responsive UI**: Clean, intuitive user interface with consistent design language

## Technology Stack

- **React Native**: Core framework for cross-platform mobile development
- **Expo**: Development platform for building and deploying React Native applications
- **TypeScript**: Type-safe JavaScript at critical areas for improved code quality and developer experience
- **React Navigation**: Navigation library for implementing screen transitions and app structure
- **SQLite**: Local database for storing and querying menu data
- **Async Storage**: Persistent storage solution for user data and authentication state
- **React Context API**: State management for global application state
- **Expo Image Picker**: Library for handling image selection and camera functionality

## App Structure

The Little Lemon App consists of several key screens and components:

1. **Onboarding Screen**: Collects user information for first-time users
2. **Home Screen**: Displays the restaurant's hero section and menu items with filtering options
3. **Profile Screen**: Allows users to view and edit their personal information and preferences
4. **Loading Screen**: Provides visual feedback during app initialization and data loading
5. **Navigation**: Stack-based navigation with appropriate routing based on authentication state

## Implementation Details

### User Authentication

The app implements a streamlined authentication flow using AsyncStorage to persist user login state. When a user launches the app, it checks for existing user credentials and automatically navigates to the appropriate screen:

- New users are directed to the Onboarding screen to register
- Returning users are taken directly to the Home screen

```javascript
useEffect(() => {
  const loadData = async () => {
    try {
      const [firstName, email] = await Promise.all([
        AsyncStorage.getItem('firstName'),
        AsyncStorage.getItem('email'),
      ]);

      if (firstName && email) {
        setUserData(prevData => ({
          ...prevData,
          firstName,
          email
        }));

        setIsLoggedIn(true);
        // Additional data loading...
      }
    } catch (error) {
      console.error('Error loading firstName and email:', error);
    } finally {
      setIsLoading(false);
    }
  };

  loadData();
}, []);
```

### Menu Data Management

The application fetches menu data from a remote API and stores it locally in a SQLite database for offline access and improved performance:

1. **API Integration**: Initial data is fetched from the API and transformed into the appropriate format
2. **SQLite Storage**: Data is persisted in a local database for efficient querying and filtering
3. **Real-time Filtering**: Users can filter menu items by category with immediate UI updates

### Profile Management

Users can customize their profile with various options:

- Update personal information (name, email, phone number)
- Set notification preferences for different types of alerts
- Upload or change profile pictures using device camera or gallery
- Log out functionality with proper state cleanup

## Getting Started

### Prerequisites

- Node.js (v14 or later)
- npm or Yarn package manager
- Expo CLI (`npm install -g expo-cli`)
- iOS Simulator or Android Emulator (or physical device with Expo Go app)

### Installation

1. Clone the repository:
   ```
   git clone https://github.com/yourusername/little-lemon-app.git
   cd little-lemon-app
   ```

2. Install dependencies:
   ```
   npm install
   ```
   or
   ```
   yarn install
   ```

3. Start the Expo development server:
   ```
   npm start
   ```
   or
   ```
   yarn start
   ```

4. Follow the instructions in the terminal to open the app in your preferred environment (iOS simulator, Android emulator, or physical device)

## Project Structure

```
/
├── assets/              # Images, fonts and other static assets
├── components/          # Reusable UI components
│   ├── LittleLemonHeader.js
│   └── LittleLemonFooter.js
├── screens/             # Application screens
│   ├── Home.js          # Main menu screen
│   ├── Loading.js       # Loading/splash screen
│   ├── Onboarding.js    # User registration screen
│   └── Profile.js       # User profile management screen
├── navigation/          # Navigation configuration
│   └── index.tsx
├── App.tsx              # Main application component
├── database.js          # SQLite database setup and queries
└── utils.js             # Utility functions and helpers
```

## Acknowledgements

- This project was created as part of Meta's React Native Specialization on Coursera
- Restaurant menu data provided by Meta's sample API
- UI/UX design inspired by the Little Lemon brand guidelines

## Certification & Credentials

<div align="center">
  <img width="400" alt="Meta React Native Specialization Certificate" src="https://github.com/user-attachments/assets/c7002bd6-dd08-4b0f-a90e-8786e66b610e" />
  <p>
    <a href="https://coursera.org/share/500884f3656eb7d5800ae36a558174ed">Verify this certification on Coursera</a>
  </p>
</div>

While this certificate demonstrates the formal completion of Meta's React Native Specialization, I believe the true measure of my skillset lies in the quality and scalability of the solutions I deliver. Have a look at my [LinkedIn](https://www.linkedin.com/in/evaan/)!


