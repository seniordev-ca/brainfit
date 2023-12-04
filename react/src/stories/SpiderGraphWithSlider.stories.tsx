import React from 'react';
import { ComponentStory, ComponentMeta } from '@storybook/react';
import store from 'store/store';
import { Provider } from 'react-redux';
import { SpiderGraphWithSlider } from '../Components/SpiderGraphWithSlider/SpiderGraphWithSlider';

export default {
  title: 'Organisms/SpiderGraphWithSlider',
  component: SpiderGraphWithSlider
} as ComponentMeta<typeof SpiderGraphWithSlider>;

const Template: ComponentStory<typeof SpiderGraphWithSlider> = (args) => <Provider store={store}><SpiderGraphWithSlider results={{
  exercise: 1,
  nutrition: 2,
  stress: 3,
  social: 4,
  sleep: 5,
  mental: 5,
}} onValueChanged={() => { }}
  dateLabel='Today'
  length={5}
/></Provider>

export const SpiderGraphWithSliderTemplate = Template.bind({});

