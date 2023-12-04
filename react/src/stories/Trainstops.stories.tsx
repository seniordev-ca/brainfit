import React from 'react';
import { ComponentStory, ComponentMeta } from '@storybook/react';

import { Trainstops } from '../Components/Trainstops/Trainstops';

export default {
  title: 'Atoms/Trainstops',
  component: Trainstops
} as ComponentMeta<typeof Trainstops>;

const Template: ComponentStory<typeof Trainstops> = (args) => <Trainstops {...args} />;

let activeStop = 0

function updateActive(newStop: number) {
  activeStop = newStop
}

export const ThreeStops = Template.bind({});
ThreeStops.args = {
  numberOfStops: 3,
  activeStop,
  onClick: (newStop) => updateActive(newStop)
};

export const FourStops = Template.bind({});
FourStops.args = {
  numberOfStops: 4,
  activeStop,
  onClick: (newStop) => updateActive(newStop)
};