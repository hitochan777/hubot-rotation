// @format

export const dateToString = (d: Date) => {
  const date = d.getDate()
  const month = d.getMonth() + 1
  const year = d.getFullYear()
  return `${year}/${month}/${date}`
}
