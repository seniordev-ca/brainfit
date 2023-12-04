import React from 'react';
import { ComponentStory, ComponentMeta } from '@storybook/react';

import { DateToggle } from 'Components/DateToggle/DateToggle';

export default {
    title: 'Atoms/DateToggle',
    component: DateToggle
} as ComponentMeta<typeof DateToggle>;

const Template: ComponentStory<typeof DateToggle> = (args) => <DateToggle {...args} />;

export const ToggleOff = Template.bind({});
ToggleOff.args = {
    selected: false,
    label: "M"
}

export const ToggleOn = Template.bind({});
ToggleOn.args = {
    selected: true,
    label: "M"
}