import React from 'react';
import store from 'store/store';
import { Provider } from 'react-redux';
import { ComponentStory, ComponentMeta } from '@storybook/react';

import { SelfAssessment } from 'Components/SelfAssessment/SelfAssessment';

export default {
    title: 'Organisms/SelfAssessment',
    component: SelfAssessment
} as ComponentMeta<typeof SelfAssessment>;

const Template: ComponentStory<typeof SelfAssessment> = (args) => <Provider store={store}><SelfAssessment /></Provider>

export const SelfAssessmentTemplate = Template.bind({});
SelfAssessmentTemplate.args = {}