FROM phusion/baseimage:0.9.16
MAINTAINER Richard Olsson <r@richardolsson.se>

ENV DEBIAN_FRONTEND noninteractive
RUN curl -sL https://deb.nodesource.com/setup_0.12 | sudo bash -
RUN apt-get update && apt-get install -q -y --force-yes --fix-missing \
        build-essential nodejs git

RUN npm install npm -g

RUN mkdir /etc/service/organize.zetk.in
ADD run.sh /etc/service/organize.zetk.in/run

# Need to be in right working directory for tests to run
WORKDIR /var/app

CMD /sbin/my_init
