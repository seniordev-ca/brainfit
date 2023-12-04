import React from 'react';

import { ComponentStory, ComponentMeta } from '@storybook/react';

import { FilterPill } from 'Components/FilterPill/FilterPill';

export default {
    title: 'Atoms/FilterPill',
    component: FilterPill,
} as ComponentMeta<typeof FilterPill>;

const Template: ComponentStory<typeof FilterPill> = (args) => <FilterPill {...args} />;

export const Unselected = Template.bind({});
Unselected.args = {
    label: "Text",
    selected: false,
}

export const Selected = Template.bind({});
Selected.args = {
    label: "Text",
    selected: true,
}