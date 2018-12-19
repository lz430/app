FROM node:11-stretch

ENV NODE_ENV production
ENV PORT 3000
EXPOSE 3000

ARG NODE_ENV="production"
ARG REACT_APP_ENVIRONMENT
ARG REACT_APP_API_URL
ARG REACT_APP_URL
ARG REACT_APP_MARKETING_URL
ARG REACT_APP_MIXPANEL_TRACK
ARG REACT_APP_ENABLE_SOURCEMAPS
ARG REACT_APP_RECAPTCHA_PUBLIC_KEY
ARG REACT_APP_MIXPANEL_TOKEN
ARG REACT_APP_GA_TOKEN
ARG REACT_APP_SENTRY_DSN

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
COPY ./package.json /app
COPY . /app

###########################################################################
# Install Application
###########################################################################
RUN yarn install
RUN yarn build

CMD [ "yarn", "start" ]
