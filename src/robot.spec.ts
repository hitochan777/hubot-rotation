// @format

describe("errorHandler", () => {
  it("", () => {})
})

describe("RequestHandler", () => {
  const response: hubot.Response = {
    match: ["rotation add hitochan", "hitochan"],
    reply: jest.fn(),
    send: jest.fn(),
    envelope: {
      room: "room1",
      user: {
        id: "1",
        name: "john",
        email_address: "john@hoge.com",
        room: "room1"
      }
    }
  }

  it("shifts pointer and send current status", () => {})
  it("adds an user and notifies the room", () => {})
  it("deletes an user and notifies the room", () => {})
  it("sends the current status to the room", () => {})
})
