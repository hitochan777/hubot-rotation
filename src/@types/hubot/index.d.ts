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
    match: string[]
    reply(...msg: string[]): void
    send(...msg: string[]): Promise<{}>
    envelope: {
      room: string
    }
  }
}
