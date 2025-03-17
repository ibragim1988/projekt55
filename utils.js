export const validateName = (name) => {
    // Allows for names with spaces, hyphens, and apostrophes
    const nameRegex = /^[a-zA-Z]+(([',. -][a-zA-Z ])?[a-zA-Z]*)*$/;
    return nameRegex.test(name);
}

export const validateEmail = (email) => {
    return email.match(
        /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
    );
};

export const validateNumber = (number) => {
    if (!number) return true; // Phone number is optional

    // Matches these formats:
    // (123) 456-7890
    // (123)456-7890
    // 123-456-7890
    // 1234567890
    // +1 123-456-7890
    // +1 (123) 456-7890
    const phoneRegex = /^(\+1\s?)?((\([0-9]{3}\))|[0-9]{3})[-. ]?[0-9]{3}[-. ]?[0-9]{4}$/;
    return phoneRegex.test(number);
};

import React, { useRef, useEffect } from 'react';
import { Image, StyleSheet } from 'react-native'
import { Context } from './App';
import { Avatar } from 'react-native-elements';

export const generateProfilePic = (profilePicture, firstName, lastName, DEFAULT_PROFILE_PICTURE, generateSmaller = false) => {

    const selectedDimensions = generateSmaller ? styles.smallerImageDimensions : styles.normalImageDimensions

    return profilePicture === DEFAULT_PROFILE_PICTURE ? (
        <Avatar
            rounded
            title={firstName.charAt(0) + (lastName?.charAt(0) || '')}
            containerStyle={[selectedDimensions, { backgroundColor: '#62D5C4' }]}
        />
    ) : (
        <Image
            source={{ uri: profilePicture }}
            style={[selectedDimensions, { resizeMode: 'cover' }]}
        />
    );
}

const styles = StyleSheet.create({
    normalImageDimensions: {
        width: 75,
        height: 75,
        borderRadius: 37,
    },
    smallerImageDimensions: {
        width: 58,
        height: 58,
        borderRadius: 29,
    },
})

export function useUpdateEffect(effect, dependencies = []) {
    const isInitialMount = useRef(true);

    useEffect(() => {
        if (isInitialMount.current) {
            isInitialMount.current = false;
        } else {
            return effect();
        }
    }, dependencies);
}
