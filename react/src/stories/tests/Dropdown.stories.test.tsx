// Dropdown.stories.test.tsx

import React from 'react';

import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { composeStories } from '@storybook/testing-react';

import * as stories from '../Dropdown.stories';

const { DefaultDropdown, DropdownWithCustomClass } =
  composeStories(stories);

it('renders the default Dropdown', async () => {
  const onClick = jest.fn();
  render(<DefaultDropdown {...DefaultDropdown.args} dropdownItems={[
    {
      label: 'test',
      onClick: onClick
    }
  ]}/>);
  const button = screen.getByText('test');

  expect(button).toBeInTheDocument();
  fireEvent.click(button);
  expect(onClick).toBeCalledTimes(1);

});

it('renders the Dropdown with custom class', async () => {
  render(<DropdownWithCustomClass {...DropdownWithCustomClass.args} />);

  await waitFor(() => {
    const text = screen.getByText('max width');
    expect(text).toBeInTheDocument();
  });
});