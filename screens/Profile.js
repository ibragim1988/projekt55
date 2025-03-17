import React, { useState, useEffect, useContext } from 'react';
import { validateName, validateEmail, validateNumber, generateProfilePic } from '../utils';
import { Context } from '../App';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as ImagePicker from 'expo-image-picker';
import { Avatar } from 'react-native-elements';

import {
    Platform,
    Alert,
    ScrollView,
    Image,
    Text,
    View,
    StyleSheet,
    TextInput,
    Pressable,
    TouchableOpacity,
    KeyboardAvoidingView,
    Dimensions,
} from 'react-native';

const NOTIFICATION_CATEGORIES = [
    { index: 0, label: 'Order statuses' },
    { index: 1, label: 'Password changes' },
    { index: 2, label: 'Special offers' },
    { index: 3, label: 'Newsletter' },
];

const DEFAULT_NOTIFICATIONS = "0000";
const DEFAULT_PROFILE_PICTURE = "";

const CustomCheckbox = ({ checked, onPress }) => (
    <TouchableOpacity
        onPress={onPress}
        style={[
            styles.checkbox,
            checked && styles.checkboxChecked
        ]}
    >
        {checked && <Text style={styles.checkmark}>✓</Text>}
    </TouchableOpacity>
);

export default function Profile({ route, navigation }) {
    const { userData, setUserData } = React.useContext(Context);
    const [isLoggingOut, setIsLoggingOut] = useState(false);
    const [localFirstName, setLocalFirstName] = useState(userData.firstName)
    const [localLastName, setLocalLastName] = useState(userData.lastName)
    const [localEmail, setLocalEmail] = useState(userData.email)
    const [localNumber, setLocalNumber] = useState(userData.number)
    const [localNotifications, setLocalNotifications] = useState(userData.notifications || DEFAULT_NOTIFICATIONS)
    const [localProfilePicture, setLocalProfilePicture] = useState(userData.profilePicture || DEFAULT_PROFILE_PICTURE);

    const pickImage = async () => {

        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ['images'],
            allowsEditing: true,
            quality: 0.7,
        });
        // console.log(result);
        if (!result.canceled) {
            setLocalProfilePicture(result.assets[0].uri);
        } else {
            Alert.alert(
                'No Image Was Selected',
                'Keeping The Last Profile Picture',
                [{ text: 'OK' }]
            );
        }
    };


    const changePic = async () => {
        await pickImage()
    }

    const removePic = () => {
        setLocalProfilePicture(DEFAULT_PROFILE_PICTURE)
    }

    const handleLogOut = () => {
        setIsLoggingOut(true);
        navigation.reset({
            index: 0,
            routes: [{ name: 'Onboarding' }],
        });
    };

    const toggleNotification = (index) => {
        setLocalNotifications(prev => {
            const notificationArray = (prev || DEFAULT_NOTIFICATIONS).split('');
            notificationArray[index] = notificationArray[index] === '1' ? '0' : '1';
            return notificationArray.join('');
        });
    };

    useEffect(() => {
        return () => {
            if (isLoggingOut) {
                const clearData = async () => {
                    try {
                        await AsyncStorage.clear();
                        setUserData(null);
                    } catch (error) {
                        console.log("Error clearing user's data");
                        console.log(error);
                    }
                };
                clearData();
            }
        };
    }, [isLoggingOut]);

    const getInvalidFields = () => {
        const invalidFields = [];

        if (localFirstName && !validateName(localFirstName)) {
            invalidFields.push('First Name');
        }

        if (localLastName && !validateName(localLastName)) {
            invalidFields.push('Last Name');
        }

        if (localEmail && !validateEmail(localEmail)) {
            invalidFields.push('Email');
        }

        if (localNumber && !validateNumber(localNumber)) {
            invalidFields.push('Phone Number');
        }

        return invalidFields;
    };

    const saveChanges = async () => {
        const invalidFields = getInvalidFields();

        if (invalidFields.length === 0) {
            try {
                const updates = {
                    firstName: localFirstName || '',
                    lastName: localLastName || '',
                    email: localEmail || '',
                    number: localNumber || '',
                    notifications: localNotifications || DEFAULT_NOTIFICATIONS,
                    profilePicture: localProfilePicture || DEFAULT_PROFILE_PICTURE,
                };

                await Promise.all(
                    Object.entries(updates).map(([key, value]) =>
                        AsyncStorage.setItem(key, value)
                    )
                );

                setUserData(updates);

                Alert.alert(
                    'Success',
                    'Your changes have been saved successfully.',
                    [{ text: 'OK' }]
                );
            } catch (error) {
                console.error('Error saving updated info:', error);
                Alert.alert(
                    'Error',
                    'There was a problem saving your changes. Please try again.',
                    [{ text: 'OK' }]
                );
            }
        } else {
            Alert.alert(
                'Invalid Fields',
                `Please correct the following fields:\n${invalidFields.join('\n')}`,
                [{ text: 'OK' }]
            );
        }
    };


    const discardChanges = () => {
        setLocalFirstName(userData.firstName)
        setLocalLastName(userData.lastName)
        setLocalEmail(userData.email)
        setLocalNumber(userData.number)
        setLocalNotifications(userData.notifications || DEFAULT_NOTIFICATIONS)
        setLocalProfilePicture(userData.profilePicture || DEFAULT_PROFILE_PICTURE)
    }

    return (
        <KeyboardAvoidingView style={styles.scrollContainer}
            behavior={Platform.OS === 'ios' ? 'padding' : undefined}
            keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 20}
        >
            <ScrollView style={styles.container}>
                <Text style={styles.sectionHeading}>Personal Information</Text>

                {/* Top Row With Profile Pic  */}
                <View style={styles.buttonRow}>
                    {generateProfilePic(localProfilePicture, localFirstName, localLastName, DEFAULT_PROFILE_PICTURE)}

                    <Pressable
                        onPress={changePic}
                        // style={styles.solidGreenButton}
                        style={[styles.solidGreenButton, { flex: 0, width: '30%' }]}
                    >
                        <Text style={styles.solidGreenButtonText}>Change</Text>
                    </Pressable>

                    <Pressable
                        onPress={removePic}
                        style={[styles.hollowGreenButton, { flex: 0, width: '30%' }]}
                    >
                        <Text style={styles.hollowGreenButtonText}>Remove</Text>
                    </Pressable>
                </View>

                <Text style={styles.inputBoxHeading}>First Name</Text>
                <TextInput
                    style={styles.inputBox}
                    value={localFirstName}
                    onChangeText={setLocalFirstName}
                    placeholder={'Enter your first name'}
                    keyboardType={'default'}
                />

                <Text style={styles.inputBoxHeading}>Last Name</Text>
                <TextInput
                    style={styles.inputBox}
                    value={localLastName}
                    onChangeText={setLocalLastName}
                    placeholder={"Enter your last name"}
                    keyboardType={'default'}
                />

                <Text style={styles.inputBoxHeading}>Email</Text>
                <TextInput
                    style={styles.inputBox}
                    value={localEmail}
                    onChangeText={setLocalEmail}
                    placeholder={'Enter your email'}
                    keyboardType={'email-address'}
                />

                <Text style={styles.inputBoxHeading}>Phone Number</Text>
                <TextInput
                    style={styles.inputBox}
                    value={localNumber}
                    onChangeText={setLocalNumber}
                    placeholder={"Enter your phone number"}
                    keyboardType={'phone-pad'}
                />

                <Text style={styles.sectionHeading}>Email notifications</Text>
                {NOTIFICATION_CATEGORIES.map(({ index, label }) => (
                    <View key={index} style={styles.checkboxContainer}>
                        <CustomCheckbox
                            checked={localNotifications[index] === '1'}
                            onPress={() => toggleNotification(index)}
                        />
                        <Text style={styles.checkboxLabel}>{label}</Text>
                    </View>
                ))}

                <View style={[styles.buttonRow, { marginTop: 5 }]}>
                    <Pressable
                        onPress={discardChanges}
                        style={styles.hollowGreenButton}
                    >
                        <Text style={styles.hollowGreenButtonText}>Discard Changes</Text>
                    </Pressable>

                    <Pressable
                        onPress={saveChanges}
                        style={styles.solidGreenButton}
                    >
                        <Text style={styles.solidGreenButtonText}>Save Changes</Text>
                    </Pressable>
                </View>

                <Pressable
                    style={[styles.logoutButton, { marginTop: 17 }]}
                    onPress={handleLogOut}
                >
                    <Text style={styles.logoutButtonText}>Log Out</Text>
                </Pressable>
            </ScrollView>
        </KeyboardAvoidingView>
    )
}

