// @format
/// <reference path="@types/hubot/index.d.ts" />

import * as hubot from "hubot"
import { RedisRepository, Repository } from "./repository"

export default (robot: hubot.Robot) => {
  const repo: Repository = new RedisRepository(robot)

  robot.hear(/morning next/, (res: hubot.Response) => {
    try {
      repo.shiftUser(res.envelope.room)
      const nextUser = repo.getCurrentUser(res.envelope.room)
      res.reply(`Next facilitator is ${nextUser}`)
    } catch (e) {
      res.reply(e.message)
    }
  })

  robot.hear(/morning add (.+)/, (res: hubot.Response) => {
    const username = res.match[1]
    try {
      repo.addMember(res.envelope.room, username)
      res.reply(`added ${username}`)
    } catch (e) {
      res.reply(e.message)
    }
  })

  robot.hear(/morning delete (.+)/, (res: hubot.Response) => {
    const username = res.match[1]
    try {
      repo.deleteMember(res.envelope.room, username)
      res.reply(`deleted ${username}`)
    } catch (e) {
      res.reply(e.message)
    }
  })
}
