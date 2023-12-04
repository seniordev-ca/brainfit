import React from 'react';
import store from 'store/store';
import { Provider } from 'react-redux';
import { ComponentStory, ComponentMeta } from '@storybook/react';

import { Questionnaire } from '../Components/Questionnaire/Questionnaire';
import { BrowserRouter } from 'react-router-dom';

export default {
    title: 'Organisms/Questionnaire',
    component: Questionnaire
  } as ComponentMeta<typeof Questionnaire>;

  const Template: ComponentStory<typeof Questionnaire> = (args) => <Provider store={store}><BrowserRouter><Questionnaire /></BrowserRouter></Provider>

  export const QuestionnaireTemplate = Template.bind({});
  