import reducer, { setFieldWithID, loadUser, clearData } from './userSlice';

const initialState = {
};

const existingUser = {
  id: '123456',
  email: 'test@test.ca'
}

test('should return the initial state', () => {
  expect(reducer(undefined, { payload: '', type: 'INITIAL_STATE' })).toEqual(initialState)
});

test('should set the email field value', () => {
  expect(reducer(initialState, setFieldWithID({ id: 'email', value: 'test@test.ca' }))).toEqual(
    {
      email: 'test@test.ca'
    }
  )
})

test('should clear the data', () => {
  const updatedState = reducer(initialState, setFieldWithID({ id: 'email', value: 'test@test.ca' }));
  expect(reducer(updatedState, clearData())).toEqual(initialState);
});

test('should load the user data', () => {
  expect(reducer(initialState, loadUser(existingUser))).toEqual(existingUser)
});