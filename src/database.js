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
