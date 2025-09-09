import { useEffect, useState } from 'react'
import { View, Text, Modal, Image, TouchableOpacity, StyleSheet } from 'react-native'
import MapView, { Marker } from 'react-native-maps'
import { useThemeContext } from '../ThemeContext'
import { useTranslation } from 'react-i18next'
import { loadViolations } from '../database'

export default function MapScreen() {
    const { theme } = useThemeContext()
    const { t } = useTranslation()
    const [violations, setViolations] = useState([])
    const [selected, setSelected] = useState(null)

    useEffect(() => {
        const fetchData = async () => {
            const data = await loadViolations()
            setViolations(data)
        }
        fetchData()
    }, [])

    return (
        <View style={{ flex: 1 }}>
            <MapView
                style={{ flex: 1 }}
                initialRegion={{
                    latitude: 37.4,
                    longitude: -122.1,
                    latitudeDelta: 6,
                    longitudeDelta: 6,
                }}
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
