// NavTabBar.stories.test.tsx

import React from 'react';

import { render, screen, waitFor } from '@testing-library/react';
import { composeStories } from '@storybook/testing-react';

import * as stories from '../NavTabBar.stories';

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
  useNavigate: () => jest.fn(),
  useLocation: () => jest.fn()
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

const { ShowFAB } =
  composeStories(stories);

it('renders the default NavTabBar', async () => {
  render(<ShowFAB />);

  await waitFor(() => {
    const elements = screen.queryAllByText(/settings/i);
    expect(elements.length).toEqual(2);
  });
});