import React, { useState, useEffect, useCallback } from 'react'
import { View, StyleSheet, Text, Dimensions } from 'react-native'
import Header from './Header'
import Day from './Day'
import { useThemeContext } from '../ThemeContext'
import { loadViolations } from '../database'

const Calendar = ({ refreshKey }) => {
    const { theme } = useThemeContext()
    const [currentDate, setCurrentDate] = useState(new Date())
    const [selectedDate, setSelectedDate] = useState(null)
    const [isLandscape, setIsLandscape] = useState(
        Dimensions.get('window').width > Dimensions.get('window').height
    )
    const [violationDates, setViolationDates] = useState([])

    const fetchViolationDates = useCallback(async () => {
        try {
            const violations = await loadViolations()
            const dates = violations.map(v => {
                const date = new Date(v.created_at)
                return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`
            })
            setViolationDates([...new Set(dates)])
        } catch (error) {
            console.error('Error loading violation dates:', error)
            setViolationDates([])
        }
    }, [])

    useEffect(() => {
        fetchViolationDates()
    }, [fetchViolationDates, refreshKey])

    useEffect(() => {
        const subscription = Dimensions.addEventListener('change', ({ window }) => {
            setIsLandscape(window.width > window.height)
        })

        return () => subscription?.remove()
    }, [])

    const getDaysInMonth = (month, year) => new Date(year, month + 1, 0).getDate()
    const getFirstDayOfMonth = (month, year) => new Date(year, month, 1).getDay()
    const getMonthName = (month) => ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'][month]

    const generateCalendarDays = () => {
        const year = currentDate.getFullYear()
        const month = currentDate.getMonth()
        const daysInMonth = getDaysInMonth(month, year)
        const firstDay = getFirstDayOfMonth(month, year)
        const prevMonthDays = new Date(year, month, 0).getDate()
        const prevMonth = month === 0 ? 11 : month - 1
        const prevYear = month === 0 ? year - 1 : year
        const nextMonth = month === 11 ? 0 : month + 1
        const nextYear = month === 11 ? year + 1 : year
        const days = []

        for (let i = firstDay - 1; i >= 0; i--) {
            days.push({
                day: prevMonthDays - i,
                isCurrentMonth: false,
                date: `${prevYear}-${String(prevMonth + 1).padStart(2, '0')}-${String(prevMonthDays - i).padStart(2, '0')}`,
            })
        }

        for (let i = 1; i <= daysInMonth; i++) {
            days.push({
                day: i,
                isCurrentMonth: true,
                date: `${year}-${String(month + 1).padStart(2, '0')}-${String(i).padStart(2, '0')}`,
            })
        }

        const totalDays = days.length
        for (let i = 1; i <= 42 - totalDays; i++) {
            days.push({
                day: i,
                isCurrentMonth: false,
                date: `${nextYear}-${String(nextMonth + 1).padStart(2, '0')}-${String(i).padStart(2, '0')}`,
            })
        }

        return days
    }

    const handlePrevMonth = () => {
        setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1))
        setSelectedDate(null)
    }

    const handleNextMonth = () => {
        setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1))
        setSelectedDate(null)
    }

    const handleToday = () => {
        setCurrentDate(new Date())
        setSelectedDate(null)
    }

    const handleDayPress = (date) => {
        setSelectedDate(date)
    }

    const days = generateCalendarDays()
    const monthName = getMonthName(currentDate.getMonth())
    const year = currentDate.getFullYear()

    return (
        <View>
            <View style={[styles.calendarContainer, theme === 'dark' ? styles.darkCalendar : styles.lightCalendar]}>
                <Header
                    month={monthName}
                    year={year}
                    onPrev={handlePrevMonth}
                    onNext={handleNextMonth}
                    onToday={handleToday}
                />
                <View style={styles.grid}>
                    {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((day) => (
                        <View style={styles.dayHeader} key={day}>
                            <Text style={[styles.dayText, theme === 'dark' ? styles.darkDayText : styles.lightDayText]}>{day}</Text>
                        </View>
                    ))}
                    <View style={styles.daysContainer}>
                        {days.map((item, index) => (
                            <Day
                                key={index}
                                day={item.day}
                                isCurrentMonth={item.isCurrentMonth}
                                hasViolations={violationDates.includes(item.date)}
                                onPress={() => item.isCurrentMonth && handleDayPress(item.date)}
                            />
                        ))}
                    </View>
                </View>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    darkContainer: {
        backgroundColor: '#222',
    },
    lightContainer: {
        backgroundColor: '#f5f5f5',
    },
    calendarContainer: {
        width: 350,
        height: 350,
        borderRadius: 10,
        padding: 10,
        shadowColor: '#000',
        shadowOpacity: 0.3,
        elevation: 5,
    },
    darkCalendar: {
        backgroundColor: '#333',
    },
    lightCalendar: {
        backgroundColor: '#fff',
    },
    grid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
    },
    dayHeader: {
        width: '14%',
        textAlign: 'center',
        padding: 5,
    },
    dayText: {
        fontSize: 14,
    },
    darkDayText: {
        color: '#888',
    },
    lightDayText: {
        color: '#555',
    },
    daysContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        width: '100%',
    },
})

export default Calendar