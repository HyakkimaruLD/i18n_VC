import sqlite3 from 'sqlite3'
import { open, Database } from 'sqlite'
import path from 'path'

let db: Database | null = null

export async function getDb() {
    if (db) return db
    const dbPath = path.resolve(__dirname, '..', 'violations.db')
    db = await open({
        filename: dbPath,
        driver: sqlite3.Database
    })
    await db.exec(`
        CREATE TABLE IF NOT EXISTS violations (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            photo_uri TEXT,
            latitude REAL,
            longitude REAL,
            description TEXT,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP
        );
    `)
    await db.exec(`
        CREATE TABLE IF NOT EXISTS users (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            email TEXT UNIQUE,
            password TEXT
        );
    `)
    return db
}
