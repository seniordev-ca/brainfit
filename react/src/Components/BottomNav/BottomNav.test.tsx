import React from 'react';
import { BottomNav } from './BottomNav';
import { render, screen } from '@testing-library/react';
import { Provider } from 'react-redux';
import store from 'store/store';
import { BrowserRouter } from 'react-router-dom';

const mockNavigate = jest.fn();

jest.mock('@capacitor-community/fcm', () => {

})

jest.mock('@capacitor/push-notifications', () => ({
  PushNotifications: {
    addListener: () => jest.fn(),
    checkPermissions: () => jest.fn(),
    requestPermissions: () => jest.fn(),
    register: () => jest.fn(),
    getDeliveredNotifications: () => jest.fn()
  }
}));

jest.mock('react-router', () => ({
  ...jest.requireActual('react-router'), // use actual for all non-hook parts
  useNavigate: () => mockNavigate
}));

jest.mock('contentful', () => ({
  ...jest.requireActual('contentful'), // use actual for all non-hook parts
  createClient: () => {
    return {
      getEntries: () => Promise.resolve({
        items: [
          {
            sys: {
              id: 'Pillar ID'
            },
            fields: {
              pillar: 'general',
              title: 'Test content'
            }
          }
        ]
      })
    }
  }
}));

describe('BottomNav page tests', () => {
  test('renders BottomNav page', () => {
    render(
      <Provider store={store}>
        <BrowserRouter>
          <BottomNav />
        </BrowserRouter>
      </Provider>
    );
    const elements = screen.queryAllByText(/Settings/i);
    expect(elements.length).toEqual(2);
  });
})