#!/bin/sh

cd /var/app

exec 2>&1
exec node dist/organize.zetk.in/server/main.js
