import React from 'react';
import store from 'store/store';
import { Provider } from 'react-redux';
import { ComponentStory, ComponentMeta } from '@storybook/react';

import { ExpandedCalendar } from '../Components/ExpandedCalendar/ExpandedCalendar';

export default {
  title: 'Molecules/ExpandedCalendar',
  component: ExpandedCalendar,
} as ComponentMeta<typeof ExpandedCalendar>;

const Template: ComponentStory<typeof ExpandedCalendar> = (args) => <Provider store={store}><ExpandedCalendar currentMonth={1} showCalendar={true} {...args} /></Provider>;

export const DefaultExpandedCalendar = Template.bind({});
