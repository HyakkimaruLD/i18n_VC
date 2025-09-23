import React, { useState } from 'react'
import { View, Text, TextInput, Button, Alert } from 'react-native'
import AsyncStorage from '@react-native-async-storage/async-storage'
import NetInfo from '@react-native-community/netinfo'
import { registerUser as registerUserAPI } from '../api/authApi'

export default function RegisterScreen({ navigation }) {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')

    const handleRegister = async () => {
        const userData = { email, password }
        const net = await NetInfo.fetch()

        if (net.isConnected) {
            try {
                const response = await registerUserAPI(userData)
                if (response.data?.ok) {
                    await AsyncStorage.setItem('loggedInUser', JSON.stringify(userData))
                    Alert.alert('Success', 'User registered online and logged in!')
                    navigation.replace('Main')
                    return
                } else {
                    Alert.alert('Error', response.data?.error || 'Registration failed online')
                    return
                }
            } catch (e) {
                console.log('Server unavailable, saving locally', e)
            }
        }

        await AsyncStorage.setItem('loggedInUser', JSON.stringify(userData))
        Alert.alert('Success', 'User registered locally (offline)!')
        navigation.replace('Main')
    }

    return (
        <View style={{ flex: 1, justifyContent: 'center', padding: 20 }}>
            <Text>Register</Text>
            <TextInput placeholder="Email" value={email} onChangeText={setEmail} />
            <TextInput placeholder="Password" value={password} onChangeText={setPassword} secureTextEntry />
            <Button title="Register" onPress={handleRegister} />
        </View>
    )
}
