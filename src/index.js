"use strict";
// @format
Object.defineProperty(exports, "__esModule", { value: true });
var RedisRepository = /** @class */ (function () {
    function RedisRepository(robot) {
        this.robot = robot;
    }
    RedisRepository.prototype.shiftUser = function (roomName) {
        var currentMemberIndex = this.robot.brain.get("rotate:" + roomName + ":index") || -1;
        var members = this.robot.brain.get("rotate:" + roomName + ":members") || [];
        if (members.length === 0) {
            throw new Error('There is no member yet');
        }
        var nextMemberIndex = (currentMemberIndex + 1) % members.length;
        this.robot.brain.set("rotate:" + roomName + ":index", nextMemberIndex);
    };
    RedisRepository.prototype.getCurrentUser = function (roomName) {
        var currentMemberIndex = this.robot.brain.get("rotate:" + roomName + ":index") || -1;
        var members = this.robot.brain.get("rotate:" + roomName + ":members") || [];
        if (currentMemberIndex < 0) {
            throw new Error('There is no member yet');
        }
        return members[currentMemberIndex];
    };
    RedisRepository.prototype.addMember = function (roomName, username) {
        var members = this.robot.brain.get("rotate:" + roomName + ":members") || [];
        if (members.indexOf(username) >= 0) {
            throw new Error(username + " already exists");
        }
        members.push(username);
        this.robot.brain.set("rotate:" + roomName + ":members", members);
    };
    RedisRepository.prototype.deleteMember = function (roomName, username) {
        var members = this.robot.brain.get("rotate:" + roomName + ":members") || [];
        var userIndex = members.indexOf(username);
        if (userIndex < 0) {
            throw new Error(username + " does not exist");
        }
        members.splice(userIndex, 1);
        this.robot.brain.set("rotate:" + roomName + ":members", members);
    };
    return RedisRepository;
}());
// TODO: any is not good
exports.default = function (robot) {
    var repo = new RedisRepository(robot);
    robot.hear(/morning next/, function (res) {
        try {
            repo.shiftUser(robot.envelope.room);
            var nextUser = repo.getCurrentUser(res.envelope.room);
            res.reply("Next facilitator is " + nextUser);
        }
        catch (e) {
            res.reply(e);
        }
    });
    robot.hear(/morning add (.+)/, function (res) {
        var username = res.match[1];
        try {
            repo.addMember(res.envelope.room, username);
            res.reply("added " + username);
        }
        catch (e) {
            res.reply(e);
        }
    });
    robot.hear(/morning delete (.+)/, function (res) {
        var username = res.match[1];
        try {
            repo.deleteMember(res.envelope.room, username);
            res.reply("deleted " + username);
        }
        catch (e) {
            res.reply(e);
        }
    });
};
