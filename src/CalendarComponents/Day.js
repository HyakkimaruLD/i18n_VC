import React from 'react'
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native'
import { useThemeContext } from '../ThemeContext'

const Day = ({ day, isCurrentMonth, hasViolations, onPress }) => {
    const { theme } = useThemeContext()
    return (
        <TouchableOpacity
            onPress={onPress}
            style={[styles.day, theme === 'dark' ? styles.darkDay : styles.lightDay]}
        >
            <View style={styles.dayContainer}>
                <Text
                    style={[
                        styles.dayText,
                        isCurrentMonth
                            ? (theme === 'dark' ? styles.darkCurrentMonth : styles.lightCurrentMonth)
                            : (theme === 'dark' ? styles.darkOtherMonth : styles.lightOtherMonth)
                    ]}
                >
                    {day}
                </Text>
                {hasViolations && isCurrentMonth && (
                    <View style={styles.violationIndicator} />
                )}
            </View>
        </TouchableOpacity>
    )
}

const styles = StyleSheet.create({
    day: {
        width: '14%',
        height: '21%',
        justifyContent: 'center',
        alignItems: 'center',
    },
    darkDay: {
        backgroundColor: '#333',
    },
    lightDay: {
        backgroundColor: '#fff',
    },
    dayContainer: {
        position: 'relative',
        justifyContent: 'center',
        alignItems: 'center',
    },
    dayText: {
        fontSize: 16,
    },
    darkCurrentMonth: {
        color: '#fff',
    },
    lightCurrentMonth: {
        color: '#333',
    },
    darkOtherMonth: {
        color: '#666',
    },
    lightOtherMonth: {
        color: '#aaa',
    },
    violationIndicator: {
        position: 'absolute',
        bottom: -2,
        width: 6,
        height: 6,
        borderRadius: 3,
        backgroundColor: 'red',
    },
})

export default Day