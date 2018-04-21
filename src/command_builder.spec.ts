// @format

import createCommandBuilder from "./command_builder"

it("returns a function that returns a regexp object", () => {
  const regexp: RegExp = createCommandBuilder("rotate")("add (.+)")
  const testString: string = "rotate add hitochan"
  const matches: string[] = testString.match(regexp)

  expect(matches.length).toBe(2)
  expect(matches[0]).toEqual("rotate add hitochan")
  expect(matches[1]).toEqual("hitochan")
})
