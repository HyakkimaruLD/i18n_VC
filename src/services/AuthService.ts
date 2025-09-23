import { injectable } from 'inversify'
import { getDb } from '../db'

@injectable()
export class AuthService {
    async register(email: string, password: string) {
        const db = await getDb()
        try {
            await db.run('INSERT INTO users (email, password) VALUES (?, ?);', [email, password])
            return true
        } catch (e) {
            return false
        }
    }

    async login(email: string, password: string) {
        const db = await getDb()
        const user = await db.get('SELECT * FROM users WHERE email = ? AND password = ?;', [email, password])
        return user || null
    }

    async getAllUsers() {
        const db = await getDb()
        const users = await db.all(`SELECT id, email, password FROM users`)
        return users
    }
}
