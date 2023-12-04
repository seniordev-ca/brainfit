import React from 'react';
import { ComponentStory, ComponentMeta } from '@storybook/react';

import { Switch } from "../Components/Switch/Switch";

export default {
    title: 'Atoms/Switch',
    component: Switch,
} as ComponentMeta<typeof Switch>;

const Template: ComponentStory<typeof Switch> = (args) => <Switch {...args} />;

export const NoLabel = Template.bind({});
NoLabel.args = {
    id: 'noLabel'
}

export const Label = Template.bind({});
Label.args = {
    id: 'Label',
    label: 'Sample'
}

export const OnToggleFunction = Template.bind({});
OnToggleFunction.args = {
    id: 'Toggle',
    label: 'toggle with callback',
    onSwitchToggle: (value: boolean) => console.log(`${value} received`)
}