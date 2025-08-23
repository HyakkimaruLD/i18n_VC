import { createContext, useContext } from 'react'

const ThemeContext = createContext()

function useThemeContext() {
    const context = useContext(ThemeContext)
    if (!context) {
        throw new Error('Err')
    }
    return context
}

export { ThemeContext, useThemeContext }