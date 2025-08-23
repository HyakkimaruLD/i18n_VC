import { View, Text, StyleSheet } from 'react-native'
import { useThemeContext } from '../ThemeContext'

export default function NewScreen() {
    const { theme } = useThemeContext()
    return (
        <View style={styles.container}>
            <Text style={{ color: theme === 'dark' ? 'white' : 'black' }}>
                New Screen
            </Text>
        </View>
    )
}

const styles = StyleSheet.create({
    container: { flex: 1, alignItems: 'center', justifyContent: 'center' },
})