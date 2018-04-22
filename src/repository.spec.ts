// @format

/// <reference path="@types/hubot/index.d.ts" />

import * as hubot from "hubot"

import { RedisRepository } from "./repository"

describe("redis repository", () => {
  let robot: hubot.Robot
  beforeEach(() => {
    const data: { [key: string]: any } = {}
    robot = {
      hear() {
        throw new Error("not implemented")
      },
      brain: {
        get(key: string) {
          return data[key]
        },
        set(key: string, value: any) {
          data[key] = value
        }
      }
    }
  })

  describe("shiftUser", () => {
    it("moves the pointer to next user", () => {
      const roomName = "test room"
      const initialUsers = ["user1", "user2", "user3"]
      const rr = new RedisRepository(robot, {
        [roomName]: { members: initialUsers, index: 0 }
      })

      rr.shiftUser(roomName)
      expect(rr.getCurrentUser(roomName)).toBe("user2")
    })

    it("moves the pointer to the first user if the pointer is at the last of the list", () => {
      const roomName = "test room"
      const initialUsers = ["user1", "user2", "user3"]
      const rr = new RedisRepository(robot, {
        [roomName]: { members: initialUsers, index: 2 }
      })
      rr.shiftUser(roomName)
      expect(rr.getCurrentUser(roomName)).toBe("user1")
    })

    it("throws an error if there is no user", () => {
      const roomName = "test room"
      const rr = new RedisRepository(robot, {})

      expect(() => {
        rr.shiftUser(roomName)
      }).toThrowError("There is no member yet")
    })
  })

  describe("addUser", () => {
    it("adds new user at the end of list", () => {
      const roomName = "test room"
      const initialUsers = ["user1", "user2", "user3"]
      const rr = new RedisRepository(robot, {
        [roomName]: { members: initialUsers, index: 0 }
      })
      const newUser = "user4"
      rr.addUser(roomName, newUser)
      expect(rr.getAllUsers(roomName)).toEqual([
        "user1",
        "user2",
        "user3",
        "user4"
      ])
    })

    it("throws an error if a user with the same name already exists on creating a new user", () => {
      const roomName = "test room"
      const initialUsers = ["user1", "user2", "user3"]
      const rr = new RedisRepository(robot, {
        [roomName]: { members: initialUsers, index: 0 }
      })
      const newUser = "user2"
      expect(() => {
        rr.addUser(roomName, newUser)
      }).toThrowError()
    })
  })

  describe("deleteUser", () => {
    it("sets the current user to the first user in the list if the deleted user is at the last", () => {
      const roomName = "test room"
      const initialUsers = ["user1", "user2", "user3"]
      const rr = new RedisRepository(robot, {
        [roomName]: { members: initialUsers, index: 2 }
      })
      const userToBeDeleted = "user3"
      rr.deleteUser(roomName, userToBeDeleted)
      expect(rr.getAllUsers(roomName)).toEqual(["user1", "user2"])
      expect(rr.getCurrentUser(roomName)).toBe("user1")
    })

    it("sets the current user to the next user if the deleted user is the current user and is not the last", () => {
      const roomName = "test room"
      const initialUsers = ["user1", "user2", "user3"]
      const rr = new RedisRepository(robot, {
        [roomName]: { members: initialUsers, index: 1 }
      })
      const userToBeDeleted = "user2"
      rr.deleteUser(roomName, userToBeDeleted)
      expect(rr.getAllUsers(roomName)).toEqual(["user1", "user3"])
      expect(rr.getCurrentUser(roomName)).toBe("user3")
    })

    it("does not change the current user if the deleted user is not the current user", () => {
      const roomName = "test room"
      const initialUsers = ["user1", "user2", "user3"]
      const rr = new RedisRepository(robot, {
        [roomName]: { members: initialUsers, index: 1 }
      })
      const userToBeDeleted = "user1"
      rr.deleteUser(roomName, userToBeDeleted)
      expect(rr.getAllUsers(roomName)).toEqual(["user2", "user3"])
      expect(rr.getCurrentUser(roomName)).toBe("user2")
    })

    it("throws an error if the specified user does not exist", () => {
      const roomName = "test room"
      const rr = new RedisRepository(robot, {})
      const userToBeDeleted = "user1"
      expect(() => {
        rr.deleteUser(roomName, userToBeDeleted)
      }).toThrowError("user1 does not exist")
    })
  })

  describe("getCurrentIndex", () => {
    it("returns -1 if there is no user", () => {
      const roomName = "test room"
      const rr = new RedisRepository(robot, {})
      expect(rr["getCurrentIndex"](roomName)).toEqual(-1)
    })

    it("returns correct index if it is set", () => {
      const roomName = "test room"
      const initialUsers = ["user1", "user2"]
      const rr = new RedisRepository(robot, {
        [roomName]: { members: initialUsers, index: 1 }
      })
      expect(rr["getCurrentIndex"](roomName)).toEqual(1)
    })
  })

  describe("toString", () => {
    it("returns a string showing check mark to the current user", () => {
      const roomName = "test room"
      const initialUsers = ["user1", "user2", "user3"]
      const rr = new RedisRepository(robot, {
        [roomName]: { members: initialUsers, index: 1 }
      })
      expect(rr.toString(roomName)).toEqual(
        "user1:arrow_right:user2:heavy_check_mark::arrow_right:user3"
      )
    })

    it("throws an error if thre is not user yet", () => {
      const roomName = "test room"
      const rr = new RedisRepository(robot, {})
      expect(() => {
        rr.toString(roomName)
      }).toThrowError(/^There is no member yet$/)
    })
  })
})
