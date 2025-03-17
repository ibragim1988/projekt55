import { View, Image, StyleSheet } from 'react-native';

export default function Loading() {
    return (
        <View style={styles.container}>
            <Image
                style={styles.image}
                source={require('../assets/img/Logo.png')} />
        </View>
    )
}

const cream = '#ebe8df'

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: cream,
    },
    image: {
        height: 200,
        width: 400,
        resizeMode: 'contain',
    }
})