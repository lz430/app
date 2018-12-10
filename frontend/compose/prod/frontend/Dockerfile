FROM node:11-stretch

ENV NODE_ENV production
ENV PORT 3000
EXPOSE 3000

###########################################################################
# System Updates
###########################################################################
RUN apt-get update \
	&& apt-get install -y \
		emacs \
		wget \
		curl \
		unzip \
    && rm -rf /var/lib/apt/lists/*

###########################################################################
# Setup
###########################################################################
RUN mkdir -p /app
#RUN apk add --no-cache libc6-compat

RUN mkdir -p /app
WORKDIR /app
COPY . /app

###########################################################################
# Install Application
###########################################################################
RUN yarn install && yarn run build

CMD [ "yarn", "start" ]
