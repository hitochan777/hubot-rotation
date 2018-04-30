// @format
/// <reference path="@types/hubot/index.d.ts" />

import * as hubot from "hubot"
import { Repository } from "./repository"
import { RequestHandler } from "./robot"
import { dateToString, TimezoneOffset } from "./date"

describe("RequestHandler", () => {
  let res: hubot.Response
  let repo: Repository
  let rh: RequestHandler
  beforeEach(() => {
    res = {
      match: ["rotation add hitochan", "hitochan"],
      reply: jest.fn(),
      send: jest.fn(),
      envelope: {
        room: "room1"
      }
    }

    repo = {
      shiftUser: jest.fn(),
      getCurrentUser: jest.fn(),
      addUser: jest.fn(),
      deleteUser: jest.fn(),
      getAllUsers: jest.fn(),
      toString: jest.fn((roomName: string) => `toString ${roomName}`),
      setTimezoneOffset: jest.fn(),
      getTimezoneOffset: jest.fn(
        (roomName: string) => new TimezoneOffset("+09:00")
      )
    }

    rh = new RequestHandler(repo)
  })

  it("shifts pointer and send current status", () => {
    rh.shiftUser(res)
    expect(repo.shiftUser).toHaveBeenCalledWith("room1")
    expect(res.send).toHaveBeenCalled()
  })

  it("adds an user and notifies the room", () => {
    rh.addUser(res)
    expect(repo.addUser).toHaveBeenCalledWith("room1", "hitochan")
    expect(res.send).toHaveBeenCalledWith("Added hitochan")
  })

  it("deletes an user and notifies the room", () => {
    rh.deleteUser(res)
    expect(repo.deleteUser).toHaveBeenCalledWith("room1", "hitochan")
    expect(res.send).toHaveBeenCalledWith("Deleted hitochan")
  })

  it("sends the current status to the room", () => {
    rh.showUsers(res)
    expect(repo.toString).toHaveBeenCalledWith("room1")
    expect(res.send).toHaveBeenCalled()
  })

  describe("configTimezone", () => {
    it("sets timezone offset if set and send the notification", () => {
      res.match = ["rotation config timezone +09:00", " +09:00", "+09:00"]
      rh.configTimezone(res)
      expect(repo.setTimezoneOffset).toHaveBeenCalled()
      expect(res.send).toHaveBeenCalledWith("Timezone offset set to +09:00")
    })

    it("does not try to set timezone offset when it is not specified", () => {
      res.match = ["rotation config timezone"]
      rh.configTimezone(res)
      expect(repo.setTimezoneOffset).not.toHaveBeenCalled()
      expect(res.send).toHaveBeenCalledWith("Timezone offset set to +09:00")
    })
  })
})
