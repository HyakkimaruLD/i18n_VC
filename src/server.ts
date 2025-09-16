import 'reflect-metadata'
import Koa from 'koa'
import bodyParser from 'koa-bodyparser'
import { createRoutes } from './routes'
import { getDb } from './db'

const app = new Koa()
app.use(bodyParser())

app.use(async (ctx, next) => {
    const start = Date.now()
    await next()
    const ms = Date.now() - start
    console.log(`${ctx.method} ${ctx.url} - ${ctx.status} - ${ms}ms`)
})

app.use(createRoutes().routes())
app.use(createRoutes().allowedMethods())

const PORT = process.env.PORT ? Number(process.env.PORT) : 3000

;(async () => {
    await getDb()
    app.listen(PORT, () => {
        console.log(`Server started on http://localhost:${PORT}`)
    })
})()
