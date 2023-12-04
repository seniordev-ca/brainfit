import React from 'react';
import store from 'store/store';
import { Provider } from 'react-redux';
import { ComponentStory, ComponentMeta } from '@storybook/react';

import { TimeSpinner } from '../Components/TimeSpinner/TimeSpinner';

export default {
  title: 'Molecules/TimeSpinner',
  component: TimeSpinner,
} as ComponentMeta<typeof TimeSpinner>;

const Template: ComponentStory<typeof TimeSpinner> = (args) => <Provider store={store}><div className="h-screen"><TimeSpinner {...args} /></div></Provider>;

export const DefaultTimeSpinner = Template.bind({});
