#!/bin/bash
set -e

if [ ! "$DISABLE_LORIS_SERVICES_PROVISION" = "true" ] ; then
  docker-compose down
  docker-compose build db
fi

docker-compose build web integration-tests

docker-compose run --rm integration-tests vendor/bin/phpunit --configuration test/phpunit.xml --testsuite 'LorisCoreIntegrationTests' $*
docker-compose run --rm integration-tests vendor/bin/phpunit --configuration test/phpunit.xml --testsuite 'LorisModuleIntegrationTests' $*

function finish {
  if [ ! "$DISABLE_LORIS_SERVICES_PROVISION" = "true" ] ; then
    docker-compose down
  fi
}

trap finish EXIT