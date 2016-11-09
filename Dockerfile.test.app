FROM php:7.0

RUN apt-get update && \
    apt-get install -y git mysql-client zlib1g-dev

RUN curl -sS https://getcomposer.org/installer | php -- --install-dir=/usr/bin/ --filename=composer

# Install extensions through the scripts the container provides
RUN docker-php-ext-install pdo_mysql zip

WORKDIR /app
RUN mkdir -p project/libraries

# Copy composer files into the app directory.
COPY composer.json composer.lock ./

# Install dependencies with Composer.
# --prefer-source fixes issues with download limits on Github.
# --no-interaction makes sure composer can run fully automated
RUN composer install --no-interaction --no-scripts --no-autoloader

COPY . ./

# 'project/config.xml' is hard-coded in many places so we must do this:
RUN cp test/config.xml project/config.xml

RUN composer dump-autoload
