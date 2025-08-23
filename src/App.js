import { StatusBar } from 'expo-status-bar'
import { StyleSheet, Text, View, Alert, TouchableOpacity } from 'react-native'
import { NavigationContainer, DefaultTheme, DarkTheme } from '@react-navigation/native'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import { createDrawerNavigator } from '@react-navigation/drawer'
import { useTranslation } from 'react-i18next'
import { useEffect, useState } from 'react'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { loadLanguage } from './i18n'
import { ThemeContext, useThemeContext } from './ThemeContext'

import CalendarScreen from './Screens/CalendarScreen'
import MapScreen from './Screens/MapScreen'
import NewScreen from './Screens/NewScreen'

const Tab = createBottomTabNavigator()
const Drawer = createDrawerNavigator()

// Tabs
function Tabs() {
    const { theme } = useThemeContext()
    return (
        <Tab.Navigator
            screenOptions={({ route }) => ({
                tabBarIcon: ({ color }) => {
                    let icon
                    if (route.name === 'Calendar')
                    {
                        icon = '📅'
                    }
                    else if (route.name === 'Map')
                    {
                        icon = '🗺️'
                    }
                    else if (route.name === 'New')
                    {
                        icon = '➕'
                    }
                    return <Text style={{ fontSize: 18, color }}>{icon}</Text>
                },
                tabBarActiveTintColor: theme === 'dark' ? 'white' : 'tomato',
                tabBarInactiveTintColor: theme === 'dark' ? 'gray' : 'gray',
            })}>
            <Tab.Screen name="Calendar" component={CalendarScreen} />
            <Tab.Screen name="Map" component={MapScreen} />
            <Tab.Screen name="New" component={NewScreen} />
        </Tab.Navigator>
    )
}

// Drawer screens
function ThemeScreen() {
    const { theme, toggleTheme } = useThemeContext()
    return (
        <View style={[styles.container, theme === 'dark' ? styles.dark : styles.light]}>
            <Text style={{ color: theme === 'dark' ? 'white' : 'black' }}>
                Поточна тема: {theme === 'dark' ? 'Чорна' : 'Біла'}
            </Text>
            <TouchableOpacity onPress={toggleTheme} style={{ marginTop: 20 }}>
                <Text style={{ color: theme === 'dark' ? 'lightblue' : 'blue', fontSize: 16 }}>
                    Змінити тему
                </Text>
            </TouchableOpacity>
        </View>
    )
}

function LanguageScreen() {
    const { theme } = useThemeContext()
    return (
        <View style={[styles.container, theme === 'dark' ? styles.dark : styles.light]}>
            <Text style={{ color: theme === 'dark' ? 'white' : 'black' }}>
                Вибір мови (укр/англ, поки не працює)
            </Text>
        </View>
    )
}

function ProfileScreen() {
    const { theme } = useThemeContext()
    return (
        <View style={[styles.container, theme === 'dark' ? styles.dark : styles.light]}>
            <Text style={{ color: theme === 'dark' ? 'white' : 'black' }}>Це ви</Text>
        </View>
    )
}

function LogoutScreen({ navigation }) {
    const { theme } = useThemeContext()
    useEffect(() => {
        Alert.alert('Ви вийшли')
        navigation.goBack()
    }, [])
    return (
        <View style={[styles.container, theme === 'dark' ? styles.dark : styles.light]}>
            <Text style={{ color: theme === 'dark' ? 'white' : 'black' }}>Ви вийшли</Text>
        </View>
    )
}

export default function App() {
    const { t } = useTranslation()
    const [theme, setTheme] = useState(null)

    useEffect(() => {
        loadLanguage()
        const loadTheme = async () => {
            const savedTheme = await AsyncStorage.getItem('appTheme')
            setTheme(savedTheme || 'light')
        }
        loadTheme()
    }, [])

    const toggleTheme = async () => {
        const newTheme = theme === 'light' ? 'dark' : 'light'
        setTheme(newTheme)
        await AsyncStorage.setItem('appTheme', newTheme)
    }

    if (theme === null) {
        return (
            <View style={styles.container}>
                <Text>Loading...</Text>
            </View>
        )
    }

    return (
        <ThemeContext.Provider value={{ theme, toggleTheme }}>
            <NavigationContainer theme={theme === 'dark' ? DarkTheme : DefaultTheme}>
                <Drawer.Navigator initialRouteName="Home">
                    <Drawer.Screen name="Home" component={Tabs} />
                    <Drawer.Screen name="Theme" component={ThemeScreen} />
                    <Drawer.Screen name="Language" component={LanguageScreen} />
                    <Drawer.Screen name="Profile" component={ProfileScreen} />
                    <Drawer.Screen name="Logout" component={LogoutScreen} />
                </Drawer.Navigator>
                <StatusBar style={theme === 'dark' ? 'light' : 'dark'} />
            </NavigationContainer>
        </ThemeContext.Provider>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    dark: {
        backgroundColor: 'black',
    },
    light: {
        backgroundColor: 'white',
    },
})