import { Context } from 'koa'
import { AuthService } from '../services/AuthService'
import { plainToInstance } from 'class-transformer'
import { validateOrReject } from 'class-validator'
import { UserDTO } from '../models/UserDTO'

export class AuthController {
    constructor(private service: AuthService) {}

    register = async (ctx: Context) => {
        const dto = plainToInstance(UserDTO, ctx.request.body)
        try {
            await validateOrReject(dto as any)
        } catch (errors) {
            ctx.status = 400
            ctx.body = { error: 'Validation failed', details: errors }
            return
        }
        const ok = await this.service.register(dto.email, dto.password)
        if (!ok) {
            ctx.status = 409
            ctx.body = { error: 'Email already exists' }
            return
        }
        ctx.status = 201
        ctx.body = { ok: true }
    }

    login = async (ctx: Context) => {
        const dto = plainToInstance(UserDTO, ctx.request.body)
        try {
            await validateOrReject(dto as any)
        } catch (errors) {
            ctx.status = 400
            ctx.body = { error: 'Validation failed', details: errors }
            return
        }
        const user = await this.service.login(dto.email, dto.password)
        if (!user) {
            ctx.status = 401
            ctx.body = { error: 'Invalid credentials' }
            return
        }
        ctx.body = { ok: true, user: { id: user.id, email: user.email } }
    }
}
