import 'react-native-gesture-handler';
import AsyncStorage from '@react-native-async-storage/async-storage';
import RootStack from './navigation';
import { useState, useEffect, createContext } from 'react';
import React from 'react';
import LoadingScreen from './screens/Loading';

// Define the types for userData and context
type UserData = {
  firstName: string | null;
  lastName: string | null;
  email: string | null;
  number: string | null;
  notifications: string | null;
  profilePicture: string | null;
};

type ContextType = {
  userData: UserData;
  setUserData: React.Dispatch<React.SetStateAction<UserData>>;
};

// Create the context with the correct type
export const Context = createContext<ContextType>({
  userData: {
    firstName: null,
    lastName: null,
    email: null,
    number: null,
    notifications: null,
    profilePicture: null
  },
  setUserData: () => { },
});

export default function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [userData, setUserData] = useState<UserData>({
    firstName: null,
    lastName: null,
    email: null,
    number: null,
    notifications: null,
    profilePicture: null
  });

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

          // Then load additional fields if they exist
          try {
            const [lastName, number, notifications, profilePicture] = await Promise.all([
              AsyncStorage.getItem('lastName'),
              AsyncStorage.getItem('number'),
              AsyncStorage.getItem('notifications'),
              AsyncStorage.getItem('profilePicture'),
            ]);

            // Update userData with any existing additional fields
            setUserData(prevData => ({
              ...prevData,
              lastName: lastName || null,
              number: number || null,
              notifications: notifications || null,
              profilePicture: profilePicture || null
            }));
          } catch (error) {
            // If there's an error loading additional data, we can log it
            // but don't need to handle it since these fields are optional
            console.error('Error loading lastName, number, notification preferences, and/or profilePicture:', error);
          }

        }
      } catch (error) {
        console.error('Error loading firstName and email:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, []);

  if (isLoading) {
    return <LoadingScreen />;
  }

  return (
    <Context.Provider value={{ userData, setUserData }}>
      <RootStack isLoggedIn={isLoggedIn} />
    </Context.Provider>
  );
}
