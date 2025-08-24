import { View, Text, StyleSheet } from 'react-native'
import { useThemeContext } from '../ThemeContext'
import { useTranslation } from 'react-i18next'

export default function MapScreen() {
    const { theme } = useThemeContext()
    const { t } = useTranslation()
    return (
        <View style={styles.container}>
            <Text style={{ color: theme === 'dark' ? 'white' : 'black' }}>
                {t('map')}
            </Text>
        </View>
    )
}

const styles = StyleSheet.create({
    container: { flex: 1, alignItems: 'center', justifyContent: 'center' },
})