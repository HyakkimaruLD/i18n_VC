import React, { useState } from 'react'
import { View, Text, TextInput, Alert, TouchableOpacity, StyleSheet } from 'react-native'
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
        <View style={styles.container}>
            <Text style={styles.title}>Register</Text>
            <TextInput
                style={styles.input}
                placeholder="Email"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
            />
            <TextInput
                style={styles.input}
                placeholder="Password"
                value={password}
                onChangeText={setPassword}
                secureTextEntry
            />
            <TouchableOpacity style={styles.button} onPress={handleRegister}>
                <Text style={styles.buttonText}>Register</Text>
            </TouchableOpacity>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        padding: 20,
        backgroundColor: '#f0f4f7'
    },
    title: {
        fontSize: 32,
        fontWeight: 'bold',
        marginBottom: 30,
        textAlign: 'center',
        color: '#333'
    },
    input: {
        height: 50,
        borderColor: '#ccc',
        borderWidth: 1,
        borderRadius: 10,
        paddingHorizontal: 15,
        marginBottom: 20,
        backgroundColor: '#fff',
        fontSize: 16
    },
    button: {
        height: 50,
        backgroundColor: '#007BFF',
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 10,
        shadowColor: '#000',
        shadowOpacity: 0.2,
        shadowOffset: { width: 0, height: 2 },
        shadowRadius: 4,
        elevation: 3
    },
    buttonText: {
        color: '#fff',
        fontSize: 18,
        fontWeight: 'bold'
    }
})
