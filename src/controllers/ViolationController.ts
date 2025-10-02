import { Context } from 'koa'
import { ViolationService } from '../services/ViolationService'
import { validateOrReject } from 'class-validator'
import { plainToInstance } from 'class-transformer'
import { ViolationDTO } from '../models/ViolationDTO'

export class ViolationController {
    constructor(private service: ViolationService) {}

    create = async (ctx: Context) => {
        const dto = plainToInstance(ViolationDTO, ctx.request.body)
        try {
            await validateOrReject(dto as any)
        } catch (errors) {
            ctx.status = 400
            ctx.body = { error: 'Validation failed', details: errors }
            return
        }

        const created = await this.service.create(dto)
        ctx.status = 201
        ctx.body = created
    }

    list = async (ctx: Context) => {
        ctx.body = await this.service.list()
    }

    getByDate = async (ctx: Context) => {
        const date = ctx.params.date
        ctx.body = await this.service.listByDate(date)
    }

    getById = async (ctx: Context) => {
        const id = Number(ctx.params.id)
        const item = await this.service.getById(id)
        if (!item) {
            ctx.status = 404
            ctx.body = { error: 'Not found' }
            return
        }
        ctx.body = item
    }
}
