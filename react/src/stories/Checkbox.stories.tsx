import React from 'react';
import store from 'store/store';
import { Provider } from 'react-redux';
import { ComponentStory, ComponentMeta } from '@storybook/react';

import { Checkbox } from '../Components/Checkbox/Checkbox';

export default {
    title: 'Archive/Atoms/Checkbox',
    component: Checkbox,
} as ComponentMeta<typeof Checkbox>;

const Template: ComponentStory<typeof Checkbox> = (args) => <Provider store={store}><Checkbox {...args} /></Provider>;

export const Default = Template.bind({});
Default.args = {
    size: 'medium',
    message: 'Inline checkbox description',
    id: 'checkbox'
};

export const ErrorState = Template.bind({});
ErrorState.args = {
    size: 'medium',
    message: 'Inline checkbox description',
    id: 'checkbox',
    errorText: 'Please click the checkbox above',
};