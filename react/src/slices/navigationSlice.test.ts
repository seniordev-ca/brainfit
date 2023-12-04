import reducer, {
  setLoading,
  returnToStart,
  setErrorState,
  setLoggedInState,
  previousStep
} from './navigationSlice';

const initialState = {
  errorState: {},
  loggedIn: 'false',
  loading: false,
  currentStep: 'home',
  home: 'progress_complete'
};

const errorState = {
  ...initialState,
  errorState: {
    email: 'Invalid email format.'
  }
};

const loading = {
  ...initialState,
  loading: true
}

const loggedIn = {
  ...initialState,
  loggedIn: 'true'
}


const secondStep = {
  ...initialState,
  home: 'progress_complete',
  currentStep: 'second'
}

describe('navigationSlice Unit Tests', () => {
  test('should return the initial state', () => {
    expect(reducer(undefined, { payload: '', type: 'INITIAL_STATE' })).toEqual(initialState)
  });

  test('should record email error state', () => {
    expect(reducer(initialState, setErrorState({
      errorState: {
        email: 'Invalid email format.'
      }
    }))).toEqual(
      errorState
    )
  })

  test('should record loading state', () => {
    expect(reducer(initialState, setLoading({
      loading: true
    }))).toEqual(
      loading
    )
  })

  test('should record loggedIn state', () => {
    const secondState = reducer(initialState, setLoggedInState({
      loggedIn: 'true'
    }))
    expect(secondState).toEqual(
      loggedIn
    )
    expect(reducer(secondState, setLoggedInState({
      loggedIn: 'false'
    }))).toEqual(
      initialState
    )
  })

  test('should move to home step', () => {
    expect(reducer(secondStep, previousStep({ data: {} }))).toEqual(
      { ...initialState, 'second': 'progress_incomplete' }
    )
  })

  test('return to initial state', () => {
    expect(reducer(secondStep, returnToStart())).toEqual(
      initialState
    )
  })
})
