import React from 'react';
import store from 'store/store';
import { Provider } from 'react-redux';
import { ComponentStory, ComponentMeta } from '@storybook/react';

import { Select } from '../Components/Select/Select';

export default {
    title: 'Archive/Atoms/Select',
    component: Select,
} as ComponentMeta<typeof Select>;

const Template: ComponentStory<typeof Select> = (args) => <Provider store={store}><Select {...args} /></Provider>;

export const Primary = Template.bind({});
Primary.args = {
    size: 'form_medium',
    label: 'Select Label',
    id: 'selectID',
    required: false,
};

export const ErrorState = Template.bind({});
ErrorState.args = {
    size: 'form_medium',
    label: 'Select Label',
    id: 'selectID',
    required: false,
    errorText: 'Please select something above',
};