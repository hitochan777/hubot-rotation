// @format
/// <reference path="@types/hubot/index.d.ts" />

import * as hubot from "hubot"
import { RedisRepository, Repository } from "./repository"
import { TimezoneOffset } from "./date"
import createCommandBuilder from "./command_builder"
import { dateToString } from "./date"

const buildCommand = createCommandBuilder("rotate")

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
  constructor(private repo: Repository) {
    this.repo = repo
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
    res.send(this.getDateString(roomName) + "\n" + this.repo.toString(roomName))
  }

  @errorHandler
  addUser(res: hubot.Response) {
    const username = res.match[1]
    this.repo.addUser(res.envelope.room, username)
    res.send(`Added ${username}`)
  }

  @errorHandler
  deleteUser(res: hubot.Response) {
    const username = res.match[1]
    this.repo.deleteUser(res.envelope.room, username)
    res.send(`Deleted ${username}`)
  }

  @errorHandler
  showUsers(res: hubot.Response) {
    const roomName = res.envelope.room
    const list = this.repo.toString(roomName)
    res.send(this.getDateString(roomName) + "\n" + list)
  }

  @errorHandler
  configTimezone(res: hubot.Response) {
    const roomName = res.envelope.room
    if (res.match.length === 3 && res.match[2]) {
      const offset = res.match[2]
      this.repo.setTimezoneOffset(roomName, new TimezoneOffset(offset))
    }
    res.send("Timezone offset set to " + this.repo.getTimezoneOffset(roomName))
  }
}

export default (robot: hubot.Robot) => {
  const repo = new RedisRepository(robot)
  const handler = new RequestHandler(repo)

  robot.hear(buildCommand("next"), handler.shiftUser.bind(handler))
  robot.hear(buildCommand("add (.+)"), handler.addUser.bind(handler))
  robot.hear(buildCommand("delete (.+)"), handler.deleteUser.bind(handler))
  robot.hear(buildCommand("show"), handler.showUsers.bind(handler))
  robot.hear(
    buildCommand("config timezone( (.+))?"),
    handler.configTimezone.bind(handler)
  )
}
