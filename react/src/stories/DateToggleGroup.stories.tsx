import React from 'react';
import { ComponentStory, ComponentMeta } from '@storybook/react';

import { DateToggleGroup } from 'Components/DateToggleGroup/DateToggleGroup';

export default {
    title: 'Molecules/DateToggleGroup',
    component: DateToggleGroup
} as ComponentMeta<typeof DateToggleGroup>;

const Template: ComponentStory<typeof DateToggleGroup> = (args) => <DateToggleGroup {...args} />;

export const WeekView = Template.bind({});