import React, { useEffect, useState } from 'react'
import { View, Text, TouchableOpacity, StyleSheet, Alert } from 'react-native'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { useTranslation } from 'react-i18next'
import { useThemeContext } from '../ThemeContext'
import NetInfo from '@react-native-community/netinfo'
import { loginUser } from '../api/authApi'

export default function ProfileScreen({ navigation }) {
    const { theme } = useThemeContext()
    const { t } = useTranslation()
    const [user, setUser] = useState(null)

    const loadUser = async () => {
        const storedUser = await AsyncStorage.getItem('loggedInUser')
        let parsedUser = storedUser ? JSON.parse(storedUser) : null

        const net = await NetInfo.fetch()
        if (net.isConnected && parsedUser) {
            try {
                const response = await loginUser({ email: parsedUser.email, password: parsedUser.password })
                if (response.data?.user) parsedUser = response.data.user
            }
            catch (e) {
                console.log('Server auth failed, using local data')
            }
        }

        setUser(parsedUser)
    }

    useEffect(() => {
        const unsubscribe = navigation.addListener('focus', loadUser)
        return unsubscribe
    }, [navigation])

    const handleLogout = async () => {
        await AsyncStorage.removeItem('loggedInUser')
        setUser(null)
        Alert.alert(t('logged_out'))
    }

    const cardBackground = theme === 'dark' ? '#1e1e1e' : '#fff'
    const textColor = theme === 'dark' ? '#ddd' : '#555'
    const titleColor = theme === 'dark' ? '#fff' : '#333'

    return (
        <View style={[styles.container, { backgroundColor: theme === 'dark' ? '#121212' : '#f5f5f5' }]}>
            {user ? (
                <View style={[styles.card, { backgroundColor: cardBackground }]}>
                    <Text style={[styles.title, { color: titleColor }]}>{t('profile')}</Text>
                    <Text style={[styles.text, { color: textColor }]}>Email: {user.email}</Text>
                    <Text style={[styles.text, { color: textColor }]}>Password: {user.password}</Text>
                    <TouchableOpacity style={styles.button} onPress={handleLogout}>
                        <Text style={styles.buttonText}>{t('logout')}</Text>
                    </TouchableOpacity>
                </View>
            ) : (
                <View style={[styles.card, { backgroundColor: cardBackground }]}>
                    <Text style={[styles.title, { color: titleColor }]}>
                        {t('profile')} ({t('guest')})
                    </Text>
                    <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('Login')}>
                        <Text style={styles.buttonText}>{t('login')}</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('Register')}>
                        <Text style={styles.buttonText}>{t('register')}</Text>
                    </TouchableOpacity>
                </View>
            )}
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
    },
    card: {
        width: '100%',
        padding: 20,
        borderRadius: 16,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 3 },
        shadowOpacity: 0.1,
        shadowRadius: 5,
        elevation: 5,
        alignItems: 'center',
    },
    title: {
        fontSize: 22,
        fontWeight: 'bold',
        marginBottom: 15,
    },
    text: {
        fontSize: 16,
        marginBottom: 8,
    },
    button: {
        backgroundColor: '#007AFF',
        paddingVertical: 12,
        paddingHorizontal: 25,
        borderRadius: 12,
        alignItems: 'center',
        marginTop: 15,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.3,
        shadowRadius: 3,
        elevation: 3,
        width: '80%',
    },
    buttonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: '600',
    },
})
