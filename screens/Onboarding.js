import React, { useState, useEffect, useContext } from 'react';
import { validateName, validateEmail } from '../utils';
import AsyncStorage from '@react-native-async-storage/async-storage';

import LoadingScreen from './Loading';
import { Context } from '../App';

import {
    Platform,
    ScrollView,
    Text,
    View,
    StyleSheet,
    TextInput,
    Pressable,
    KeyboardAvoidingView,
    Image
} from 'react-native';

const welcomeMessage = 'We are a family owned Mediterranean restaurant, focused on traditional recipes served with a modern twist'

export default function Onboarding({ navigation }) {
    const [email, onChangeEmail] = useState('');
    const [firstName, onChangeFirstName] = useState('');
    const [validInfo, setValidInfo] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const { userData, setUserData } = React.useContext(Context);

    const saveInfo = async () => {
        try {
            setIsLoading(true)
            await AsyncStorage.setItem('firstName', firstName);
            await AsyncStorage.setItem('email', email);
            setUserData(prevData => ({
                ...prevData,
                firstName,
                email
            }));
        } catch (error) {
            console.error('Error saving firstName and email:', error);
        } finally {
            setIsLoading(false)
        }

    }

    useEffect(() => {
        setValidInfo(validateName(firstName) && validateEmail(email));
    }, [email, firstName]);

    return (
        <KeyboardAvoidingView
            style={styles.container}
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 20}
        >
            <ScrollView
                contentContainerStyle={styles.scrollViewContent}
                keyboardShouldPersistTaps="handled"
                automaticallyAdjustKeyboardInsets={true}
            >

                <Text style={styles.H1Text}>Let us get to know you</Text>

                <View style={styles.heroSection}>
                    <Text style={styles.heroH1}>Little Lemon</Text>
                    <View style={styles.heroInnerContainer}>
                        <View style={styles.heroTextContainer}>
                            <Text style={styles.heroH2}>Chicago</Text>
                            <Text style={styles.heroText}>{welcomeMessage} </Text>
                        </View>
                        <Image
                            source={require('../assets/img/Hero image.png')}
                            style={styles.heroImage}
                            resizeMode="stretch"
                        />
                    </View>
                </View>

                <View style={{ paddingVertical: 30 }}>

                    <Text style={styles.regularText}>First Name</Text>
                    <TextInput
                        style={styles.inputBox}
                        value={firstName}
                        onChangeText={onChangeFirstName}
                        placeholder={'What do you go by'}
                        keyboardType={'default'}
                    />

                    <Text style={styles.regularText}>Email</Text>
                    <TextInput
                        style={styles.inputBox}
                        value={email}
                        onChangeText={onChangeEmail}
                        placeholder={'How do we reach out'}
                        keyboardType={'email-address'}
                    />
                </View>

                {!validInfo && <Pressable
                    onPress={() => { }}
                    style={styles.inActiveButton}>
                    <Text style={styles.inActiveButtonText}>Next</Text>
                </Pressable>}

                {validInfo && <Pressable
                    onPress={async () => {
                        await saveInfo();
                        navigation.reset({
                            index: 0,
                            routes: [{ name: 'Home' }],
                        });
                    }}
                    style={styles.activeButton}
                >
                    <Text style={styles.activeButtonText}>Next</Text>
                </Pressable>
                }

            </ScrollView>
        </KeyboardAvoidingView>
    );
}

const cream = '#ebe8df'
const green = '#4A5E57'
const darkerGreen = '#384742'
const lightGrey = '#c2bebe'
const yellow = "#F4CD14"

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: cream,
    },
    scrollViewContent: {
        // alignItems: 'center',
        justifyContent: 'center',
        flexGrow: 1  // This ensures content can grow and be scrollable
    },
    H1Text: {
        padding: 40,
        fontSize: 30,
        color: 'black',
        textAlign: 'center',
        fontFamily: 'MarkaziText-Regular',
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
    regularText: {
        fontSize: 24,
        fontFamily: 'MarkaziText-Regular',
        color: darkerGreen,
        paddingLeft: 20,
        textAlign: 'left',
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
    activeButton: {
        fontSize: 22,
        padding: 10,
        paddingTop: 10,
        marginVertical: 25,
        margin: 100,
        backgroundColor: green,
        borderColor: darkerGreen,
        borderWidth: 2,
        borderRadius: 50,
    },
    activeButtonText: {
        color: cream,
        textAlign: 'center',
        fontSize: 25,
    },
    inActiveButton: {
        fontSize: 22,
        padding: 10,
        paddingTop: 10,
        marginVertical: 25,
        margin: 100,
        backgroundColor: lightGrey,
        borderColor: lightGrey,
        borderWidth: 2,
        borderRadius: 50,
    },
    inActiveButtonText: {
        color: 'white',
        textAlign: 'center',
        fontSize: 25,
    },
});
