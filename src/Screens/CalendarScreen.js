import { View, Text, StyleSheet } from 'react-native'

export default function CalendarScreen() {
    return (
        <View style={styles.container}>
            <Text>Calendar Screen</Text>
        </View>
    )
}

const styles = StyleSheet.create({
    container: { flex: 1, alignItems: 'center', justifyContent: 'center' },
})
