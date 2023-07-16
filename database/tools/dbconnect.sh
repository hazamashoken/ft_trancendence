#!/bin/bash
# to connect database from localhost
install_client() {
  # install client to localhost
  sudo apt-get install postgresql
  sudo apt-get install postgresql-client
}

run() {
  source ".env"
  DB_HOST=localhost
  psql "postgresql://$DB_USERNAME:$DB_PASSWORD@$DB_HOST:$DB_PORT/$DB_NAME"
}

if [ "$1" == "run" ]; then
  run
fi
