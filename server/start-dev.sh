#!/usr/bin/env bash
set -e

# Start MongoDB if not already running
if ! pgrep -x mongod > /dev/null; then
  mkdir -p /tmp/mongodb/data
  mongod --dbpath /tmp/mongodb/data --logpath /tmp/mongodb/mongod.log --fork
  echo "MongoDB started"
  # Wait for MongoDB to be ready
  sleep 3
else
  echo "MongoDB already running"
fi

# Start the API server
exec npm run dev -w @workspace/api-server
