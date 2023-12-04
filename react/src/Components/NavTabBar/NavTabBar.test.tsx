import { render, screen } from '@testing-library/react';
import { Provider } from 'react-redux';
import {BrowserRouter as Router} from 'react-router-dom';
import store from 'store/store';
import { NavTabBar } from './NavTabBar';

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

test('renders Nav Tab bar', () => {
  render(<Provider store={store}><Router><NavTabBar /></Router></Provider>);
  const text = screen.getByText('Settings');
  expect(text).toBeInTheDocument();
});
