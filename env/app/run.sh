#!/bin/sh

cd /var/app

exec 2>&1
echo "npm install"
npm install
exec node dist/organize.zetk.in/server/main.js
