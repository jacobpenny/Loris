#!/bin/bash
set -e

if [ ! "$DISABLE_LORIS_SERVICES_PROVISION" = "true" ] ; then
  docker-compose down
  docker-compose build db
fi

docker-compose build unit-tests
docker-compose run --rm unit-tests vendor/bin/phpunit --configuration test/phpunit.xml --testsuite 'LorisUnitTests' $*

function finish {
  if [ ! "$DISABLE_LORIS_SERVICES_PROVISION" = "true" ] ; then
    docker-compose down
  fi
}

trap finish EXIT
