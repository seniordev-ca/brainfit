import { lambdaResponse } from '../lambda/layers/shared/nodejs/response';

describe('response.js', () => {
  describe('lambdaResponse()', () => {
    it('produces a successful response object', async () => {
      const result = lambdaResponse(204, {});
      expect(result).toEqual({
        statusCode: 204,
        headers: {
          'Access-Control-Allow-Origin': '*'
        },
        body: JSON.stringify({})
      });
    });
    it('produces a error response object', async () => {
      const result = lambdaResponse(500, { error: 'Error message' });
      expect(result).toEqual({
        statusCode: 500,
        headers: {
          'Access-Control-Allow-Origin': '*'
        },
        body: JSON.stringify({ error: 'Error message' })
      });
    });
  });
});
