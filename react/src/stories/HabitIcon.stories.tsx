import React from 'react';
import { ComponentStory, ComponentMeta } from '@storybook/react';

import { HabitIcon } from 'Components/HabitIcon/HabitIcon';
import { ReactComponent as StarSVG } from '../img/icon_star.svg';

export default {
    title: 'Atoms/HabitIcon',
    component: HabitIcon
} as ComponentMeta<typeof HabitIcon>;

const Template: ComponentStory<typeof HabitIcon> = (args) => <HabitIcon {...args} />;

export const Primary = Template.bind({});
Primary.args = {
    habitColour: "purple",
    Icon: StarSVG
}