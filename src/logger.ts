import { createLogger, format, transports } from "winston"

const { printf, combine, timestamp } = format
const customFormat = printf(info => {
  return `[hubot-rotation] ${info.timestamp} ${info.level}:\n ${info.message}`
})

export default createLogger({
  format: combine(timestamp(), customFormat),
  transports: [new transports.Console()]
})
