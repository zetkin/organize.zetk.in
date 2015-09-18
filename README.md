# Zetkin Organizer Dashboard
The Organizer Dashboard is the Zetkin interface for organizers. It's built in
javascript and runs [React](http://facebook.github.io/react) both on the client
and on the server.

## Developing Zetkin
We use [Docker](http://docker.com) to configure our development and deployment
environments. You can use something else, e.g. running everything in your local
userspace, but we don't encourage or support that. Read more about how to get
up and running with Docker in the [`env`](./env) folder.

## Repository contents
- `env`: Contains files related to the Docker image configuration
- `gulpfile.js`: Tasks for the Gulp task runner
- `package.json`: NPM package configuration (dependencies et c)
- `src`: All application code resides within this directory
- `tests`: Test suite (currently not set up properly)

## Install
    brew install npm
    npm install
    npm config set prefix /usr/local
    npm install -g gulp
    gulp watch
    # make a change in a js and a css file
