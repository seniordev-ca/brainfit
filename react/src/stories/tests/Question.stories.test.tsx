// ProgressBar.stories.test.tsx

import React from 'react';

import { render, screen } from '@testing-library/react';
import { composeStories } from '@storybook/testing-react';

import * as stories from '../Question.stories';

jest.mock('@capacitor-community/fcm', () => {

})

jest.mock('@capacitor/core', () => ({
  ...jest.requireActual('@capacitor/core'),
  Capacitor: {
    getPlatform: jest.fn().mockReturnValue('ios'),
    registerPlugin: jest.fn()
  }
}));

jest.mock('@capacitor/dialog', () => { });

jest.mock('contentful', () => ({
  ...jest.requireActual('contentful'), // use actual for all non-hook parts
  createClient: () => {
    return {
      getEntries: () => Promise.resolve({
        items: [
          {
            sys: {
              id: 'Tip ID'
            },
            fields: {
              pillar: 'general',
              title: 'Did you know'
            }
          },
        ]
      })
    }
  }
}));

const { NameCapture, SatisfactionSurvey, InterestAreas } = composeStories(stories);

it('renders the first Question', () => {
  render(<NameCapture {...NameCapture.args} />);
  const text = screen.getByText(/your name/i);
  expect(text).toBeInTheDocument();
});

it('renders the second Question', () => {
  render(<SatisfactionSurvey {...SatisfactionSurvey.args} />);
  const text = screen.getByText(/from/i);
  expect(text).toBeInTheDocument();
});

it('renders the third Question', () => {
  render(<InterestAreas {...InterestAreas.args} />);
  const text = screen.getByText(/brain fit/i);
  expect(text).toBeInTheDocument();
});
