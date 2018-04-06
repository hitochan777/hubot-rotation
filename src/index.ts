// @format

interface Repository {
  shiftUser: (roomName: string) => void;
  getCurrentUser: (roomName: string) => void;
  addMember: (roomName, username: string) => void;
  deleteMember: (roomName, username: string) => void;
}

class RedisRepository implements Repository {
  private robot;

  constructor(robot) {
    this.robot = robot;
  }

  shiftUser(roomName: string) {
    const currentMemberIndex: number =
      this.robot.brain.get(`rotate:${roomName}:index`) || -1;
    const members: string[] =
      this.robot.brain.get(`rotate:${roomName}:members`) || [];
    if (members.length === 0) {
      throw new Error('There is no member yet');
    }
    const nextMemberIndex = (currentMemberIndex + 1) % members.length;
    this.robot.brain.set(`rotate:${roomName}:index`, nextMemberIndex);
  }

  getCurrentUser(roomName: string) {
    const currentMemberIndex: number =
      this.robot.brain.get(`rotate:${roomName}:index`) || -1;
    const members: string[] =
      this.robot.brain.get(`rotate:${roomName}:members`) || [];
    if (currentMemberIndex < 0) {
      throw new Error('There is no member yet');
    }

    return members[currentMemberIndex];
  }

  addMember(roomName: string, username: string) {
    const members: string[] =
      this.robot.brain.get(`rotate:${roomName}:members`) || [];
    if (members.indexOf(username) >= 0) {
      throw new Error(`${username} already exists`);
    }
    members.push(username);
    this.robot.brain.set(`rotate:${roomName}:members`, members);
  }

  deleteMember(roomName: string, username: string) {
    const members: string[] =
      this.robot.brain.get(`rotate:${roomName}:members`) || [];
    const userIndex = members.indexOf(username);
    if (userIndex < 0) {
      throw new Error(`${username} does not exist`);
    }
    members.splice(userIndex, 1);
    this.robot.brain.set(`rotate:${roomName}:members`, members);
  }
}

// TODO: any is not good
export default (robot: any) => {
  const repo: Repository = new RedisRepository(robot);

  robot.hear(/morning next/, res => {
    try {
      repo.shiftUser(robot.envelope.room);
      const nextUser = repo.getCurrentUser(res.envelope.room);
      res.reply(`Next facilitator is ${nextUser}`);
    } catch (e) {
      res.reply(e);
    }
  });

  robot.hear(/morning add (.+)/, res => {
    const username = res.match[1];
    try {
      repo.addMember(res.envelope.room, username);
      res.reply(`added ${username}`);
    } catch (e) {
      res.reply(e);
    }
  });

  robot.hear(/morning delete (.+)/, res => {
    const username = res.match[1];
    try {
      repo.deleteMember(res.envelope.room, username);
      res.reply(`deleted ${username}`);
    } catch (e) {
      res.reply(e);
    }
  });
};
