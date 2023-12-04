import React from 'react';
import store from 'store/store';
import { Provider } from 'react-redux';
import { ComponentStory, ComponentMeta } from '@storybook/react';

import { SliderSelfAssessment } from 'Components/SliderSelfAssessment/SliderSelfAssessment';
import { ReactComponent as IconExercise } from '../img/Pillars/icon_pillar_exercise.svg';

export default {
    title: 'Molecules/SelfAssessmentSlider',
    component: SliderSelfAssessment,
} as ComponentMeta<typeof SliderSelfAssessment>;

const Template: ComponentStory<typeof SliderSelfAssessment> = (args) => <Provider store={store}><SliderSelfAssessment {...args} /></Provider>;

export const Primary = Template.bind({});
Primary.args = {
    Icon: IconExercise,
    label: "Exercise",
    value: 1
};