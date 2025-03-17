import { ScrollView, Pressable, View, Text, StyleSheet, Image } from 'react-native';
import React, { useState, useEffect, useContext } from 'react';
import { Context } from '../App';

export default function Welcome({ route, navigation }) {

  const { userData, setUserData } = React.useContext(Context);

  return (
    <ScrollView style={styles.container}>
      <View style={styles.headerWrapper}>
        <Image
          style={styles.image}
          source={require('../assets/img/Logo.png')}
          resizeMode="cover"
          accessible={true}
          accessibilityLabel={'Little Lemon Logo'}
        />

        <Text style={styles.headerText}>Little Lemon</Text>
      </View>
      <Text style={styles.regularText}>
        Hello {userData.firstName}! Is {userData.email} still your email?
        Little Lemon is a charming neighborhood bistro that serves simple food
        and classic cocktails in a lively but casual environment. We would love
        to hear your experience with us!
      </Text>

      <Pressable
        onPress={() => {
          navigation.navigate('Profile', { userData });
        }}
        style={styles.activeButton}
      >
        <Text style={styles.activeButtonText}>Go To Profile</Text>
      </Pressable>

    </ScrollView>
  );
}

const cream = '#ebe8df'
const green = '#4A5E57'
const darkerGreen = '#384742'
const lightGrey = '#c2bebe'

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#333333"
  },
  headerWrapper: {
    flexDirection: 'row',
    justifyContent: 'center',
    margin: 10,
  },
  headerText: {
    paddingRight: 10,
    paddingLeft: 20,
    paddingTop: 30,
    paddingBottom: 10,
    fontSize: 30,
    color: '#EDEFEE',
    textAlign: 'center',
  },
  regularText: {
    fontSize: 24,
    padding: 20,
    marginVertical: 8,
    color: '#EDEFEE',
    textAlign: 'center',
  },
  image: {
    width: 100,
    height: 100,
    borderRadius: 20,
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
});


