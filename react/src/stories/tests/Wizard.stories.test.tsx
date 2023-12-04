// Wizard.stories.test.tsx

import React from 'react';

import { render, screen } from '@testing-library/react';
import { composeStories } from '@storybook/testing-react';

import * as stories from '../Wizard.stories';

const { WizardTemplate } = composeStories(stories);

it('renders the WizardTemplate', () => {
  render(<WizardTemplate {...WizardTemplate.args} />);
  const text = screen.getByText("Continue");
  expect(text).toBeInTheDocument();
});
