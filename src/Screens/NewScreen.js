import { View, Text, StyleSheet, TextInput, TouchableOpacity, Image, ScrollView, Alert } from 'react-native'
import { useThemeContext } from '../ThemeContext'
import { useTranslation } from 'react-i18next'
import { useState, useEffect } from 'react'
import * as ImagePicker from 'expo-image-picker'
import * as Location from 'expo-location'
import NetInfo from '@react-native-community/netinfo'
import { initDatabase, insertViolation, loadViolations, loadUnsyncedViolations, markViolationAsSynced, loginUser } from '../database'
import { createViolation } from '../api/violationApi'
import AsyncStorage from '@react-native-async-storage/async-storage'

export default function NewScreen({ navigation }) {
    const { theme } = useThemeContext()
    const { t } = useTranslation()
    const [photoUri, setPhotoUri] = useState(null)
    const [coords, setCoords] = useState(null)
    const [description, setDescription] = useState('')
    const [violations, setViolations] = useState([])
    const [isRegistered, setIsRegistered] = useState(false)
    const [hasOfflineViolations, setHasOfflineViolations] = useState(false)

    const checkUser = async () => {
        await initDatabase()

        const storedUser = await AsyncStorage.getItem('loggedInUser')
        if (storedUser) {
            const { email, password } = JSON.parse(storedUser)
            const user = await loginUser(email, password)
            if (user) {
                setIsRegistered(true)

                const data = await loadViolations()
                setViolations(data)
                setHasOfflineViolations(data.some(v => v.synced === 0))

                let { status } = await Location.requestForegroundPermissionsAsync()
                if (status === 'granted') {
                    let location = await Location.getCurrentPositionAsync({})
                    setCoords({
                        latitude: location.coords.latitude,
                        longitude: location.coords.longitude,
                    })
                } else {
                    Alert.alert(t('permission_required'), t('location_permission_needed'))
                }
                return
            }
        }
        setIsRegistered(false)
    }

    useEffect(() => {
        const unsubscribe = navigation.addListener('focus', checkUser)
        return unsubscribe
    }, [navigation])

    const pickImage = async () => {
        const { status } = await ImagePicker.requestCameraPermissionsAsync()
        if (status !== 'granted') {
            Alert.alert(t('permission_required'), t('camera_permission_needed'))
            return
        }

        const result = await ImagePicker.launchCameraAsync({
            allowsEditing: true,
            aspect: [4, 3],
        })

        if (!result.canceled) {
            setPhotoUri(result.assets[0].uri)
        }
    }

    const uploadImageToCloudinary = async () => {
        if (!photoUri) return null
        const fileName = photoUri.split('/').pop()
        const extension = fileName.split('.').pop().toLowerCase()
        let mimeType = 'image/jpeg'
        if (extension === 'png') mimeType = 'image/png'
        else if (extension === 'gif') mimeType = 'image/gif'
        else if (extension === 'heic') mimeType = 'image/heic'
        else if (extension === 'webp') mimeType = 'image/webp'

        const formData = new FormData()
        formData.append('file', {
            uri: photoUri,
            name: fileName,
            type: mimeType,
        })
        formData.append('upload_preset', 'TestTest')

        try {
            const response = await fetch('https://api.cloudinary.com/v1_1/dyqoncpu7/upload',
                { method: 'POST', body: formData })
            const data = await response.json()
            return data.secure_url || null
        }
        catch (error) {
            console.log('Upload failed:', error)
            return null
        }
    }

    const saveViolation = async () => {
        if (!photoUri || !coords || !description) {
            Alert.alert(t('error'), t('please_fill_all_fields'))
            return
        }

        try {
            const cloudUrl = await uploadImageToCloudinary()
            await insertViolation(cloudUrl || photoUri, coords.latitude, coords.longitude, description)

            const net = await NetInfo.fetch()
            if (net.isConnected) {
                const offlineViolations = await loadUnsyncedViolations()
                for (let v of offlineViolations) {
                    try {
                        await createViolation({
                            photo_uri: v.photo_uri,
                            latitude: v.latitude,
                            longitude: v.longitude,
                            description: v.description
                        })
                        await markViolationAsSynced(v.id)
                    }
                    catch (err) {
                        console.log('Skipping network error:', err.message)
                    }
                }
            }

            Alert.alert(t('success'), t('violation_saved'))
            setPhotoUri(null)
            setDescription('')
            const data = await loadViolations()
            setViolations(data)
            setHasOfflineViolations(data.some(v => v.synced === 0))
        }
        catch (error) {
            console.error('Error saving violation locally:', error)
            Alert.alert(t('error'), t('failed_to_save_violation'))
        }
    }

    const synchronize = async () => {
        try {
            const offlineViolations = await loadUnsyncedViolations()
            if (!offlineViolations.length) return

            for (let v of offlineViolations) {
                try {
                    await createViolation({
                        photo_uri: v.photo_uri,
                        latitude: v.latitude,
                        longitude: v.longitude,
                        description: v.description
                    })
                    await markViolationAsSynced(v.id)
                } catch (err) {
                    console.log('Skipping network error:', err.message)
                }
            }

            Alert.alert(t('success'), t('offline_violations_synced'))
            const data = await loadViolations()
            setViolations(data)
            setHasOfflineViolations(data.some(v => v.synced === 0))
        } catch (error) {
            console.error('Sync failed:', error)
        }
    }

    if (!isRegistered) {
        return (
            <View style={styles.centered}>
                <View style={[styles.warningBox, { backgroundColor: theme === 'dark' ? '#2c2c2c' : '#ffe6e6' }]}>
                    <Text style={[styles.warningText, { color: theme === 'dark' ? '#ff6666' : '#cc0000' }]}>
                        Only for registered users
                    </Text>
                </View>
                <TouchableOpacity
                    style={styles.button}
                    onPress={() => navigation.navigate('Login')}
                >
                    <Text style={styles.buttonText}>{t('login')}</Text>
                </TouchableOpacity>
            </View>
        )
    }

    return (
        <ScrollView style={[styles.container, { backgroundColor: theme === 'dark' ? '#121212' : '#f5f5f5' }]}>
            <Text style={[styles.title, { color: theme === 'dark' ? '#fff' : '#333' }]}>{t('new')}</Text>

            <TouchableOpacity style={styles.button} onPress={pickImage}>
                <Text style={styles.buttonText}>{t('take_photo')}</Text>
            </TouchableOpacity>

            {photoUri && <Image source={{ uri: photoUri }} style={styles.image} />}

            <TextInput
                style={[styles.input, {
                    color: theme === 'dark' ? '#fff' : '#333',
                    borderColor: theme === 'dark' ? '#555' : '#ccc',
                    backgroundColor: theme === 'dark' ? '#1e1e1e' : '#fff'
                }]}
                placeholder={t('description')}
                placeholderTextColor={theme === 'dark' ? '#aaa' : '#888'}
                value={description}
                onChangeText={setDescription}
                multiline
            />

            <TouchableOpacity style={styles.button} onPress={saveViolation}>
                <Text style={styles.buttonText}>{t('save_violation')}</Text>
            </TouchableOpacity>

            {hasOfflineViolations && (
                <TouchableOpacity style={[styles.button, { backgroundColor: '#28a745' }]} onPress={synchronize}>
                    <Text style={styles.buttonText}>{t('synchronize')}</Text>
                </TouchableOpacity>
            )}
        </ScrollView>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        backgroundColor: '#f5f5f5',
    },
    title: {
        fontSize: 22,
        fontWeight: 'bold',
        marginBottom: 20,
        color: '#333',
    },
    button: {
        backgroundColor: '#007AFF',
        paddingVertical: 14,
        paddingHorizontal: 20,
        borderRadius: 12,
        alignItems: 'center',
        marginVertical: 12,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 3 },
        shadowOpacity: 0.3,
        shadowRadius: 4,
        elevation: 5,
    },
    buttonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: '600',
    },
    image: {
        width: '100%',
        height: 200,
        borderRadius: 12,
        resizeMode: 'cover',
        marginVertical: 15,
        borderWidth: 1,
        borderColor: '#ddd',
    },
    input: {
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 12,
        padding: 14,
        fontSize: 16,
        backgroundColor: '#fff',
        color: '#333',
        marginVertical: 10,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 2,
        elevation: 2,
    },
    centered: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    },
    errorText: {
        fontSize: 18,
        color: 'red',
        fontWeight: 'bold'
    },
    warningBox: {
        padding: 20,
        borderRadius: 16,
        borderWidth: 1,
        borderColor: '#ff4d4d',
        marginBottom: 20,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 3 },
        shadowOpacity: 0.2,
        shadowRadius: 4,
        elevation: 4,
    },
    warningText: {
        fontSize: 18,
        fontWeight: 'bold',
        textAlign: 'center',
    }
})
