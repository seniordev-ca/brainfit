import React from 'react';
import store from 'store/store';
import { Provider } from 'react-redux';
import { ComponentStory, ComponentMeta } from '@storybook/react';
import { Trend } from 'Components/Trend/Trend';

export default {
  title: 'Molecules/Trend',
  component: Trend
} as ComponentMeta<typeof Trend>;

const Template: ComponentStory<typeof Trend> = (args) => {
  return (
    <Provider store={store}>
      <Trend {...args} />
    </Provider>
  );
};

export const TrendTile = Template.bind({});
TrendTile.args = {
  pillar: 'Exercise',
  direction: 'better',
  change: 10
};
