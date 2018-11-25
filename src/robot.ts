// @format
/// <reference path="@types/hubot/index.d.ts" />

import * as hubot from "hubot"
import { RedisRepository, Repository } from "./repository"
import { TimezoneOffset } from "./date"
import { dateToString } from "./date"
import logger from "./logger"
import * as commandRegExp from "./command"

export function errorHandler(
  target: any,
  propertyKey: string,
  descriptor: PropertyDescriptor
): any {
  let method: (res: hubot.Response) => void = descriptor.value
  descriptor.value = function(res: hubot.Response) {
    try {
      method.apply(this, [res])
    } catch (e) {
      res.reply(e.message)
    }
  }
}

export class RequestHandler {
  constructor(private repo: Repository, private mention: string = "@here") {
    this.repo = repo
    this.mention = mention
  }

  send(res: hubot.Response, message: string) {
    logger.info(message)
    res.send(message)
  }

  getDateString(roomName: string): string {
    const currentDate = new Date()
    const offset = this.repo.getTimezoneOffset(roomName).offsetMilliseconds
    return dateToString(new Date(currentDate.getTime() + offset))
  }

  @errorHandler
  shiftUser(res: hubot.Response) {
    const roomName = res.envelope.room
    this.repo.shiftUser(roomName)
    this.send(
      res,
      [
        this.mention,
        this.getDateString(roomName),
        this.repo.toString(roomName)
      ].join("\n")
    )
  }

  @errorHandler
  addUsers(res: hubot.Response) {
    const usernames = res.match.slice(1)
    for (let username of usernames) {
      this.repo.addUser(res.envelope.room, username)
    }
    this.send(res, `Added ${usernames.join(" ")}`)
  }

  @errorHandler
  deleteUser(res: hubot.Response) {
    const username = res.match[1]
    this.repo.deleteUser(res.envelope.room, username)
    this.send(res, `Deleted ${username}`)
  }

  @errorHandler
  showUsers(res: hubot.Response) {
    const roomName = res.envelope.room
    const list = this.repo.toString(roomName)
    this.send(
      res,
      [this.mention, this.getDateString(roomName), list].join("\n")
    )
  }

  @errorHandler
  configTimezone(res: hubot.Response) {
    const roomName = res.envelope.room
    if (res.match.length === 3 && res.match[2]) {
      const offset = res.match[2]
      this.repo.setTimezoneOffset(roomName, new TimezoneOffset(offset))
    }
    this.send(
      res,
      "Timezone offset set to " + this.repo.getTimezoneOffset(roomName)
    )
  }
}

export default (robot: hubot.Robot) => {
  const repo = new RedisRepository(robot)
  const handler = new RequestHandler(repo)

  robot.hear(commandRegExp.NEXT, handler.shiftUser.bind(handler))
  robot.hear(commandRegExp.ADD, handler.addUsers.bind(handler))
  robot.hear(commandRegExp.DELETE, handler.deleteUser.bind(handler))
  robot.hear(commandRegExp.SHOW, handler.showUsers.bind(handler))
  robot.hear(
    commandRegExp.CONFIG_TIMEZONE,
    handler.configTimezone.bind(handler)
  )
}
