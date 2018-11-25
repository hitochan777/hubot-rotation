import createCommandBuilder from "./command_builder"

const buildCommand = createCommandBuilder("rotate")

export const ADD = buildCommand("add (.+)(\\s+(.+))")
export const NEXT = buildCommand("next")
export const DELETE = buildCommand("delete (.+)")
export const SHOW = buildCommand("show")
export const CONFIG_TIMEZONE = buildCommand("config timezone( (\\S+))?")
