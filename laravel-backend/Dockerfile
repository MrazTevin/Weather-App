FROM php:8.4.6-fpm-alpine3.20

WORKDIR /var/www/html

RUN apk add --no-cache \
    build-base \
    libpng-dev \
    libjpeg-turbo-dev \
    freetype-dev \
    libxml2-dev \
    oniguruma-dev \
    zip \
    curl \
    git \
    && docker-php-ext-install pdo_mysql mbstring exif pcntl bcmath gd

COPY . .

RUN curl -sS https://getcomposer.org/installer | php -- --install-dir=/usr/local/bin --filename=composer
RUN composer install --optimize-autoloader --no-dev

EXPOSE 8080

CMD php artisan serve --host=0.0.0.0 --port=8080
