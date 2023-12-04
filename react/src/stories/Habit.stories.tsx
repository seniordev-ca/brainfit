import React from 'react';
import { ComponentStory, ComponentMeta } from '@storybook/react';

import { Habit } from '../Components/Habit/Habit';

export default {
  title: 'Atoms/Habit',
  component: Habit
} as ComponentMeta<typeof Habit>;

const Template: ComponentStory<typeof Habit> = (args) => <Habit {...args} />;

export const Primary = Template.bind({});
Primary.args = {
  title: 'Habit to form',
  onClick: () => {}
};

export const BoldedTitle = Template.bind({});
BoldedTitle.args = {
  title: 'Habit to form',
  onClick: () => {},
  bolded: true
};
