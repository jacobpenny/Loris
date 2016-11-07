#!/bin/bash
set -e
DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
cd $DIR

# TODO run specific test and/or filter
# TODO clean up after it blows up (seg fault)

# Try to docker-compose start, if it fails, do a docker-compose up
# Selenium fails to start if db is alrady started
echo 'Spinning up required services... This may take a minute.'
docker-compose up -d db web selenium > /dev/null 2>&1

while ! mysqladmin ping -h 127.0.0.1 -u SQLTestUser --password="TestPassword" --silent > /dev/null 2>&1; do
    sleep 1
done
echo 'Services ready, running integration tests...'

docker-compose run tests /app/vendor/bin/phpunit --configuration /app/test/phpunit.xml --testsuite 'Loris Core Integration Tests'
docker-compose run tests /app/vendor/bin/phpunit --configuration /app/test/phpunit.xml --testsuite 'Loris Module Integration Tests'

function finish {
  echo 'Spinning down the services...'
  docker-compose stop > /dev/null 2>&1
  echo 'Done'
}
trap finish EXIT
