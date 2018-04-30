// @format

import { dateToString, TimezoneOffset } from "./date"

describe("dateToString", () => {
  it("returns 2018/4/25 from the corresponding Date object", () => {
    const date = new Date("2018-04-25")
    expect(dateToString(date)).toEqual("2018/4/25")
  })
})

describe("TimezoneOffset", () => {
  it("returns milliseconds offset from +09:00", () => {
    const to = new TimezoneOffset("+09:00")
    expect(to.offsetMilliseconds).toEqual(9 * 60 * 60 * 1000)
  })

  it("returns milliseconds offset from -02:30", () => {
    const to = new TimezoneOffset("-02:30")
    expect(to.offsetMilliseconds).toEqual(-(2 * 60 + 30) * 60 * 1000)
  })

  it("throws an error when an input is less than -12:00", () => {
    expect(() => {
      new TimezoneOffset("-12:01")
    }).toThrowError()
  })

  it("throws an error when an input is less than +14:01", () => {
    expect(() => {
      new TimezoneOffset("+14:01")
    }).toThrowError()
  })
})
