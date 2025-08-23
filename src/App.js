import { StatusBar } from 'expo-status-bar'
import { StyleSheet, Text, View, Alert } from 'react-native'
import { NavigationContainer } from '@react-navigation/native'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import { createDrawerNavigator } from '@react-navigation/drawer'
import { useTranslation } from 'react-i18next'
import { useEffect } from 'react'
import { loadLanguage } from './i18n'

import CalendarScreen from './Screens/CalendarScreen'
import MapScreen from './Screens/MapScreen'
import NewScreen from './Screens/NewScreen'

const Tab = createBottomTabNavigator()
const Drawer = createDrawerNavigator()

//Tabs
function Tabs() {
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
                tabBarActiveTintColor: 'tomato',
                tabBarInactiveTintColor: 'gray',
            })}
        >
            <Tab.Screen name="Calendar" component={CalendarScreen} />
            <Tab.Screen name="Map" component={MapScreen} />
            <Tab.Screen name="New" component={NewScreen} />
        </Tab.Navigator>
    )
}

//Drawer screen
function ThemeScreen() {
    return (
        <View style={styles.container}>
            <Text>Вибір теми (поки не працює)</Text>
        </View>
    )
}

function LanguageScreen() {
    return (
        <View style={styles.container}>
            <Text>Вибір мови (укр/англ, поки не працює)</Text>
        </View>
    )
}

function ProfileScreen() {
    return (
        <View style={styles.container}>
            <Text>Це ви</Text>
        </View>
    )
}

function LogoutScreen({ navigation }) {
    useEffect(() => {
        Alert.alert('Ви вийшли')
        navigation.goBack()
    }, [])
    return (
        <View style={styles.container}>
            <Text>Ви вийшли</Text>
        </View>
    )
}

export default function App() {
    const { t } = useTranslation()

    useEffect(() => {
        loadLanguage()
    }, [])

    return (
        <NavigationContainer>
            <Drawer.Navigator initialRouteName="Home">
                <Drawer.Screen name="Home" component={Tabs} />
                <Drawer.Screen name="Theme" component={ThemeScreen} />
                <Drawer.Screen name="Language" component={LanguageScreen} />
                <Drawer.Screen name="Profile" component={ProfileScreen} />
                <Drawer.Screen name="Logout" component={LogoutScreen} />
            </Drawer.Navigator>
            <StatusBar style="auto" />
        </NavigationContainer>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'center',
    },
})
