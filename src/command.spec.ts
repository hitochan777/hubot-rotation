// @format
/// <reference path="@types/hubot/index.d.ts" />

import * as hubot from "hubot"
import * as commandRegExp from "./command"

describe("ADD", () => {
  it("does not respond when there is not user specified", () => {
    const input = "rotate add"
    const matches = commandRegExp.ADD.exec(input)
    expect(matches).toBe(null)
  })

  it("captures users", () => {
    const input = "rotate add user1"
    const matches = commandRegExp.ADD.exec(input)
    expect(matches).not.toBe(null)
    expect(matches[0]).toBe(input)
    expect(matches[1]).toBe("user1")
  })

  it("captures multiple users", () => {
    const input = "rotate add user1 user2 user3"
    const matches = commandRegExp.ADD.exec(input)
    expect(matches[0]).toBe(input)
    expect(matches[1]).toBe("user1 user2 user3")
  })
})
