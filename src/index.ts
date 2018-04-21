// @format
/// <reference path="@types/hubot/index.d.ts" />

import * as hubot from "hubot"
import { RedisRepository, Repository } from "./repository"
import createCommandBuilder from "./command_builder"

const buildCommand = createCommandBuilder("rotate")

export default (robot: hubot.Robot) => {
  const repo: Repository = new RedisRepository(robot)

  robot.hear(buildCommand("next"), (res: hubot.Response) => {
    try {
      const roomName = res.envelope.room
      repo.shiftUser(roomName)
      res.reply(`${repo.toString(roomName)}`)
    } catch (e) {
      res.reply(e.message)
    }
  })

  robot.hear(buildCommand("add (.+)"), (res: hubot.Response) => {
    const username = res.match[1]
    try {
      repo.addMember(res.envelope.room, username)
      res.reply(`added ${username}`)
    } catch (e) {
      res.reply(e.message)
    }
  })

  robot.hear(buildCommand("delete (.+)"), (res: hubot.Response) => {
    const username = res.match[1]
    try {
      repo.deleteMember(res.envelope.room, username)
      res.reply(`deleted ${username}`)
    } catch (e) {
      res.reply(e.message)
    }
  })

  robot.hear(buildCommand("show"), (res: hubot.Response) => {
    try {
      const roomName = res.envelope.room
      res.reply(`${repo.toString(roomName)}`)
    } catch (e) {
      res.reply(e.message)
    }
  })
}
