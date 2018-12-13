#!/usr/bin/env bash

set -e

php /app/artisan queue:work --verbose --tries=3 --timeout=90
