import Router from 'koa-router'
import { AuthController } from '../controllers/AuthController'
import { AuthService } from '../services/AuthService'

export function createAuthRouter(service: AuthService) {
    const ctrl = new AuthController(service)
    const router = new Router({ prefix: '/auth' })

    router.post('/register', ctrl.register)
    router.post('/login', ctrl.login)

    return router
}
