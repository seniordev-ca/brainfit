import React from 'react';
import store from 'store/store';
import { Provider } from 'react-redux';
import { ComponentStory, ComponentMeta } from '@storybook/react';

import { Question } from '../Components/Question/Question';

export default {
  title: 'Molecules/Question',
  component: Question
} as ComponentMeta<typeof Question>;

const Template: ComponentStory<typeof Question> = (args) => <Provider store={store}><Question {...args} /></Provider>;

export const NameCapture = Template.bind({});
NameCapture.args = {
  index: 0,
}

export const SatisfactionSurvey = Template.bind({});
SatisfactionSurvey.args = {
  index: 1,
}

export const InterestAreas = Template.bind({});
InterestAreas.args = {
  index: 2,
}
