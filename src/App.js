import { StatusBar } from 'expo-status-bar'
import { StyleSheet, Text, View, Alert, TouchableOpacity } from 'react-native'
import { NavigationContainer, DefaultTheme, DarkTheme } from '@react-navigation/native'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import { createDrawerNavigator } from '@react-navigation/drawer'
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import { useTranslation } from 'react-i18next'
import { useEffect, useState } from 'react'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { loadLanguage } from './i18n'
import { ThemeContext, useThemeContext } from './ThemeContext'
import { initDatabase } from './database'

import CalendarScreen from './Screens/CalendarScreen'
import MapScreen from './Screens/MapScreen'
import NewScreen from './Screens/NewScreen'
import LanguageScreen from './Screens/LanguageScreen'
import ProfileScreen from './Screens/ProfileScreen'
import LoginScreen from './AuthorisationScreens/LoginScreen'
import RegisterScreen from './AuthorisationScreens/RegisterScreen'

const Tab = createBottomTabNavigator()
const Drawer = createDrawerNavigator()
const Stack = createNativeStackNavigator()

function Tabs() {
    const { theme } = useThemeContext()
    const { t } = useTranslation()
    return (
        <Tab.Navigator
            screenOptions={({ route }) => ({
                tabBarIcon: ({ color }) => {
                    let icon
                    if (route.name === t('calendar')) icon = '📅'
                    else if (route.name === t('map')) icon = '🗺️'
                    else if (route.name === t('new')) icon = '➕'
                    return <Text style={{ fontSize: 18, color }}>{icon}</Text>
                },
                tabBarActiveTintColor: theme === 'dark' ? 'white' : 'tomato',
                tabBarInactiveTintColor: theme === 'dark' ? 'gray' : 'gray',
            })}>
            <Tab.Screen name={t('calendar')} component={CalendarScreen} />
            <Tab.Screen name={t('map')} component={MapScreen} />
            <Tab.Screen name={t('new')} component={NewScreen} />
        </Tab.Navigator>
    )
}

function ThemeScreen() {
    const { theme, toggleTheme } = useThemeContext()
    const { t } = useTranslation()
    return (
        <View style={[styles.container, theme === 'dark' ? styles.dark : styles.light]}>
            <Text style={{ color: theme === 'dark' ? 'white' : 'black' }}>
                {t('current_theme')}: {theme === 'dark' ? t('dark') : t('light')}
            </Text>
            <TouchableOpacity onPress={toggleTheme} style={{ marginTop: 20 }}>
                <Text style={{ color: theme === 'dark' ? 'lightblue' : 'blue', fontSize: 16 }}>
                    {t('change_theme')}
                </Text>
            </TouchableOpacity>
        </View>
    )
}
//
// function LogoutScreen({ navigation }) {
//     const { theme } = useThemeContext()
//     const { t } = useTranslation()
//     useEffect(() => {
//         const doLogout = async () => {
//             await AsyncStorage.removeItem('loggedInUser')
//             Alert.alert(t('logged_out'))
//             navigation.navigate('Main', { screen: t('profile') })
//         }
//         doLogout()
//     }, [navigation])
//
//     return (
//         <View style={[styles.container, theme === 'dark' ? styles.dark : styles.light]}>
//             <Text style={{ color: theme === 'dark' ? 'white' : 'black' }}>{t('logged_out')}</Text>
//         </View>
//     )
// }

function DrawerNavigator() {
    const { t } = useTranslation()
    return (
        <Drawer.Navigator initialRouteName={t('home')}>
            <Drawer.Screen name={t('home')} component={Tabs} />
            <Drawer.Screen name={t('theme')} component={ThemeScreen} />
            <Drawer.Screen name={t('language')} component={LanguageScreen} />
            <Drawer.Screen name={t('profile')} component={ProfileScreen} />
        </Drawer.Navigator>
    )
}

export default function App() {
    const { t } = useTranslation()
    const [theme, setTheme] = useState(null)

    useEffect(() => {
        loadLanguage()
        const initApp = async () => {
            await initDatabase()
            const savedTheme = await AsyncStorage.getItem('appTheme')
            setTheme(savedTheme || 'light')
        }
        initApp()
    }, [])

    const toggleTheme = async () => {
        const newTheme = theme === 'light' ? 'dark' : 'light'
        setTheme(newTheme)
        await AsyncStorage.setItem('appTheme', newTheme)
    }

    if (theme === null) {
        return (
            <View style={styles.container}>
                <Text>{t('loading')}</Text>
            </View>
        )
    }

    return (
        <ThemeContext.Provider value={{ theme, toggleTheme }}>
            <NavigationContainer theme={theme === 'dark' ? DarkTheme : DefaultTheme}>
                <Stack.Navigator screenOptions={{ headerShown: false }}>
                    <Stack.Screen name="Main" component={DrawerNavigator} />
                    <Stack.Screen name="Login" component={LoginScreen} />
                    <Stack.Screen name="Register" component={RegisterScreen} />
                </Stack.Navigator>
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
