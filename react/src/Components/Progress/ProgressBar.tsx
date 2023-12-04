import React from 'react';
import { useSelector } from 'react-redux';
import { getNavigation } from '../../slices/navigationSlice';
import { StepProps, steps } from '../../constants/nav';
import { Progress, ProgressProps } from './Progress';

interface ProgressBarProps {
  wrapperClass?: Array<string> | string;
}

const RenderChildren = (
  step: StepProps,
  level: number
): any => {
  const navigationState = useSelector(getNavigation);
  const { currentStep } = navigationState;

  let stateClass: ProgressProps['stateClass'] = 'progress_incomplete';
  const key = step.id;

  const hideStep = (row: StepProps) => {
    const stepState = navigationState[row.id];
    return !(
      level === 1 ||
      stepState === 'progress_complete' ||
      row.id === currentStep
    );
  };

  if (currentStep === key) {
    stateClass = 'progress_active';
  } else if (
    navigationState[key] &&
    navigationState[key] === 'progress_complete'
  ) {
    stateClass = 'progress_complete';
  }

  if (step.children && step.children?.length > 0) {
    return (
      <Progress
        key={key}
        id={key}
        header={step.header}
        desc={step.description}
        stateClass={stateClass}
        primary={level === 1}
        hide={hideStep(step)}
      >
        {step.children?.map((row) => {
          return RenderChildren(row, level + 1);
        })}
      </Progress>
    );
  }
  const hide = hideStep(step);
  return (
    <Progress
      key={key}
      id={key}
      header={step.header}
      desc={step.description}
      stateClass={stateClass}
      primary={level === 1}
      hide={hide}
    />
  );
};

export const ProgressBar = function ({
  wrapperClass = ['md:py-3 text-sm text-white flex flex-row md:flex-col']
}: ProgressBarProps) {
  return (
    <div key="progressBar" className={Array.isArray(wrapperClass) ? wrapperClass.join(' ') : wrapperClass}>
      {steps.map((step) => RenderChildren(step, 1))}
    </div>
  );
};
