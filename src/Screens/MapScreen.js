import React, { useEffect, useState } from 'react'
import { View, Text, Modal, Image, TouchableOpacity, StyleSheet, Alert } from 'react-native'
import MapView, { Marker } from 'react-native-maps'
import { useThemeContext } from '../ThemeContext'
import { useTranslation } from 'react-i18next'
import * as Location from 'expo-location'
import { useFocusEffect } from '@react-navigation/native'
import NetInfo from '@react-native-community/netinfo'
import { getViolations } from '../api/violationApi'
import { loadViolations } from '../database'

export default function MapScreen() {
    const { theme } = useThemeContext()
    const { t } = useTranslation()
    const [violations, setViolations] = useState([])
    const [selected, setSelected] = useState(null)
    const [region, setRegion] = useState(null)

    const fetchData = async () => {
        const net = await NetInfo.fetch()

        if (net.isConnected) {
            try {
                const response = await getViolations()
                setViolations(response.data)
            } catch (error) {
                console.log('Server fetch failed, loading local violations:', error.message)
                const localData = await loadViolations()
                setViolations(localData)
            }
        } else {
            try {
                const localData = await loadViolations()
                setViolations(localData)
            } catch (error) {
                console.log('Error loading local violations:', error.message)
            }
        }
    }

    useFocusEffect(
        React.useCallback(() => {
            fetchData()
        }, [])
    )

    useEffect(() => {
        const getLocation = async () => {
            let { status } = await Location.requestForegroundPermissionsAsync()
            if (status !== 'granted') {
                Alert.alert(t('permission_required'), t('location_permission_needed'))
                return
            }

            let location = await Location.getCurrentPositionAsync({})
            setRegion({
                latitude: location.coords.latitude,
                longitude: location.coords.longitude,
                latitudeDelta: 0.05,
                longitudeDelta: 0.05,
            })
        }

        getLocation()
    }, [])

    return (
        <View style={{ flex: 1 }}>
            {region && (
                <MapView
                    style={{ flex: 1 }}
                    initialRegion={region}
                    showsUserLocation={true}
                >
                    {violations.map(v => (
                        <Marker
                            key={v.id}
                            coordinate={{ latitude: v.latitude, longitude: v.longitude }}
                            title={t('description')}
                            description={v.description}
                            onPress={() => setSelected(v)}
                        />
                    ))}
                </MapView>
            )}

            <Modal visible={!!selected} transparent animationType="slide">
                <View style={styles.modalOverlay}>
                    <View style={styles.modalContent}>
                        {selected && (
                            <>
                                <Image
                                    source={{ uri: selected.photo_uri }}
                                    style={styles.modalImage}
                                />
                                <Text style={styles.modalText}>
                                    {t('description')}: {selected.description}
                                </Text>
                                <Text style={styles.modalText}>
                                    {t('created')}: {selected.created_at}
                                </Text>
                                <Text style={styles.modalText}>
                                    Lat: {selected.latitude}
                                </Text>
                                <Text style={styles.modalText}>
                                    Lng: {selected.longitude}
                                </Text>
                            </>
                        )}
                        <TouchableOpacity onPress={() => setSelected(null)}>
                            <Text style={styles.closeButton}>{t('close')}</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>
        </View>
    )
}

const styles = StyleSheet.create({
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.5)',
        justifyContent: 'center',
    },
    modalContent: {
        backgroundColor: 'white',
        margin: 20,
        padding: 20,
        borderRadius: 10,
    },
    modalImage: {
        width: '100%',
        height: 200,
        marginBottom: 10,
        borderRadius: 10,
    },
    modalText: {
        fontSize: 16,
        marginBottom: 5,
    },
    closeButton: {
        color: 'blue',
        marginTop: 10,
        textAlign: 'center',
        fontSize: 18,
    },
})
