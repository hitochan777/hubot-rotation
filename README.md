# hubot-rotation

[![npm version](https://badge.fury.io/js/hubot-rotation.svg)](https://badge.fury.io/js/hubot-rotation)
[![CircleCI](https://circleci.com/gh/hitochan777/hubot-rotation.svg?style=svg)](https://circleci.com/gh/hitochan777/hubot-rotation)
[![codecov](https://codecov.io/gh/hitochan777/hubot-rotation/branch/master/graph/badge.svg)](https://codecov.io/gh/hitochan777/hubot-rotation)
[![code style: prettier](https://img.shields.io/badge/code_style-prettier-ff69b4.svg?style=flat-square)](https://github.com/prettier/prettier)

hubot-rotation is a hubot script, that makes it easier for your team to rotate some roles such as facilitator of morning meeting.

# Requirement

- [hubot-redis-brain](https://github.com/hubotio/hubot-redis-brain)
  hubot-rotation uses hubot-redis-brain to store data

# Install

## Rocket.Chat
See docker-compose [example](https://github.com/hitochan777/hubot-rotation/tree/master/example/docker-compose.yml)

## Usage

* Add an user
```
morning add hitochan
```

* Delete an user
```
morning delete hitochan
```

* Move the facilitator to the next user
```
morning next
```

# Development

Feel free to submit Pull Requests to improve hubot-rotation together!
First fork this repository, and then run `yarn` to install dependencies.
You can use the following commands during the development.
Note that PRs are accepted only if all the tests pass and the code is formatted with `yarn format`. 
```
# Build
yarn build

# Test 
yarn test

# Formatting
yarn format
```

# LICENSE
MIT
