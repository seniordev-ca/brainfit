import React from 'react';
import { SamplePage } from './SamplePage';
import { render, screen } from '@testing-library/react';
import PlatformHelper from 'helpers/platformHelper';
import { Provider } from 'react-redux';
import store from 'store/store';

jest.mock('@capacitor/core', () => ({
  ...jest.requireActual('@capacitor/core'),
  Capacitor: {
    getPlatform: jest.fn().mockReturnValue('ios')
  }
}))

jest.mock('helpers/ios/healthKit', () => ({
  init: jest.fn().mockReturnThis()
}));

jest.mock('@capacitor/push-notifications', () => ({
  requestPermissions: jest.fn(() => Promise.resolve())
}));

describe('Samaple page tests', () => {
  test('renders Sample page', () => {
    PlatformHelper.init = jest.fn().mockImplementation(() => ({
      getSteps: () => jest.fn().mockReturnValue(10)
    }));
    render(
      <Provider store={store}>
        <SamplePage />
      </Provider>
    );
    const text = screen.getByText(/Sample/i);
    expect(text).toBeInTheDocument();
  });
})