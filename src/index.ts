// @format
/// <reference path="@types/hubot/index.d.ts" />

import * as hubot from "hubot"

interface Repository {
  shiftUser: (roomName: string) => void
  getCurrentUser: (roomName: string) => string
  addMember: (roomName: string, username: string) => void
  deleteMember: (roomName: string, username: string) => void
  getAllUsers: (roomName: string) => string[]
}

export class RedisRepository implements Repository {
  private robot: hubot.Robot

  constructor(
    robot: hubot.Robot,
    rooms: { [key: string]: { members: string[]; index: number } } = {}
  ) {
    this.robot = robot
    for (let [roomName, room] of Object.entries(rooms)) {
      this.robot.brain.set(`rotate:${roomName}:members`, room.members)
      this.robot.brain.set(`rotate:${roomName}:index`, room.index)
    }
  }

  shiftUser(roomName: string) {
    const currentMemberIndex = this.getCurrentIndex(roomName)
    const members = this.getAllUsers(roomName)
    if (members.length === 0) {
      throw new Error("There is no member yet")
    }
    const nextMemberIndex = (currentMemberIndex + 1) % members.length
    this.robot.brain.set(`rotate:${roomName}:index`, nextMemberIndex)
  }

  getCurrentUser(roomName: string) {
    const currentMemberIndex = this.getCurrentIndex(roomName)
    const members = this.getAllUsers(roomName)
    this.robot.brain.get(`rotate:${roomName}:members`) || []
    if (currentMemberIndex < 0) {
      throw new Error("There is no member yet")
    }

    return members[currentMemberIndex]
  }

  addMember(roomName: string, username: string) {
    const members = this.getAllUsers(roomName)
    if (members.indexOf(username) >= 0) {
      throw new Error(`${username} already exists`)
    }
    members.push(username)
    this.robot.brain.set(`rotate:${roomName}:members`, members)
  }

  deleteMember(roomName: string, username: string) {
    const members = this.getAllUsers(roomName)
    const userIndex = members.indexOf(username)
    if (userIndex < 0) {
      throw new Error(`${username} does not exist`)
    }
    members.splice(userIndex, 1)
    this.robot.brain.set(`rotate:${roomName}:members`, members)
  }

  private getCurrentIndex(roomName: string) {
    return +this.robot.brain.get(`rotate:${roomName}:index`) || -1
  }

  getAllUsers(roomName: string) {
    return this.robot.brain.get(`rotate:${roomName}:members`) || []
  }
}

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
