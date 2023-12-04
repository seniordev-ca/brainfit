import React from 'react';
import store from 'store/store';
import { Provider } from 'react-redux';
import { ComponentStory, ComponentMeta } from '@storybook/react';

import { TimePicker } from "../Components/Timepicker/Timepicker"

export default {
    title: 'Archive/Atoms/TimePicker',
    component: TimePicker,
} as ComponentMeta<typeof TimePicker>;

const Template: ComponentStory<typeof TimePicker> = (args) => <Provider store={store}><TimePicker {...args} /></Provider>;

export const Default = Template.bind({});
Default.args = {
    id: 'timeInputID',
    label: 'Select a time',
}

export const ErrorState = Template.bind({});
ErrorState.args = {
    id: 'timeInputID',
    label: 'Select a time',
    errorText: 'Please select a time above',
}