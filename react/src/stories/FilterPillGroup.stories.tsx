import React from 'react';
import { ComponentStory, ComponentMeta } from '@storybook/react';

import { FilterPill } from 'Components/FilterPill/FilterPill';
import { FilterPillGroup } from 'Components/FilterPillGroup/FilterPillGroup';

export default {
    title: 'Molecules/FilterPillGroup',
    component: FilterPillGroup,
} as ComponentMeta<typeof FilterPillGroup>;

const Template: ComponentStory<typeof FilterPillGroup> = (args) => <FilterPillGroup {...args} />;

export const Primary = Template.bind({});
Primary.args = {
    items: [
        <FilterPill label="All pillars" selected={false} />,
        <FilterPill label="Exercise" selected={true} />,
        <FilterPill label="Nutrition" selected={false} />,
        <FilterPill label="Social Activity" selected={false} />,
        <FilterPill label="Stress Management" selected={false} />,
        <FilterPill label="Mental Stimulation" selected={false} />,
        <FilterPill label="Sleep" selected={true} />,
    ]
}