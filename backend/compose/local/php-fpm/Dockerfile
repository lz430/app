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
COPY ./conf/nginx-site.conf /etc/nginx/sites-enabled/default

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
# xDebug:
###########################################################################
RUN pecl install xdebug && \
    docker-php-ext-enable xdebug

# Copy xdebug configuration for remote debugging
COPY ./conf/xdebug.ini /usr/local/etc/php/conf.d/xdebug.ini


###########################################################################
# Final Thoughts:
###########################################################################

COPY ./conf/app.ini /usr/local/etc/php/conf.d
COPY ./conf/app-php-fpm.conf /usr/local/etc/php-fpm.d


RUN usermod -u 1000 www-data

WORKDIR /app

COPY ./entrypoint.sh /etc/entrypoint.sh
RUN chmod u+x /etc/entrypoint.sh

EXPOSE 80
ENTRYPOINT ["sh", "/etc/entrypoint.sh"]
