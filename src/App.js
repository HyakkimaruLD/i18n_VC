import { StatusBar } from 'expo-status-bar'
import { StyleSheet, Text } from 'react-native'
import { NavigationContainer } from '@react-navigation/native'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import { useTranslation } from 'react-i18next'
import { useEffect } from 'react'
import { changeLanguage, loadLanguage } from './i18n'

import CalendarScreen from './Screens/CalendarScreen'
import MapScreen from './Screens/MapScreen'
import NewScreen from './Screens/NewScreen'

const Tab = createBottomTabNavigator()

export default function App() {
    const { t } = useTranslation()

    useEffect(() => {
        loadLanguage()
    }, [])

    return (
        <NavigationContainer>
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
