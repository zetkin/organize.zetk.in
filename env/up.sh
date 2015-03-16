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

container_up() {
    # Param $1: name of image/container
    # Param $2: command line args
    running=`docker inspect -f "{{.State.Running}}" $1`
    if [ $? = 0 ]; then
        if [ "$running" = "true" ]; then
            echo "skipping $1 (already running)"
        else
            if [ "$running" = "false" ]; then
                echo removing old $1
                docker rm -f $1 2>&1 > /dev/null
            fi

            run_container $1 "$2"
        fi
    else
        run_container $1 "$2"
    fi
}

build_if_not_exists zetkin-od app
container_up zetkin-od "-ti --rm -p 80:80 -v $PWD/..:/var/app"
