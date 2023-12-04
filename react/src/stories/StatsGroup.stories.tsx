import { ComponentMeta, ComponentStory } from '@storybook/react';
import { StatsGroup } from 'Components/StatsGroup/StatsGroup';

export default {
  title: 'Organisms/Cards/StatsGroup',
  component: StatsGroup
} as ComponentMeta<typeof StatsGroup>;

const Template: ComponentStory<typeof StatsGroup> = (args) => (
  <StatsGroup {...args} />
);

export const StatsGroupCard = Template.bind({});
StatsGroupCard.args = {
  habit: {
    colour: 'lightBlue',
    progress: 87,
    icon: '🌊',
    pillars: ['Exercise'],
    status: 'Active',
    title: 'Super cool habit',
    units: 'Glasses',
    targetValue: 8
  },
  stats: {
    averageCompletion: 56,
    longestStreak: 18,
    currentStreak: 4,
    totalCompleted: 1800
  }
};
