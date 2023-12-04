setlocal
set SLS_DEBUG=*

start serverless dynamodb start --config serverless.dev.yml &
nodemon --exec "node --inspect=127.0.0.1:27017 node_modules\serverless\bin\serverless offline --config serverless.dev.yml"

:wait