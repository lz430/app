#!/usr/bin/env bash

set -e

service nginx start
php-fpm
