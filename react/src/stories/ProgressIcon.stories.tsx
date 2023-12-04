import React from 'react';
import store from 'store/store';
import { Provider } from 'react-redux';
import { ComponentStory, ComponentMeta } from '@storybook/react';
import { ReactComponent as StarSVG } from '../img/icon_star.svg';

import { ProgressIcon } from '../Components/ProgressIcon/ProgressIcon';

export default {
  title: 'Molecules/ProgressIcon',
  component: ProgressIcon,
} as ComponentMeta<typeof ProgressIcon>;

const Template: ComponentStory<typeof ProgressIcon> = (args) => <Provider store={store}><ProgressIcon {...args} /></Provider>;

export const DefaultProgress = Template.bind({});

export const ProgressWithIcon = Template.bind({});
ProgressWithIcon.args = {
  Icon: StarSVG,
  habitColour: 'green',
  context: 'inList',
  progress: 25,
}
ProgressWithIcon.parameters = {
  docs: {
    description: {
      story: 'Set the context parameter to colour the inner circle. This is important to create the illusion that the centre is transparent. Currently there are two contexts: 1) on a white background (onWhite) and 2) in a ListItem (inList).'
    }
  }
}

export const GradientProgressWithIcon = Template.bind({});
GradientProgressWithIcon.args = {
  Icon: StarSVG,
  gradientClass: 'overlimit',
  habitColour: 'lightBlue',
  progress: 100
}
GradientProgressWithIcon.parameters = {
  docs: {
    description: {
      story: 'circleFgClass prop must either be an empty string or not contain any stroke overriding classes'
    }
  }
}