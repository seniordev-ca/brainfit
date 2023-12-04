import React from 'react';
import store from 'store/store';
import { Provider } from 'react-redux';
import { ComponentStory, ComponentMeta } from '@storybook/react';

import { Scroller } from '../Components/Scroller/Scroller';

export default {
  title: 'Molecules/Scroller',
  component: Scroller,
} as ComponentMeta<typeof Scroller>;

const Template: ComponentStory<typeof Scroller> = (args) => <Provider store={store}><div className="h-full"><Scroller {...args} /></div></Provider>;

export const DefaultScroller = Template.bind({});
DefaultScroller.args = {
  source: [
    { value: 'test', text: 'test' },
    ...new Array(24).fill(1).map((v, i) => ({ value: i + 1, text: i + 1 }))
  ], // object {value: xx, text: xx}
}

export const NonInfiniteScroller = Template.bind({});
NonInfiniteScroller.args = {
  type: 'normal',
  source: [
    { value: 'day', text: 'day' },
    { value: 'week', text: 'week' },
    { value: 'month', text: 'month' },
    { value: 'year', text: 'year' }
  ], // object {value: xx, text: xx}
}
