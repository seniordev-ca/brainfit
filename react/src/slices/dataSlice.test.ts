import reducer, { clearData, setDataFieldWithID, loadData, toggleCollection } from './dataSlice';

const initialState = {
  data: {
    questionnaireAnswers: [],
    notifications: [],
    appearanceOption: "system"
  }
};

const existingPolicy = {
  id: '123456',
  data: {
    email: 'test@test.ca',
    questionnaireAnswers: [],
    appearanceOption: "system"
  }
}

const existingPolicyWithCollection = {
  id: '123456',
  data: {
    email: 'test@test.ca',
    healthQuestions: ['healthQID'],
    questionnaireAnswers: [],
    notifications: [],
    appearanceOption: "system"
  }
}

test('should return the initial state', () => {
  expect(reducer(undefined, { payload: '', type: 'INITIAL_STATE' })).toEqual(initialState)
});

test('should set the email field value', () => {
  expect(reducer(initialState, setDataFieldWithID({ id: 'email', value: 'test@test.ca' }))).toEqual(
    {
      data: {
        email: 'test@test.ca',
        notifications: [],
        questionnaireAnswers: [],
        appearanceOption: "system"
      }
    }
  )
})

test('should set the procedureID field value which invokes Segment', () => {
  expect(reducer(initialState, setDataFieldWithID({ id: 'procedureID', value: 'testProcedure' }))).toEqual(
    {
      data: {
        procedureID: 'testProcedure',
        notifications: [],
        questionnaireAnswers: [],
        appearanceOption: "system"
      }
    }
  )
})

test('should clear the data', () => {
  const updatedState = reducer(initialState, setDataFieldWithID({ id: 'email', value: 'test@test.ca' }));
  expect(reducer(updatedState, clearData())).toEqual(initialState);
});

test('should load the policy data', () => {
  expect(reducer(initialState, loadData(existingPolicy))).toEqual(existingPolicy)
});

test('should add value to uninitalized collection', () => {
  expect(reducer(initialState, toggleCollection({ collectionID: 'healthQuestions', fieldID: 'healthQID' }))).toEqual(
    {
      data: {
        healthQuestions: ['healthQID'],
        notifications: [],
        questionnaireAnswers: [],
        appearanceOption: "system"
      }
    }
  )
});

test('should add value to existing collection', () => {
  expect(reducer(existingPolicyWithCollection, toggleCollection({ collectionID: 'healthQuestions', fieldID: 'healthQID2' }))).toEqual(
    {
      id: '123456',
      data: {
        email: 'test@test.ca',
        healthQuestions: ['healthQID', 'healthQID2'],
        notifications: [],
        questionnaireAnswers: [],
        appearanceOption: "system"
      }
    }
  )
});

test('should remove value from existing collection', () => {
  expect(reducer(existingPolicyWithCollection, toggleCollection({ collectionID: 'healthQuestions', fieldID: 'healthQID' }))).toEqual(
    {
      id: '123456',
      data: {
        email: 'test@test.ca',
        healthQuestions: [],
        notifications: [],
        questionnaireAnswers: [],
        appearanceOption: "system"
      }
    }
  )
});