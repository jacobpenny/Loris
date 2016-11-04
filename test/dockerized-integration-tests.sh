#!/bin/bash
set -e
DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
cd $DIR

# TODO run specific test and/or filter
# TODO service names in variable
# TODO clean up after it blows up (seg fault)

# Try to docker-compose start, if it fails, do a docker-compose up
if docker-compose start db web selenium > /dev/null 2>&1 ; then
  echo -e 'Using an existing database container. If you would like a fresh instance run `docker-compose down` before running these tests.\n'
else
  echo 'Spinning up a fresh database... This may take a minute.'
  docker-compose up -d db web selenium > /dev/null 2>&1
fi

while ! mysqladmin ping -h 127.0.0.1 -u SQLTestUser --password="TestPassword" --silent > /dev/null 2>&1; do
    sleep 1
done
echo 'Services ready, running integration tests...'

export LORIS_DB_CONFIG=config.xml
../vendor/bin/phpunit --debug --verbose --configuration phpunit.xml --testsuite 'Loris Core Integration Tests'
../vendor/bin/phpunit --debug --verbose --configuration phpunit.xml --testsuite 'Loris Module Integration Tests'

function finish {
  echo 'Spinning down the database...'
  docker-compose stop > /dev/null 2>&1
  echo 'Done'
}
trap finish EXIT
