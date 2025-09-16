import Router from 'koa-router'
import { ViolationController } from '../controllers/ViolationController'
import { ViolationService } from '../services/ViolationService'

export function createViolationsRouter(service: ViolationService) {
    const ctrl = new ViolationController(service)
    const router = new Router({ prefix: '/violations' })

    router.get('/', ctrl.list)
    router.post('/', ctrl.create)
    router.get('/date/:date', ctrl.getByDate)
    router.get('/:id', ctrl.getById)

    return router
}
