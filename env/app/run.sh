#!/bin/sh

cd /var/app

# Install requirements on first run. This is not suitable for deployment, for
# which we shuld instead COPY the repository into the image at build-time.
exec 2>&1
exec node bin/server.js
