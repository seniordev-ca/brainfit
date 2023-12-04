import React from 'react';
import { useDispatch } from 'react-redux';
import { jumpToStep } from '../../slices/navigationSlice';

export interface ProgressProps {
  id: string;
  header?: string;
  desc?: string;
  stateClass?: 'progress_active' | 'progress_incomplete' | 'progress_complete';
  primary?: boolean;
  hide?: boolean;
  children?: any;
}

export const Progress = function ({
  id,
  header,
  desc,
  stateClass = 'progress_incomplete',
  hide = false,
  primary = true,
  ...props
}: ProgressProps) {
  const mode = primary ? '' : 'subquestion';
  const hidden = hide ? 'hidden' : '';
  const dispatch = useDispatch();
  return (
    <div
      className={['flex-1', mode, hidden].join(' ')}
      role="button"
      tabIndex={0}
      onClick={() => {
        dispatch(jumpToStep(id));
      }}
      onKeyPress={(event) => {
        if (event.key === 'Enter') dispatch(jumpToStep(id));
      }}
    >
      <div className={['progress', stateClass, mode].join(' ')}>
        <div className={['progress_header', mode].join(' ')}>{header}</div>
        <div className={['progress_description', mode].join(' ')}>{desc}</div>
        {props.children}
      </div>
    </div>
  );
};
