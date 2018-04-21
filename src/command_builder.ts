// @format

const createCommandBuilder = (commandName: string) => (subcommand: string) => {
  return new RegExp(`${commandName} ${subcommand}`)
}

export default createCommandBuilder
