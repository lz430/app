FROM php:7.2-fpm


###########################################################################
# System Updates
###########################################################################
RUN apt-get update \
	&& apt-get install -y \
		emacs \
		wget \
		curl \
		unzip \
		mysql-client \
		zlib1g-dev \
		libicu-dev \
		g++ \
		nginx \
    && rm -rf /var/lib/apt/lists/*

###########################################################################
# Nginx
###########################################################################
COPY ./compose/prod/php-fpm/conf/nginx-site.conf /etc/nginx/sites-enabled/default


###########################################################################
# Composer
###########################################################################
RUN curl -sS https://getcomposer.org/installer | php -- --install-dir=/usr/local/bin --filename=composer
RUN composer --version

# Set your timezone here
#RUN rm /etc/localtime
#RUN ln -s /usr/share/zoneinfo/Asia/Dubai /etc/localtime
#RUN "date"

# Run docker-php-ext-install for available extensions
RUN docker-php-ext-configure intl \
    && docker-php-ext-install pdo pdo_mysql opcache intl

###########################################################################
# Some cleanup
###########################################################################

COPY ./compose/prod/php-fpm/conf/app.ini /usr/local/etc/php/conf.d
COPY ./compose/prod/php-fpm/conf/app-php-fpm.conf /usr/local/etc/php-fpm.d


RUN usermod -u 1000 www-data

WORKDIR /app

###########################################################################
# Install Application
###########################################################################
COPY . /app
RUN composer install --no-interaction --prefer-dist --optimize-autoloader
RUN chown www-data:www-data /app -R

COPY ./compose/prod/php-fpm/entrypoint.sh /etc/entrypoint.sh
RUN chmod u+x /etc/entrypoint.sh

EXPOSE 80
ENTRYPOINT ["sh", "/etc/entrypoint.sh"]
