import { parseErrorText } from "./validation";

describe('Validation Unit Tests', () => {
  test('error string parsing', () => {
    const errorText = 'ValidationError: field1: This field is missing. field2: Incorrect format'
    const results = parseErrorText(errorText)
    expect(results).toStrictEqual({
      field1: 'This field is missing',
      field2: 'Incorrect format'
    })
  });
})