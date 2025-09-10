import React from 'react'
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native'
import { useThemeContext } from '../ThemeContext'

const Header = ({ month, year, onPrev, onNext, onToday }) => {
    const { theme } = useThemeContext()
    return (
        <View style={[styles.header, theme === 'dark' ? styles.darkHeader : styles.lightHeader]}>
            <View style={styles.title}>
                <Text style={[styles.month, theme === 'dark' ? styles.darkMonth : styles.lightMonth]}>
                    {month} {year}
                </Text>
                <TouchableOpacity onPress={onToday}>
                    <Text style={[styles.today, theme === 'dark' ? styles.darkToday : styles.lightToday]}>
                        Today
                    </Text>
                </TouchableOpacity>
            </View>
            <View style={styles.arrows}>
                <TouchableOpacity onPress={onPrev} style={styles.arrow}>
                    <Text style={[styles.arrowText, theme === 'dark' ? styles.darkArrowText : styles.lightArrowText]}>
                        ◄
                    </Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={onNext} style={styles.arrow}>
                    <Text style={[styles.arrowText, theme === 'dark' ? styles.darkArrowText : styles.lightArrowText]}>
                        ►
                    </Text>
                </TouchableOpacity>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 10,
    },
    darkHeader: {
        backgroundColor: '#333',
    },
    lightHeader: {
        backgroundColor: '#fff',
    },
    title: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    arrows: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    month: {
        fontSize: 18,
    },
    darkMonth: {
        color: '#fff',
    },
    lightMonth: {
        color: '#333',
    },
    today: {
        marginLeft: 10,
    },
    darkToday: {
        color: '#1DA1F2',
    },
    lightToday: {
        color: '#007bff',
    },
    arrow: {
        paddingHorizontal: 10,
    },
    arrowText: {
        fontSize: 20,
    },
    darkArrowText: {
        color: '#fff',
    },
    lightArrowText: {
        color: '#333',
    },
})

export default Header