const cream = '#ebe8df'
const green = '#4A5E57'
const darkerGreen = '#384742'
const lightGrey = '#c2bebe'
const yellow = "#F4CD14"
const orange = "#F75B02"
const windowWidth = Dimensions.get('window').width;

const styles = StyleSheet.create({
    scrollContainer: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    container: {
        flex: 1,
        padding: '5%',
    },
    h2heading: {
        alignSelf: 'flex-start',
        fontSize: 22,
        fontWeight: 'bold',
    },
    sectionHeading: {
        alignSelf: 'flex-start',
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 10,
    },
    profilePic: {
        width: 75,
        height: 75,
        borderRadius: 37,
        resizeMode: 'cover',  // Makes sure the image fills the entire circle
    },
    inputBoxHeading: {
        alignSelf: 'flex-start',
        fontSize: 15,
        color: 'grey',
        fontWeight: 'bold',
        marginTop: 10,
    },
    inputBox: {
        alignSelf: 'stretch',
        height: 40,
        borderWidth: 1,
        padding: 10,
        fontSize: 15,
        borderColor: 'grey',
        borderRadius: 8,
        marginBottom: 10,
    },
    checkboxContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        alignSelf: 'stretch',
        marginBottom: 10,
    },
    checkbox: {
        width: 24,
        height: 24,
        borderWidth: 2,
        borderColor: green,
        borderRadius: 4,
        marginRight: 10,
        justifyContent: 'center',
        alignItems: 'center',
    },
    checkboxChecked: {
        backgroundColor: green,
    },
    checkmark: {
        color: 'white',
        fontSize: 16,
        fontWeight: 'bold',
    },
    checkboxLabel: {
        fontSize: 16,
    },
    logoutButton: {
        alignItems: 'center',
        justifyContent: 'center',
        padding: 12,
        backgroundColor: yellow,
        borderColor: orange,
        borderWidth: 1,
        borderRadius: 10,
        width: '100%',
        marginTop: 5,
    },
    logoutButtonText: {
        color: 'black',
        fontSize: 15,
        fontWeight: 'bold',
    },
    buttonRow: {
        width: '100%',
        flexDirection: 'row',
        justifyContent: 'space-evenly',
        alignItems: 'center',
        gap: 10,
    },
    solidGreenButton: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        padding: 12,
        backgroundColor: green,
        borderColor: darkerGreen,
        borderWidth: 1,
        borderRadius: 10,
    },
    solidGreenButtonText: {
        color: 'white',
        fontSize: 15,
        fontWeight: 'bold',
    },
    hollowGreenButton: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        padding: 12,
        borderColor: darkerGreen,
        borderWidth: 1,
        borderRadius: 10,
    },
    hollowGreenButtonText: {
        color: green,
        fontSize: 15,
        fontWeight: 'bold',
    },
});