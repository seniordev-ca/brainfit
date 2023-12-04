#!/bin/bash

#set -e
#set -x

export SLS_DEBUG=*

sls dynamodb start --config serverless.dev.yml & 
nodemon --exec "node --inspect=127.0.0.1:27017 node_modules/serverless/bin/serverless offline --config serverless.dev.yml" &

wait