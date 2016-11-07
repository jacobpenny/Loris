FROM php:7.0

RUN apt-get update && \
    apt-get install -y git

# Install extensions through the scripts the container provides
RUN docker-php-ext-install pdo_mysql
