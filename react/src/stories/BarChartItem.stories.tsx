import React from 'react';
import store from 'store/store';
import { Provider } from 'react-redux';
import { ComponentStory, ComponentMeta } from '@storybook/react';

import { BarChartItem } from '../Components/BarChartItem/BarChartItem';

export default {
  title: 'Molecules/BarChartItem',
  component: BarChartItem,
} as ComponentMeta<typeof BarChartItem>;

const Template: ComponentStory<typeof BarChartItem> = (args) => {
  return <Provider store={store}><div className="h-32"><BarChartItem {...args} /></div></Provider>
};

export const VerticalItem = Template.bind({});
VerticalItem.args = { 
  horizontal: false, 
  percentComplete: 50, 
  label: 'Label', 
  showPercentageLabel: true 
};

export const HorizontalItem = Template.bind({});
HorizontalItem.args = { 
  horizontal: true, 
  percentComplete: 50, 
  label: 'Label', 
  showPercentageLabel: true 
};
