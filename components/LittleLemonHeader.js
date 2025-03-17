import * as React from 'react';
import { View, SafeAreaView, Image, Text, StatusBar, StyleSheet } from 'react-native';

export default function LittleLemonHeader() {
  return (
    <>
      <StatusBar style={styles.statusBar} />
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.container}>
          <Image
            style={styles.image}
            source={require('../assets/img/Logo.png')} />
        </View>
      </SafeAreaView>
    </>
  );
}

const styles = StyleSheet.create({
  statusBar: {
    backgroundColor: "#ebe8df",
    barStyle: "dark-content"
  },
  safeArea: {
    backgroundColor: "#ebe8df",
  },
  container: {
    paddingVertical: 15,
    backgroundColor: '#ebe8df',
    alignItems: 'center',
    justifyContent: 'center',
  },
  image: {
    height: 50,
    resizeMode: 'cover',
    // backgroundColor: '#ebe8df',
  },
});
