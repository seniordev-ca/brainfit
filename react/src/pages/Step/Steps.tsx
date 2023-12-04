/* eslint-disable import/no-unresolved */
import { ReactElement } from 'react';
import Home from './Steps/Home';

/**
 * shows contents of wizard based on step
 *
 * @param step
 * @returns
 */
export const renderStep = (
  step: string
): ReactElement => {
  switch (step) {
    case 'home':
      return <Home />;
    default:
      return <Home />;
  }
};
