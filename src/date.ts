// @format

export class TimezoneOffset {
  private _offset: string
  private _offsetMilliseconds: number

  constructor(offset: string) {
    this.offset = offset
  }

  get offset() {
    return this._offset
  }

  set offset(offset: string) {
    const found = offset.match(/^([\+-]?)(\d{1,2}):(\d{1,2})$/)
    if (!found) {
      throw new Error(
        `Given string ${offset} is not a proper UTC offset string`
      )
    }
    const sign = found[1]
    const hour = +found[2]
    const minute = +found[3]
    const minutes = (sign === "-" ? -1 : 1) * (hour * 60 + minute)
    if (minutes > 14 * 60 || minutes < -12 * 60) {
      throw new Error("UTC offset should be between -12:00 and +14:00")
    }
    this._offset = offset
    this._offsetMilliseconds = minutes * 60 * 1000
  }

  get offsetMilliseconds(): number {
    return this._offsetMilliseconds
  }

  toString(): string {
    return this._offset
  }
}

export const dateToString = (d: Date) => {
  const date = d.getDate()
  const month = d.getMonth() + 1
  const year = d.getFullYear()
  return `${year}/${month}/${date}`
}
