import React, { useState } from 'react'
import { View, Text, TextInput, Button, Alert } from 'react-native'
import { loginUser } from '../database'
import AsyncStorage from '@react-native-async-storage/async-storage'
//
export default function LoginScreen({ navigation }) {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')

    const handleLogin = async () => {
        const user = await loginUser(email, password)
        if (user) {
            const loggedUser = { email: user.email, password: user.password }
            await AsyncStorage.setItem('loggedInUser', JSON.stringify(loggedUser))
            Alert.alert('Success', 'Logged in!')
            navigation.replace('Main')
        } else {
            Alert.alert('Error', 'Invalid credentials')
        }
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
