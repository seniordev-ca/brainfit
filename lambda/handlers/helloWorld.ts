export const handler = async (event, context, callback) => {
  const response = {
    statusCode: 200,
    headers: {
      'Access-Control-Allow-Origin': '*'
    },
    body: JSON.stringify({
      message: 'Hello, world!',
      input: event
    })
  };

  callback(null, response);
};
