import { createSlice } from '@reduxjs/toolkit';
import { StoreType } from '../store/store';
import { steps, StepProps } from '../constants/nav';
import { validationSchemas } from '../constants/validation';

export type NavigationState = { [key: string]: any };


export function buildNavStateFromData(data: { [key: string]: any }) {
  const newState: NavigationState = {
    loading: 'false',
    currentStep: 'home',
    home: 'progress_complete'
  };

  steps.forEach((step) => {
    const { id } = step;
    if (validationSchemas[id] && newState.currentStep === 'home') {
      const validator = validationSchemas[id];
      newState[id] = 'progress_complete';

      const { error } = validator.validate(data.data, {
        abortEarly: false
      });

      if (error) {
        newState.currentStep = id;
        newState[id] = 'progress_incomplete';
      }
    }
  });
  return newState;
}

function determineStepStatus(policy: { [key: string]: any }, id: string) {
  let returnValue = 'progress_incomplete';
  const validator = validationSchemas[id];

  if (validator) {
    const { error } = validator.validate(policy.data, {
      abortEarly: false
    });

    if (error) {
      returnValue = 'progress_incomplete';
    } else {
      returnValue = 'progress_complete';
    }
  }
  return returnValue;
}

function previousStepsComplete(navState: NavigationState, step: string) {
  for (let index = 0; index < steps.length; index += 1) {
    const currentStep = steps[index].id;

    if (currentStep === step) {
      break;
    } else if (
      !navState[currentStep] ||
      navState[currentStep] === 'progress_incomplete'
    ) {
      return false;
    }
  }
  return true;
}

function canJumpToStep(navState: NavigationState, step: string) {
  const allPreviousComplete = previousStepsComplete(navState, step);

  if (
    navState[step] === 'progress_complete' ||
    navState[step] === 'progress_error' ||
    allPreviousComplete
  ) {
    return true;
  }
  return false;
}

const getNextStep = (state: any) => {
  // Deep copy so nothing is overwritten
  const stepsCopy: StepProps[] = JSON.parse(JSON.stringify(steps));
  // Remove procedure steps that haven't been selected
  const proceduresIndex = steps.findIndex(
    (row) => row.description === 'Procedure Identification'
  );
  const procedureStep = steps[proceduresIndex]
  const { selectedChildStep, selectedProcedureSteps } = state;

  let nextStep = procedureStep;

  if (selectedChildStep) {
    // Traverse down to the current child node
    selectedProcedureSteps.forEach((stepID: string) => {
      if (nextStep.children) {
        [nextStep] = nextStep.children.filter((step) => step.id === stepID);
      }
    });
    // Find the new selected child
    if (nextStep.children) {
      [nextStep] = nextStep.children.filter(
        (row) => selectedChildStep === row.id
      );
    }
  } else {
    const currentIndex = stepsCopy.findIndex(
      (step) => step.id === state.currentStep
    );

    if (currentIndex < 0) {
      // Exit sub nav
      nextStep = stepsCopy[proceduresIndex + 1];
    } else {
      // Standard next step
      nextStep = stepsCopy[currentIndex + 1];
    }
  }
  return nextStep?.id || state.currentStep;
};

const getPreviousStep = (state: any) => {
  // Deep copy so nothing is overwritten
  const stepsCopy: StepProps[] = JSON.parse(JSON.stringify(steps));
  const proceduresIndex = stepsCopy.findIndex(
    (row) => row.description === 'Procedure Identification'
  );
  const currentIndex = stepsCopy.findIndex(
    (step) => step.id === state.currentStep
  );
  let returnID: string = state.currentStep;

  // Check sub nav if on on the step after or inside the child structure
  if (currentIndex === proceduresIndex + 1 || currentIndex < 0) {
    const { selectedProcedureSteps } = state;

    if (selectedProcedureSteps.length > 0) {
      returnID = selectedProcedureSteps[selectedProcedureSteps.length - 1];
    } else {
      const procedureStep = stepsCopy[proceduresIndex];
      returnID = procedureStep.id;
    }
  } else if (currentIndex > 0) {
    const previousStep = stepsCopy[currentIndex - 1];
    returnID = previousStep.id;
  }
  return returnID;
};

export const navigationSlice = createSlice({
  name: 'navigation',
  // Initial state set as example until completion of navigation process
  initialState: {
    errorState: {},
    loggedIn: 'false',
    loading: false,
    currentStep: 'home',
    home: 'progress_complete'
  },
  reducers: {
    setErrorState: (state, action) => {
      const { errorState } = action.payload;
      return { ...state, errorState };
    },
    setLoggedInState: (state, action) => {
      const { loggedIn } = action.payload;
      let step = state.currentStep;

      return { ...state, loggedIn, currentStep: step };
    },
    setLoading: (state, action) => {
      const { loading } = action.payload;
      return { ...state, loading };
    },
    nextStep: (state, action) => {
      const nextStep = getNextStep(state)
      let { data } = action.payload;
      const currentID = state.currentStep
      let newStatus = determineStepStatus(data, currentID)

      return { ...state, currentStep: nextStep, [currentID]: newStatus };
    },
    previousStep: (state, action) => {
      let { data } = action.payload;
      const currentID = state.currentStep
      let newStatus = determineStepStatus(data, currentID)
      const previousStep = getPreviousStep({ ...state, selectedProcedureSteps: steps })

      return { ...state, currentStep: previousStep, [currentID]: newStatus };
    },
    returnToStart: () => {
      return {
        errorState: {},
        loading: false,
        loggedIn: 'false',
        currentStep: 'home',
        home: 'progress_complete'
      };
    },
    initStateWithData: (state, action) => {
      const newState: NavigationState = buildNavStateFromData(action.payload);
      return { ...state, ...newState };
    },
    jumpToStep: (state, action) => {
      const stepToJumpTo = action.payload;

      if (canJumpToStep(state, stepToJumpTo)) {
        return { ...state, currentStep: stepToJumpTo };
      }
      return { ...state };
    },
    loadNavigation: (state, action) => {
      return action.payload;
    },
  }
});

export const {
  setLoading,
  returnToStart,
  initStateWithData,
  nextStep,
  previousStep,
  jumpToStep,
  setErrorState,
  setLoggedInState,
  loadNavigation
} = navigationSlice.actions;
export const getNavigation = (state: StoreType): NavigationState =>
  state.navigation;
export default navigationSlice.reducer;
