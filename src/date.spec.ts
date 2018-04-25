// @format

import { dateToString } from "./date"

describe("dateToString", () => {
  it("returns 2018/4/25 from the corresponding Date object", () => {
    const date = new Date("2018-04-25")
    expect(dateToString(date)).toEqual("2018/4/25")
  })
})
