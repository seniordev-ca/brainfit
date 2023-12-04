export const handler = async (event, context, callback) => {
  const response = {
    statusCode: 200,
    headers: {
      'Access-Control-Allow-Origin': '*'
    },
    body: JSON.stringify({
      AWS_STAGE: process.env.AWS_STAGE,
      PUBLIC_URL: process.env.PUBLIC_URL,
      API_URL: process.env.API_URL
    })
  };

  callback(null, response);
};
