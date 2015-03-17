#!/bin/sh

# Runs locally installed gulp, so that gulp doesn't need to be installed on the
# host system. The local gulp and other packages in node_modules should be
# installed by the ./env/setup.sh script, which installs them from within the
# docker container.
./node_modules/.bin/gulp $@
