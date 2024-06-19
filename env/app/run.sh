#! /bin/bash -e

cd /var/app

if [ "$NODE_ENV" == "production" ]
then
    npm install --unsafe-perm
    node build/app/server/main
else
    npm install --unsafe-perm
    ./node_modules/.bin/concurrently \
        --kill-others \
        --prefix name \
        --names "gulp,node,webpack" \
        --prefix-colors "bgMagenta,bgCyan,bgYellow" \
        "./node_modules/.bin/gulp watch" \
        "./node_modules/.bin/nodemon --ext '*' --watch build ./build/app/server/main.js" \
        "./node_modules/.bin/webpack-dev-server"
fi
