import React from 'react'
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, Image } from 'react-native'
import { useThemeContext } from '../ThemeContext'
import { useTranslation } from 'react-i18next'

const ViolationList = ({ date, violations, onClose }) => {
    const { t } = useTranslation()
    const { theme } = useThemeContext()

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Text style={[styles.headerText, theme === 'dark' ? styles.darkHeaderText : styles.lightHeaderText]}>
                    {t('violations_for', {date})}
                </Text>
                <TouchableOpacity onPress={onClose}>
                    <Text style={[styles.closeButton, theme === 'dark' ? styles.darkCloseButton : styles.lightCloseButton]}>
                        {t('close')}
                    </Text>
                </TouchableOpacity>
            </View>
            <ScrollView style={styles.list}>
                {violations.length === 0 ? (
                    <Text style={[styles.noViolations, theme === 'dark' ? styles.darkText : styles.lightText]}>
                        {t('no_violations')}
                    </Text>
                ) : (
                    violations.map((violation, index) => (
                        <View
                            key={index}
                            style={[styles.violationItem, theme === 'dark' ? styles.darkViolationItem : styles.lightViolationItem]}
                        >
                            <Text style={[styles.violationText, theme === 'dark' ? styles.darkText : styles.lightText]}>
                                {violation.description || t('no_description')}
                            </Text>
                            <Text style={[styles.violationSubText, theme === 'dark' ? styles.darkSubText : styles.lightSubText]}>
                                {t('created_at', {time: new Date(violation.created_at).toLocaleTimeString()})}
                            </Text>
                            {violation.latitude && violation.longitude && (
                                <Text style={[styles.violationSubText, theme === 'dark' ? styles.darkSubText : styles.lightSubText]}>
                                    {t('location_coords', {lat: violation.latitude, long: violation.longitude})}
                                </Text>
                            )}
                            {violation.photo_uri && (
                                <Image
                                    source={{ uri: violation.photo_uri }}
                                    style={styles.violationImage}
                                    resizeMode="contain"
                                />
                            )}
                        </View>
                    ))
                )}
            </ScrollView>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 10,
    },
    headerText: {
        fontSize: 18,
        fontWeight: 'bold',
    },
    darkHeaderText: {
        color: '#fff',
    },
    lightHeaderText: {
        color: '#333',
    },
    closeButton: {
        fontSize: 16,
    },
    darkCloseButton: {
        color: '#1DA1F2',
    },
    lightCloseButton: {
        color: '#007bff',
    },
    list: {
        flex: 1,
        paddingHorizontal: 10,
    },
    noViolations: {
        fontSize: 16,
        textAlign: 'center',
        marginTop: 20,
    },
    violationItem: {
        padding: 10,
        marginVertical: 5,
        borderRadius: 5,
    },
    darkViolationItem: {
        backgroundColor: '#444',
    },
    lightViolationItem: {
        backgroundColor: '#f0f0f0',
    },
    violationText: {
        fontSize: 16,
        fontWeight: 'bold',
    },
    violationSubText: {
        fontSize: 14,
        marginTop: 5,
    },
    darkText: {
        color: '#fff',
    },
    lightText: {
        color: '#333',
    },
    darkSubText: {
        color: '#ccc',
    },
    lightSubText: {
        color: '#666',
    },
    violationImage: {
        width: 200,
        height: 150,
        marginTop: 10,
        borderRadius: 5,
    },
})

export default ViolationList