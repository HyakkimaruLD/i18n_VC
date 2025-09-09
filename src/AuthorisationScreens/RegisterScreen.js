import React, { useState } from 'react'
import { View, Text, TextInput, Button, Alert } from 'react-native'
import { registerUser } from '../database'
import AsyncStorage from '@react-native-async-storage/async-storage'
//
export default function RegisterScreen({ navigation }) {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')

    const handleRegister = async () => {
        const success = await registerUser(email, password)
        if (success) {
            const newUser = { email, password }
            await AsyncStorage.setItem('loggedInUser', JSON.stringify(newUser))
            Alert.alert('Success', 'User registered and logged in!')
            navigation.replace('Main')
        } else {
            Alert.alert('Error', 'User already exists')
        }
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
