# MusicMonkey API

[ ![Codeship Status for ruairitobrien/music-monkey-api](https://app.codeship.com/projects/a0accad0-27bb-0136-a7af-76568d97e0d2/status?branch=master)](https://app.codeship.com/projects/287091)

## Developing locally

You have 2 options. Install required tools locally or use docker (with docker-compose in this case).

### Using dev tools in local environment

This app relies on redis for caching. It also connects to dynamodb when running locally. These should both be stubbed out for local development but not gotten there yet.

Install [Redis](https://redis.io/) and make sure it's running.

To run the app `yarn dev`

This compiles the typescript in the app and runs it.

This will launch the application on [localhost:8080](http://localhost:8080)

### Using docker-compose

This project has a dockerfile and a docker-compose file.

If you have installed docker, then you should have the `docker-compose` command.

You will first need to build the docker image using `docker-compose build` (from the root of the project directory)

Then run `docker-compose up` to run the project.

It will also be available at [localhost:8080](http://localhost:8080)

If you add any new dependencies, you will need to run `docker-compose build` again.

### Environment variables

This app picks up all its configurations from environment variables. We haven't implemented a nice way of dealing with this for local development yet so in the meantime, make sure you have configured values for all of these:

SPOTIFY_CLIENT_ID
SPOTIFY_CLIENT_SECRET
PUSHER_APP_ID
PUSHER_KEY
PUSHER_SECRET
PUSHER_CLUSTER
DYNAMO_DB_USER_ID
DYNAMO_DB_SECRET_KEY
DYNAMO_DB_REGION
LOGGLY_SUB_DOMAIN
LOGGLY_TOKEN
ROLLBAR_ACCESS_TOKEN
FACEBOOK_APP_ID

## Deploying

Deployments are automated. We use [CodeShip](https://codeship.com/) to automate deployments. All you need to do is push changes to the master branch to deploy. Other branches will not deploy.

See the build badge at the top of this Readme for more.

Once deployed the app is available at [https://api.musicmonkey.io](api.musicmonkey.io)

## Troubleshooting

If you get an annoying Dtrace error running the app on a Mac, this helped:

[node-gyp issue](https://github.com/nodejs/node-gyp/issues/569)

In my case that was:

```bash
xcode-select --install # Install Command Line Tools if you haven't already.
sudo xcode-select --switch /Library/Developer/CommandLineTools # Enable command line tools
sudo xcode-select -s /Applications/Xcode.app/Contents/Developer
```

Followed by:

```bash
yarn global add node-gyp
rm -rf node_modules yarn.lock
yarn install
```

#### Debugging in VSCode

in `.vscode/launch.json`

```
{
  "version": "0.2.0",
  "configurations": [
      {
          "type": "node",
          "request": "launch",
          "name": "Launch Program",
          "program": "${workspaceFolder}/build/server/server.js"
      }
  ]
}
```
