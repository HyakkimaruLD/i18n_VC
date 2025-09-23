import { View, Text, StyleSheet, TextInput, TouchableOpacity, Image, ScrollView, Alert } from 'react-native'
import { useThemeContext } from '../ThemeContext'
import { useTranslation } from 'react-i18next'
import { useState, useEffect } from 'react'
import * as ImagePicker from 'expo-image-picker'
import * as Location from 'expo-location'
import NetInfo from '@react-native-community/netinfo'
import { initDatabase, insertViolation, loadViolations } from '../database'
import { createViolation } from '../api/violationApi'

export default function NewScreen() {
    const { theme } = useThemeContext()
    const { t } = useTranslation()
    const [photoUri, setPhotoUri] = useState(null)
    const [coords, setCoords] = useState(null)
    const [description, setDescription] = useState('')
    const [violations, setViolations] = useState([])

    useEffect(() => {
        const setup = async () => {
            await initDatabase()
            const data = await loadViolations()
            setViolations(data)

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
        }
        setup()
    }, [])

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
        } catch (error) {
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
                await createViolation({
                    photo_uri: cloudUrl || photoUri,
                    latitude: coords.latitude,
                    longitude: coords.longitude,
                    description
                })
            }

            Alert.alert(t('success'), t('violation_saved'))
            setPhotoUri(null)
            setDescription('')
            const data = await loadViolations()
            setViolations(data)
        } catch (error) {
            console.error('Error saving violation:', error)
            Alert.alert(t('error'), t('failed_to_save_violation'))
        }
    }

    return (
        <ScrollView style={[styles.container, { backgroundColor: theme === 'dark' ? 'black' : 'white' }]}>
            <Text style={{ color: theme === 'dark' ? 'white' : 'black', fontSize: 18, marginBottom: 10 }}>
                {t('new')}
            </Text>

            <TouchableOpacity style={styles.button} onPress={pickImage}>
                <Text style={styles.buttonText}>{t('take_photo')}</Text>
            </TouchableOpacity>
            {photoUri && <Image source={{ uri: photoUri }} style={styles.image} />}

            <TextInput
                style={[styles.input, { color: theme === 'dark' ? 'white' : 'black', borderColor: theme === 'dark' ? 'gray' : 'lightgray' }]}
                placeholder={t('description')}
                placeholderTextColor={theme === 'dark' ? 'gray' : 'darkgray'}
                value={description}
                onChangeText={setDescription}
                multiline
            />

            <TouchableOpacity style={styles.button} onPress={saveViolation}>
                <Text style={styles.buttonText}>{t('save_violation')}</Text>
            </TouchableOpacity>
        </ScrollView>
    )
}

const styles = StyleSheet.create({
    container: { flex: 1, padding: 20 },
    button: {
        backgroundColor: '#007AFF',
        padding: 10,
        borderRadius: 5,
        alignItems: 'center',
        marginVertical: 10,
    },
    buttonText: {
        color: 'white',
        fontSize: 16
    },
    image: {
        width: 200,
        height: 150,
        resizeMode: 'contain',
        marginVertical: 10
    },
    input: {
        borderWidth: 1,
        borderRadius: 5,
        padding: 10,
        marginVertical: 10
    },
})
