import { View, Text, StyleSheet, TextInput, TouchableOpacity, Image, ScrollView, Alert } from 'react-native'
import { useThemeContext } from '../ThemeContext'
import { useTranslation } from 'react-i18next'
import { useState, useEffect } from 'react'
import * as ImagePicker from 'expo-image-picker'
import { initDatabase, insertViolation, loadViolations } from '../database'

export default function NewScreen() {
    const { theme } = useThemeContext()
    const { t } = useTranslation()
    const [photoUri, setPhotoUri] = useState(null)
    const [location, setLocation] = useState('')
    const [description, setDescription] = useState('')
    const [violations, setViolations] = useState([])

    useEffect(() => {
        const setup = async () => {
            await initDatabase()
            const data = await loadViolations()
            setViolations(data)
            console.log('Saved violations:', data)
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

    const saveViolation = async () => {
        if (!photoUri || !location || !description) {
            Alert.alert(t('error'), t('please_fill_all_fields'))
            return
        }

        try {
            await insertViolation(photoUri, location, description)
            Alert.alert(t('success'), t('violation_saved'))
            setPhotoUri(null)
            setLocation('')
            setDescription('')
            const data = await loadViolations()
            setViolations(data)
            console.log('Saved violations:', data)
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
                placeholder={t('location')}
                placeholderTextColor={theme === 'dark' ? 'gray' : 'darkgray'}
                value={location}
                onChangeText={setLocation}
            />

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

            <Text style={{ color: theme === 'dark' ? 'white' : 'black', fontSize: 16, marginTop: 20, marginBottom: 10 }}>
                {t('saved_violations')}
            </Text>
            {violations.map((item) => (
                <View key={item.id} style={styles.listItem}>
                    <Image source={{ uri: item.photo_uri }} style={styles.listImage} />
                    <Text style={{ color: theme === 'dark' ? 'white' : 'black' }}>{t('location')} {item.location}</Text>
                    <Text style={{ color: theme === 'dark' ? 'white' : 'black' }}>{t('description')} {item.description}</Text>
                    <Text style={{ color: theme === 'dark' ? 'white' : 'black' }}>{t('created')} {item.created_at}</Text>
                </View>
            ))}
        </ScrollView>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
    },
    button: {
        backgroundColor: '#007AFF',
        padding: 10,
        borderRadius: 5,
        alignItems: 'center',
        marginVertical: 10,
    },
    buttonText: {
        color: 'white',
        fontSize: 16,
    },
    image: {
        width: 200,
        height: 150,
        resizeMode: 'contain',
        marginVertical: 10,
    },
    input: {
        borderWidth: 1,
        borderRadius: 5,
        padding: 10,
        marginVertical: 10,
    },
    listItem: {
        marginBottom: 20,
        padding: 10,
        borderWidth: 1,
        borderColor: 'gray',
        borderRadius: 5,
    },
    listImage: {
        width: 100,
        height: 75,
        resizeMode: 'contain',
        marginBottom: 5,
    },
})