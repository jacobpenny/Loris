#!/bin/bash
set -e
DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
cd $DIR

# TODO test watch feature
# TODO run specific test and/or filter

# Try to docker-compose start, if it fails, do a docker-compose up
if docker-compose start db > /dev/null 2>&1 ; then
  echo -e 'Using an existing database container. If you would like a fresh instance run `docker-compose down` before running these tests.\n'
else
  echo 'Spinning up a fresh database... This may take a minute.'
  docker-compose up -d db > /dev/null 2>&1
fi

while ! mysqladmin ping -h 127.0.0.1 -u SQLTestUser --password="TestPassword" --silent > /dev/null 2>&1; do
    sleep 1
done
echo 'Services ready, building app image...'
docker-compose build tests

echo 'App image built, running tests...'
docker-compose run --rm tests /app/vendor/bin/phpunit --configuration /app/test/phpunit.xml --testsuite 'LorisUnitTests for php/libraries'

function finish {
  echo 'Spinning down the database...'
  docker-compose stop > /dev/null 2>&1
  echo 'Done'
}
trap finish EXIT
