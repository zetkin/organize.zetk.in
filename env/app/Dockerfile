FROM phusion/baseimage:0.9.16
MAINTAINER Richard Olsson <r@richardolsson.se>

ENV DEBIAN_FRONTEND noninteractive
RUN apt-get update && apt-get install -q -y --force-yes --fix-missing \
        build-essential nodejs npm

RUN ln -s /usr/bin/nodejs /usr/bin/node

RUN mkdir /etc/service/organizer-dashboard
ADD run.sh /etc/service/organizer-dashboard/run

CMD /sbin/my_init
