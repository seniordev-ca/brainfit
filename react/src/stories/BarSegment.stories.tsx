import React from 'react';
import store from 'store/store';
import { Provider } from 'react-redux';
import { ComponentStory, ComponentMeta } from '@storybook/react';
// import { ReactComponent as ShareSVG } from '../img/share.svg';

import { BarSegment } from '../Components/BarSegment/BarSegment';

export default {
  title: 'Atoms/BarSegment',
  component: BarSegment,
} as ComponentMeta<typeof BarSegment>;

const Template: ComponentStory<typeof BarSegment> = (args) => {
  return <Provider store={store}><div className={!args.horizontal ? 'w-10 h-32' : 'w-full h-10'}><BarSegment {...args} /></div></Provider>
};

export const VerticalSegment = Template.bind({});
VerticalSegment.args = { horizontal: false, percentComplete: 50 };

export const HorizontalSegment = Template.bind({});
HorizontalSegment.args = { horizontal: true, percentComplete: 50 };
