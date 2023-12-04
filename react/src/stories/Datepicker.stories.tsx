import React from 'react';
import store from 'store/store';
import { Provider } from 'react-redux';
import { ComponentStory, ComponentMeta } from '@storybook/react';

import { DatePickerInput } from "../Components/Datepicker/Datepicker"

export default {
    title: 'Archive/Atoms/Datepicker',
    component: DatePickerInput,
} as ComponentMeta<typeof DatePickerInput>;

const Template: ComponentStory<typeof DatePickerInput> = (args) => <Provider store={store}><DatePickerInput {...args} /></Provider>;

export const Default = Template.bind({});
Default.args = {
    id: 'dateInputID',
    label: 'Select a date',
}

export const ErrorState = Template.bind({});
ErrorState.args = {
    id: 'dateInputID',
    label: 'Select a date',
    errorText: 'Please select a date above',
}