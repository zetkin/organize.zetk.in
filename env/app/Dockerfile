FROM phusion/baseimage:0.11
MAINTAINER Richard Olsson <r@richardolsson.se>

ARG NODE_ENV=production
ARG GA_MEASUREMENT_ID
ARG ZETKIN_DOMAIN=zetk.in
ARG ZETKIN_USE_TLS=1

# Install node

ENV DEBIAN_FRONTEND noninteractive
RUN curl -sL https://deb.nodesource.com/setup_10.x | bash -
RUN \
	apt-get update && \
	apt-get install -q -y --allow-downgrades --allow-remove-essential \
		--allow-change-held-packages --fix-missing build-essential nodejs git libpng-dev

# Setup app service

RUN mkdir /etc/service/app
ADD env/app/run.sh /etc/service/app/run

# Install app

WORKDIR /var/app

ENV NODE_ENV ${NODE_ENV}
ENV ZETKIN_DOMAIN ${ZETKIN_DOMAIN}
ENV ZETKIN_USE_TLS ${ZETKIN_USE_TLS}
ENV GA_MEASUREMENT_ID ${GA_MEASUREMENT_ID}

## First install deps only, to improve image rebuild performance

COPY package.json ./
RUN npm install

## Install the app itself

COPY . ./

# Init

CMD /sbin/my_init
