import Router from 'koa-router'
import { ViolationService } from '../services/ViolationService'
import { AuthService } from '../services/AuthService'
import { createViolationsRouter } from './violations'
import { createAuthRouter } from './auth'

export function createRoutes() {
    const violationService = new ViolationService()
    const authService = new AuthService()

    const root = new Router()
    root.use(createViolationsRouter(violationService).routes())
    root.use(createViolationsRouter(violationService).allowedMethods())
    root.use(createAuthRouter(authService).routes())
    root.use(createAuthRouter(authService).allowedMethods())

    root.get('/health', async (ctx) => {
        ctx.body = { status: 'ok' }
    })

    return root
}
