// @format
/// <reference path="@types/hubot/index.d.ts" />

import * as hubot from "hubot"
import { RedisRepository, Repository } from "./repository"
import createCommandBuilder from "./command_builder"

const buildCommand = createCommandBuilder("rotate")

export const errorHandler = (
  target: any,
  propertyKey: string,
  descriptor: PropertyDescriptor
): any => {
  let handler: (res: hubot.Response) => void = descriptor.value
  descriptor.value = (res: hubot.Response) => {
    try {
      handler(res)
    } catch (e) {
      res.reply(e.message)
    }
  }
  return descriptor
}

export class RequestHandler {
  constructor(private repo: Repository) {
    this.repo = repo
  }

  @errorHandler
  shiftUser(res: hubot.Response) {
    const roomName = res.envelope.room
    this.repo.shiftUser(roomName)
    res.send(`${this.repo.toString(roomName)}`)
  }

  @errorHandler
  addMember(res: hubot.Response) {
    const username = res.match[1]
    this.repo.addMember(res.envelope.room, username)
    res.send(`Added ${username}`)
  }

  @errorHandler
  deleteMember(res: hubot.Response) {
    const username = res.match[1]
    this.repo.deleteMember(res.envelope.room, username)
    res.send(`Deleted ${username}`)
  }

  @errorHandler
  showMembers(res: hubot.Response) {
    const roomName = res.envelope.room
    const list = this.repo.toString(roomName)
    res.send(`${list}`)
  }
}

export default (robot: hubot.Robot) => {
  const repo = new RedisRepository(robot)
  const handler = new RequestHandler(repo)

  robot.hear(buildCommand("next"), handler.shiftUser)
  robot.hear(buildCommand("add (.+)"), handler.addMember)
  robot.hear(buildCommand("delete (.+)"), handler.deleteMember)
  robot.hear(buildCommand("show"), handler.showMembers)
}
