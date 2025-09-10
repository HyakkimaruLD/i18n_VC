import React, { useState } from 'react'
import { View, StyleSheet } from 'react-native'
import { useThemeContext } from '../ThemeContext'
import { useTranslation } from 'react-i18next'
import { useFocusEffect } from '@react-navigation/native'
import Calendar from '../CalendarComponents/Calendar'

export default function CalendarScreen() {
    const { theme } = useThemeContext()
    const { t } = useTranslation()
    const [refreshKey, setRefreshKey] = useState(0)

    useFocusEffect(
        React.useCallback(() => {
            setRefreshKey(prev => prev + 1)
        }, [])
    )

    return (
        <View style={[styles.container, theme === 'dark' ? styles.dark : styles.light]}>
            <Calendar refreshKey={refreshKey} />
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    dark: {
        backgroundColor: '#222',
    },
    light: {
        backgroundColor: 'white',
    },
})