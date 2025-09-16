import { injectable } from 'inversify'
import { getDb } from '../db'
import { ViolationDTO } from '../models/ViolationDTO'

@injectable()
export class ViolationService {
    async create(v: ViolationDTO) {
        const db = await getDb()
        const res = await db.run(
            `INSERT INTO violations (photo_uri, latitude, longitude, description) VALUES (?, ?, ?, ?);`,
            [v.photo_uri || null, v.latitude || null, v.longitude || null, v.description || null]
        )
        const id = res.lastID
        return await this.getById(res.lastID!)
    }

    async list() {
        const db = await getDb()
        return await db.all('SELECT * FROM violations ORDER BY created_at DESC;')
    }

    async getById(id: number) {
        const db = await getDb()
        return await db.get('SELECT * FROM violations WHERE id = ?;', [id])
    }

    async listByDate(date: string) {
        // date format: 'YYYY-MM-DD'
        const db = await getDb()
        return await db.all(`SELECT * FROM violations WHERE date(created_at) = ? ORDER BY created_at;`, [date])
    }
}
