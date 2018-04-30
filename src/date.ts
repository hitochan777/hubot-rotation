// @format

export const dateToString = (d: Date) => {
  const date = d.getDate()
  const month = d.getMonth() + 1
  const year = d.getFullYear()
  return `${year}/${month}/${date}`
}

export const getMillisecondsOffset = (offset: string): number => {
  const found = offset.match(/^([\+-]?)(\d{1,2}):(\d{1,2})$/)
  if (!found) {
    throw new Error(`Given string ${offset} is not a proper UTC offset string`)
  }
  const sign = found[1]
  const hour = +found[2]
  const minute = +found[3]
  const minutes = (sign === "-" ? -1 : 1) * (hour * 60 + minute)
  if (minutes > 14 * 60 || minutes < -12 * 60) {
    throw new Error("UTC offset should be between -12:00 and +14:00")
  }
  return minutes * 60 * 1000
}
