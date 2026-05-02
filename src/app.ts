import express, { type Application } from "express"
import morgan from "morgan"
import cors from "cors"
import logger from "./utils/logger.js"

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

import { health_router } from "./api/routes/health.route.js"

app.use("/health", health_router)

export { app }
