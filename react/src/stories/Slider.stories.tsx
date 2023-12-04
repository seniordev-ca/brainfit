import React from 'react';
import store from 'store/store';
import { Provider } from 'react-redux';
import { ComponentStory, ComponentMeta } from '@storybook/react';

import { Slider } from '../Components/Slider/Slider';

export default {
  title: 'Atoms/Slider',
  component: Slider,
} as ComponentMeta<typeof Slider>;

const Template: ComponentStory<typeof Slider> = (args) => <Provider store={store}><Slider {...args} /></Provider>;

export const Primary = Template.bind({});
Primary.args = {
  minimumValue: 1,
  maximumValue: 5,
  onValueChanged: (currentValue) => console.log(currentValue)
};