import React, { useState } from 'react'
import { View, Text, TextInput, Button, Alert } from 'react-native'
import AsyncStorage from '@react-native-async-storage/async-storage'
import NetInfo from '@react-native-community/netinfo'
import { loginUser as loginUserAPI } from '../api/authApi'

export default function LoginScreen({ navigation }) {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')

    const handleLogin = async () => {
        const userData = { email, password }
        const net = await NetInfo.fetch()

        if (net.isConnected) {
            try {
                const response = await loginUserAPI(userData)
                if (response.data?.ok && response.data.user) {
                    const loggedUser = {
                        email: response.data.user.email,
                        password
                    }
                    await AsyncStorage.setItem('loggedInUser', JSON.stringify(loggedUser))
                    Alert.alert('Success', 'Logged in online!')
                    navigation.replace('Main')
                    return
                } else {
                    Alert.alert('Error', response.data?.error || 'Invalid credentials online')
                    return
                }
            } catch (e) {
                console.log('Server unreachable, falling back to local login', e)
            }
        }

        const storedUser = await AsyncStorage.getItem('loggedInUser')
        if (storedUser) {
            const parsedUser = JSON.parse(storedUser)
            if (parsedUser.email === email && parsedUser.password === password) {
                Alert.alert('Success', 'Logged in offline!')
                navigation.replace('Main')
                return
            }
        }

        Alert.alert('Error', 'Invalid credentials')
    }

    return (
        <View style={{ flex: 1, justifyContent: 'center', padding: 20 }}>
            <Text>Login</Text>
            <TextInput placeholder="Email" value={email} onChangeText={setEmail} />
            <TextInput placeholder="Password" value={password} onChangeText={setPassword} secureTextEntry />
            <Button title="Login" onPress={handleLogin} />
        </View>
    )
}
