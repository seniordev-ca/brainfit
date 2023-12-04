import React from 'react';
import store from 'store/store';
import { Provider } from 'react-redux';
import { ComponentStory, ComponentMeta } from '@storybook/react';

import { Dropdown } from '../Components/Dropdown/Dropdown';

export default {
  title: 'Archive/Molecules/Dropdown',
  component: Dropdown,
} as ComponentMeta<typeof Dropdown>;

const Template: ComponentStory<typeof Dropdown> = (args) => <Provider store={store}><div className="h-screen"><Dropdown {...args} /></div></Provider>;

export const DefaultDropdown = Template.bind({});
DefaultDropdown.args = {
  dropdownItems: [
    {
      label: 'test'
    },
    {
      label: 'test2'
    }
  ]
}

export const DropdownWithCustomClass = Template.bind({});
DropdownWithCustomClass.args = {
  dropdownItems: [
    {
      label: 'max width'
    },
    {
      label: 'test2'
    }
  ],
  // override the default class
  dropdownMenuClass: 'w-full'
}