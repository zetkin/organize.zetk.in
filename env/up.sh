#!/bin/sh

build_if_not_exists() {
    # Param $1: name of image
    # Param $2: path to build context
    images=`docker images |grep -e ^$1[[:space:]]`
    if [ -z "$images" ]; then
        echo building $1
        docker build -t $1 $2
    else
        echo $1 already built
    fi
}

run_container() {
    # Param $1: name of image/container
    # Param $2: command line args
    echo starting $1
    docker run --name=$1 $2 $1
}

container_is_running() {
    # Param $1: name of container
    running=`docker inspect -f "{{.State.Running}}" $1`
    if [ $? = 0 ]; then
        if [ "$running" = "true" ]; then
            return 1
        fi
    fi

    return 0
}

container_up() {
    # Param $1: name of image/container
    # Param $2: command line args
    container_is_running $1
    if [ $? = 1 ]; then
        echo "skipping $1 (already running)"
    else
        docker rm -f $1 2>&1 > /dev/null
        run_container $1 "$2"
    fi
}

build_if_not_exists zetkin-od app

# Check whether there is a locally running container for the Zetkin platform.
# If not, use a development server as API back-end
container_is_running api
if [ $? = 1 ]; then
    api_params='-e API_HOST=api -e API_PORT=8080 --link api:api'
else
    api_params='-e API_HOST=dev.zetk.in -e API_PORT=80'
fi

echo Starting with API settings: $api_params
container_up zetkin-od "-ti --rm -p 80:80 -v $PWD/..:/var/app $api_params"
