import React, { useState, useEffect } from 'react'
import { View, Text, Button, Alert } from 'react-native'
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
                if (response.data?.user) {
                    parsedUser = response.data.user
                }
            } catch (e) {
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

    return (
        <View style={{
            flex: 1,
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: theme === 'dark' ? 'black' : 'white'
        }}>
            {user ? (
                <>
                    <Text style={{ color: theme === 'dark' ? 'white' : 'black', fontSize: 18 }}>
                        {t('profile')}
                    </Text>
                    <Text style={{ color: theme === 'dark' ? 'white' : 'black' }}>
                        Email: {user.email}
                    </Text>
                    <Text style={{ color: theme === 'dark' ? 'white' : 'black' }}>
                        Password: {user.password}
                    </Text>
                    <Button title="Logout" onPress={handleLogout} />
                </>
            ) : (
                <>
                    <Text style={{ color: theme === 'dark' ? 'white' : 'black', fontSize: 18 }}>
                        {t('profile')} ({t('guest')})
                    </Text>
                    <Button title="Login" onPress={() => navigation.navigate('Login')} />
                    <Button title="Register" onPress={() => navigation.navigate('Register')} />
                </>
            )}
        </View>
    )
}
