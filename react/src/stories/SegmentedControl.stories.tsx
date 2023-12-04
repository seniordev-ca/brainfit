import React from 'react';
import store from 'store/store';
import { Provider } from 'react-redux';
import { ComponentStory, ComponentMeta } from '@storybook/react';

import { SegmentedControl } from '../Components/SegmentedControl/SegmentedControl';

export default {
  title: 'Atoms/SegmentedControl',
  component: SegmentedControl
} as ComponentMeta<typeof SegmentedControl>;

const Template: ComponentStory<typeof SegmentedControl> = (args) => <Provider store={store}><SegmentedControl {...args} /></Provider>;

export const SixOptions = Template.bind({});
SixOptions.args = {
  optionLabels: ['1W', '1M', '3M', '6M', '1Y', 'All']
}

export const FourOptions = Template.bind({});
FourOptions.args = {
  optionLabels: ['Option 1', 'Option 2', 'Option 3', 'Option 4']
}

export const ThreeOptions = Template.bind({});
ThreeOptions.args = {
  optionLabels: ['Option 1', 'Option 2', 'Option 3']
}

export const TwoOptions = Template.bind({});
TwoOptions.args = {
  optionLabels: ['Option 1', 'Option 2']
}