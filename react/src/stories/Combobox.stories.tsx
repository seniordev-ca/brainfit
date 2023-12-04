import React from 'react';
import store from 'store/store';
import { Provider } from 'react-redux';
import { ComponentStory, ComponentMeta } from '@storybook/react';

import { Combo } from "../Components/Combobox/Combobox"

export default {
    title: 'Archive/Atoms/Combobox',
    component: Combo,
} as ComponentMeta<typeof Combo>;

const Template: ComponentStory<typeof Combo> = (args) => <Provider store={store}><Combo {...args} /></Provider>;

export const Default = Template.bind({});
Default.args = {
    id: 'combobox-default',
    label: 'Pick a city',
    defaultValue: 'London',
    data: ['New York', 'Tokyo', 'London', 'Toronto', 'Los Angeles'],
    filter: 'contains'
}

export const ErrorState = Template.bind({});
ErrorState.args = {
    label: 'Pick a city',
    defaultValue: 'London',
    data: ['New York', 'Tokyo', 'London', 'Toronto', 'Los Angeles'],
    errorText: 'Please select a city above',
    filter: 'contains'
}