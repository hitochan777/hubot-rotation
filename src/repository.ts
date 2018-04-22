// @format
/// <reference path="@types/hubot/index.d.ts" />

import * as hubot from "hubot"
import "core-js"

export interface Repository {
  shiftUser: (roomName: string) => void
  getCurrentUser: (roomName: string) => string
  addUser: (roomName: string, username: string) => void
  deleteUser: (roomName: string, username: string) => void
  getAllUsers: (roomName: string) => string[]
  toString: (roomName: string) => string
}

const noUserError = new Error("There is no member yet")

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
    const currentUserIndex = this.getCurrentIndex(roomName)
    const members = this.getAllUsers(roomName)
    if (members.length === 0) {
      throw noUserError
    }
    const nextUserIndex = (currentUserIndex + 1) % members.length
    this.robot.brain.set(`rotate:${roomName}:index`, nextUserIndex)
  }

  getCurrentUser(roomName: string) {
    const currentUserIndex = this.getCurrentIndex(roomName)
    const members = this.getAllUsers(roomName)
    if (currentUserIndex < 0) {
      throw noUserError
    }

    return members[currentUserIndex]
  }

  addUser(roomName: string, username: string) {
    const members = this.getAllUsers(roomName)
    if (members.indexOf(username) >= 0) {
      throw new Error(`${username} already exists`)
    }
    members.push(username)
    this.robot.brain.set(`rotate:${roomName}:members`, members)
  }

  deleteUser(roomName: string, username: string) {
    const members = this.getAllUsers(roomName)
    const userIndex = members.indexOf(username)
    if (userIndex < 0) {
      throw new Error(`${username} does not exist`)
    }
    members.splice(userIndex, 1)
    this.robot.brain.set(`rotate:${roomName}:members`, members)
    const currentIndex = this.getCurrentIndex(roomName)
    if (userIndex === currentIndex) {
      this.robot.brain.set(
        `rotate:${roomName}:index`,
        currentIndex % members.length
      )
    } else {
      this.robot.brain.set(`rotate:${roomName}:index`, members)
      this.robot.brain.set(`rotate:${roomName}:index`, currentIndex - 1)
    }
  }

  private getCurrentIndex(roomName: string): number {
    const index = this.robot.brain.get(`rotate:${roomName}:index`)
    return index === undefined ? -1 : +index
  }

  getAllUsers(roomName: string) {
    return this.robot.brain.get(`rotate:${roomName}:members`) || []
  }

  toString(roomName: string) {
    const users = this.getAllUsers(roomName).slice()
    const index = this.getCurrentIndex(roomName)
    if (users.length === 0) {
      throw noUserError
    }
    users[index] += ":heavy_check_mark:"
    return users.join(":arrow_right:")
  }
}
