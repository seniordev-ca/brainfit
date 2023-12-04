import { ComponentMeta, ComponentStory } from '@storybook/react';
import { HabitStatsHeading } from 'Components/HabitStatsHeading/HabitStatsHeading';

export default {
  title: 'Molecules/HabitStatsHeading',
  component: HabitStatsHeading
} as ComponentMeta<typeof HabitStatsHeading>;

const Template: ComponentStory<typeof HabitStatsHeading> = (args) => (
  <HabitStatsHeading {...args} />
);

export const HabitStatsHeader = Template.bind({});
HabitStatsHeader.args = {
  habitIcon: 'eva:clock-outline',
  habitName: 'Habit Name',
  habitPillar: 'Exercise',
  habitColour: 'Exercise',
  habitStatus: '8 glasses'
};
