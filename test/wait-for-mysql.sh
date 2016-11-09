#!/bin/bash

# Wrapper script which waits until MySQL is up and serving requests.

set -e

host="$1"
shift
cmd="$@"

while ! mysqladmin ping -h "$host" -u SQLTestUser --password="TestPassword" --silent ; do
  sleep 1
done

exec $cmd
