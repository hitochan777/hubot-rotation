// @format

declare module "hubot" {
  export interface Robot {
    hear(
      regex: RegExp,
      options: { [key: string]: any } | Function,
      callback?: (res: Response) => void
    ): void
    brain: {
      get(key: string): any
      set(key: string, val: any): void
    }
  }

  export interface Response {
    match: [string, string, { index: number }, { input: string }]
    reply(...msg: string[]): void
    send(...msg: string[]): void
    envelope: {
      room: string
      user: {
        id: string
        name: string
        email_address: string
        room: string
      }
      message: {
        user: any
        text: string
        id: string
        done: boolean
        room: string
      }
    }
  }
}
