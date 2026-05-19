import express, { type Application } from "express"
import morgan from "morgan"
import cors from "cors"
import "reflect-metadata"
import cookie_parser from "cookie-parser"

import logger from "./utils/logger.js"

import "./containers/index.js"

const app: Application = express()

const morganFormat = ":method :url :status :response-time ms"

app.use(
  cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true,
    optionsSuccessStatus: 200,
  })
)

app.use(express.json({ limit: "16kb" }))
app.use(express.urlencoded({ extended: true, limit: "16kb" }))
app.use(express.static("public"))
app.use(cookie_parser())

app.use(
  morgan(morganFormat, {
    stream: {
      write: (message: string) => {
        const logObject = {
          method: message.split(" ")[0],
          url: message.split(" ")[1],
          status: message.split(" ")[2],
          responseTime: message.split(" ")[3],
        }
        logger.info(JSON.stringify(logObject))
      },
    },
  })
)

import { container } from "tsyringe"

import { health_router } from "./routes/health-route.js"
import { UserRouter } from "./routes/user-route.js"
import { ApiKeyRouter } from "./routes/api_key-route.js"
import { NotificationJobRouter } from "./routes/notification_job-route.js"
import { EmailWorker } from "./workers/email-worker.js"
import { QueueEvents } from "./queues/events.js"
import { NotificationQueue } from "./queues/notification-queue.js"

const user_router = container.resolve(UserRouter)
const api_key_router = container.resolve(ApiKeyRouter)
const notification_job_router = container.resolve(NotificationJobRouter)

container.resolve(NotificationQueue)
container.resolve(EmailWorker)
container.resolve(QueueEvents)

app.use("/api/v1/health", health_router)
app.use("/api/v1/user", user_router.router)
app.use("/api/v1/api-key", api_key_router.router)
app.use("/api/v1/notification-jobs", notification_job_router.router)

import { error_handler } from "./middlewares/error_handler-middleware.js"

app.use(error_handler)

export { app }
