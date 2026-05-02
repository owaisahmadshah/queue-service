import { createLogger, format, transports } from "winston"
const { combine, timestamp, json, colorize } = format

// Custom format for console logging with colors
const consoleLogFormat = format.combine(
  format.colorize(),
  format.printf(({ level, message, timestamp }) => {
    return `${level}: ${message}`
  })
)

// Create a Winston logger
const logger = createLogger({
  level: "info",
  format: combine(colorize(), timestamp(), json()),
  transports: [
    new transports.Console({
      format: consoleLogFormat,
    }),
    new transports.File({ filename: "app.log" }),
  ],
})

/*
-----------USAGE-------------
import logger from "./logger"

logger.info("This is an info message")
logger.error("This is an error message")
logger.warn("This is a warning message")
logger.debug("This is a debug message")
*/

export default logger
