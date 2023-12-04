// eslint-disable-next-line no-unused-vars
const { isJSDocReadonlyTag } = require("typescript");

//mock for superagent - __mocks__/superagent.js

var mockDelay;
var mockError;
var mockResponse = {
  status() {
    return 200;
  },
  ok() {
    return true;
  },
  get: jest.fn().mockReturnThis(),
  toError: jest.fn().mockReturnValue(new Error('error'))
};

var Request = {
  post() {
    return this;
  },
  get() {
    return this;
  },
  send: jest.fn().mockImplementation(function (callback) {
    if (mockDelay) {
      this.delayTimer = setTimeout(callback, 0, mockError, mockResponse);

      return;
    }

    // callback(mockError, mockResponse);
    return mockResponse;
  }),
  query: jest.fn().mockImplementation(function (callback) {
    if (mockDelay) {
      this.delayTimer = setTimeout(callback, 0, mockError, mockResponse);

      return;
    }

    // callback(mockError, mockResponse);
    return mockResponse;
  }),
  field() {
    return this;
  },
  set() {
    return this;
  },
  accept() {
    return this;
  },
  timeout() {
    return this;
  },
  end: jest.fn().mockImplementation(function (callback) {
    if (mockDelay) {
      this.delayTimer = setTimeout(callback, 0, mockError, mockResponse);

      return;
    }

    // callback(mockError, mockResponse);
    return mockResponse;
  }),
  //expose helper methods for tests to set
  __setMockDelay(boolValue) {
    mockDelay = boolValue;
  },
  __setMockResponse(mockRes) {
    mockResponse = mockRes;
  },
  __setMockError(mockErr) {
    mockError = mockErr;
  }
};

module.exports = Request;