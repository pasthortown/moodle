FROM php:7.4-apache
RUN apt-get update && apt-get install -y \
        graphviz \
        aspell \
        ghostscript \
        clamav \
        git \
        nano \
        wget \
        gnupg2 \
        zip \
        unzip \
        libfreetype6-dev \
        libjpeg62-turbo-dev \
        libmcrypt-dev \
        libicu-dev \
        libxml2-dev \
        libzip-dev \
        libpng-dev \
        libldb-dev \
        libldap2-dev \
    && docker-php-ext-configure gd --with-freetype --with-jpeg \
    && docker-php-ext-install -j$(nproc) gd
RUN echo "deb http://apt.postgresql.org/pub/repos/apt buster-pgdg main" > /etc/apt/sources.list.d/pgdg.list
RUN wget --quiet -O - https://www.postgresql.org/media/keys/ACCC4CF8.asc | \
    apt-key add -
RUN apt-get update
RUN apt-get install --no-install-recommends -y \
        postgresql-server-dev-9.5 \
        zlib1g-dev \
        libicu-dev \
        g++ \
        unixodbc-dev \
        libxml2-dev \
        libaio-dev \
        libmemcached-dev \
        freetds-dev \
	libssl-dev \
	openssl
RUN docker-php-ext-install \
            intl \
            gd \
            pgsql \
            mysqli \
            pdo_pgsql \
            pdo_mysql \
            xml \
            xmlrpc \
            ldap \
            soap \
            zip
RUN curl -sS https://getcomposer.org/installer -o composer-setup.php
RUN php composer-setup.php --install-dir=/usr/local/bin --filename=composer
RUN rm composer-setup.php
RUN apt-get clean \
    && rm -rf /var/lib/apt/lists/*