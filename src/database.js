import * as SQLite from 'expo-sqlite'

let dbPromise = null

async function getDb() {
    if (!dbPromise) {
        dbPromise = SQLite.openDatabaseAsync('violations.db')
    }
    return dbPromise
}


export async function initDatabase() {

    const db = await getDb()
    await db.execAsync(`
        CREATE TABLE IF NOT EXISTS violations (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            photo_uri TEXT,
            latitude REAL,
            longitude REAL,
            description TEXT,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP
        );
    `)

    await db.execAsync(`
        CREATE TABLE IF NOT EXISTS users (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            email TEXT UNIQUE,
            password TEXT
        );
    `)
}


export async function insertViolation(photoUri, latitude, longitude, description) {
    const db = await getDb()
    await db.runAsync(
        'INSERT INTO violations (photo_uri, latitude, longitude, description) VALUES (?, ?, ?, ?);',
        [photoUri, latitude, longitude, description]
    )
}

export async function loadViolations() {
    const db = await getDb()
    return await db.getAllAsync('SELECT * FROM violations;')
}

export async function registerUser(email, password) {
    const db = await getDb()
    try {
        await db.runAsync(
            'INSERT INTO users (email, password) VALUES (?, ?);',
            [email, password]
        )
        console.log('User registered:', email, password)
        return true
    } catch (e) {
        console.error('Registration error:', e)
        return false
    }
}

export async function loginUser(email, password) {
    const db = await getDb()
    const user = await db.getFirstAsync(
        'SELECT * FROM users WHERE email = ? AND password = ?;',
        [email, password]
    )
    console.log('Login attempt:', email, password, 'Result:', user)
    return user
}