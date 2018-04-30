// @format

import { dateToString, getMillisecondsOffset } from "./date"

describe("dateToString", () => {
  it("returns 2018/4/25 from the corresponding Date object", () => {
    const date = new Date("2018-04-25")
    expect(dateToString(date)).toEqual("2018/4/25")
  })
})

describe("getMillisecondsOffset", () => {
  it("returns milliseconds offset from +09:00", () => {
    expect(getMillisecondsOffset("+09:00")).toEqual(9 * 60 * 60 * 1000)
  })

  it("returns milliseconds offset from -02:30", () => {
    expect(getMillisecondsOffset("-02:30")).toEqual(-(2 * 60 + 30) * 60 * 1000)
  })

  it("throws an error when an input is less than -12:00", () => {
    expect(() => {
      getMillisecondsOffset("-12:01")
    }).toThrowError()
  })

  it("throws an error when an input is less than +14:01", () => {
    expect(() => {
      getMillisecondsOffset("+14:01")
    }).toThrowError()
  })
})
