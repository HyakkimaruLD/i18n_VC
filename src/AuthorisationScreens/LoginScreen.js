import React, { useState } from 'react'
import { View, Text, TextInput, Alert, TouchableOpacity, StyleSheet } from 'react-native'
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
                    const loggedUser = { email: response.data.user.email, password }
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
        <View style={styles.container}>
            <Text style={styles.title}>Login</Text>
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
            <TouchableOpacity style={styles.button} onPress={handleLogin}>
                <Text style={styles.buttonText}>Login</Text>
            </TouchableOpacity>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        padding: 20,
        backgroundColor: '#e8f0fe'
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
        backgroundColor: '#28a745',
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
