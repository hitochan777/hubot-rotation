// @format

/// <reference path="@types/hubot/index.d.ts" />

import * as hubot from "hubot"

import { RedisRepository } from "./index"

describe("redis repository", () => {
  let robot: hubot.Robot
  beforeEach(() => {
    const members = []
    const index = -1
    robot = { hear() {}, brain: { get() {}, set() {} } }
  })
  it("moves the pointer to next user", () => {
    const roomName = "test room"
    const initialMembers = ["user1", "user2", "user3"]
    const rr = new RedisRepository(robot, {
      [roomName]: { members: initialMembers, index: 0 }
    })
    rr.shiftUser(roomName)
    expect(rr.getCurrentUser(roomName)).toBe("user2")
  })

  it("moves the pointer to the first user if the pointer is at the last of the list", () => {
    const roomName = "test room"
    const initialMembers = ["user1", "user2", "user3"]
    const rr = new RedisRepository(robot, {
      [roomName]: { members: initialMembers, index: 2 }
    })
    rr.shiftUser(roomName)
    expect(rr.getCurrentUser(roomName)).toBe("user1")
  })

  it("adds new user at the end of list", () => {
    const roomName = "test room"
    const initialMembers = ["user1", "user2", "user3"]
    const rr = new RedisRepository(robot, {
      [roomName]: { members: initialMembers, index: 0 }
    })
    const newUser = "user4"
    rr.addMember(roomName, newUser)
    expect(rr.getAllUsers(roomName)).toBe(["user1", "user2", "user3", "user4"])
  })

  it("throws an error if a user with the same name already exists on creating a new user", () => {
    const roomName = "test room"
    const initialMembers = ["user1", "user2", "user3"]
    const rr = new RedisRepository(robot, {
      [roomName]: { members: initialMembers, index: 0 }
    })
    const newUser = "user2"
    expect(() => {
      rr.addMember(roomName, newUser)
    }).toThrowError()
  })

  it("sets the current user to the first user in the list if the deleted user is at the last", () => {
    const roomName = "test room"
    const initialMembers = ["user1", "user2", "user3"]
    const rr = new RedisRepository(robot, {
      [roomName]: { members: initialMembers, index: 2 }
    })
    const userToBeDeleted = "user3"
    rr.deleteMember(roomName, userToBeDeleted)
    expect(rr.getAllUsers(roomName)).toBe(["user1", "user2"])
    expect(rr.getCurrentUser(roomName)).toBe("user1")
  })

  it("sets the current user to the next user if the deleted user is the current user and is not the last", () => {
    const roomName = "test room"
    const initialMembers = ["user1", "user2", "user3"]
    const rr = new RedisRepository(robot, {
      [roomName]: { members: initialMembers, index: 1 }
    })
    const userToBeDeleted = "user2"
    rr.deleteMember(roomName, userToBeDeleted)
    expect(rr.getAllUsers(roomName)).toBe(["user1", "user3"])
    expect(rr.getCurrentUser(roomName)).toBe("user3")
  })

  it("does not change the current user if the deleted user is not the current user", () => {
    const roomName = "test room"
    const initialMembers = ["user1", "user2", "user3"]
    const rr = new RedisRepository(robot, {
      [roomName]: { members: initialMembers, index: 1 }
    })
    const userToBeDeleted = "user1"
    rr.deleteMember(roomName, userToBeDeleted)
    expect(rr.getAllUsers(roomName)).toBe(["user2", "user3"])
    expect(rr.getCurrentUser(roomName)).toBe("user2")
  })
})
