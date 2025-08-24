import { View, Text, StyleSheet, TouchableOpacity } from 'react-native'
import { useThemeContext } from '../ThemeContext'
import { useTranslation } from 'react-i18next'
import { changeLanguage } from '../i18n'

export default function LanguageScreen() {
    const { theme } = useThemeContext()
    const { t } = useTranslation()

    const handleLanguageChange = async (lang) => {
        await changeLanguage(lang)
    }

    return (
        <View style={[styles.container, theme === 'dark' ? styles.dark : styles.light]}>
            <Text style={[styles.title, { color: theme === 'dark' ? 'white' : 'black' }]}>
                {t('select_language')}
            </Text>
            <TouchableOpacity
                style={[styles.button, theme === 'dark' ? styles.buttonDark : styles.buttonLight]}
                onPress={() => handleLanguageChange('en')}>
                <Text style={[styles.buttonText, { color: theme === 'dark' ? 'white' : 'black' }]}>
                    {t('english')}
                </Text>
            </TouchableOpacity>
            <TouchableOpacity
                style={[styles.button, theme === 'dark' ? styles.buttonDark : styles.buttonLight]}
                onPress={() => handleLanguageChange('uk')}>
                <Text style={[styles.buttonText, { color: theme === 'dark' ? 'white' : 'black' }]}>
                    {t('ukrainian')}
                </Text>
            </TouchableOpacity>
            <TouchableOpacity
                style={[styles.button, theme === 'dark' ? styles.buttonDark : styles.buttonLight]}
                onPress={() => handleLanguageChange('ja')}>
                <Text style={[styles.buttonText, { color: theme === 'dark' ? 'white' : 'black' }]}>
                    {t('japanese')}
                </Text>
            </TouchableOpacity>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    dark: {
        backgroundColor: 'black',
    },
    light: {
        backgroundColor: 'white',
    },
    title: {
        fontSize: 20,
        marginBottom: 20,
    },
    button: {
        padding: 10,
        marginVertical: 5,
        borderRadius: 5,
        width: 200,
        alignItems: 'center',
    },
    buttonLight: {
        backgroundColor: '#e0e0e0',
    },
    buttonDark: {
        backgroundColor: '#333',
    },
    buttonText: {
        fontSize: 16,
    },
})