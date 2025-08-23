import { View, Text, StyleSheet } from 'react-native'

export default function NewScreen() {
    return (
        <View style={styles.container}>
            <Text>New Screen</Text>
        </View>
    )
}

const styles = StyleSheet.create({
    container: { flex: 1, alignItems: 'center', justifyContent: 'center' },
})
