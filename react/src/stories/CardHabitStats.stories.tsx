import { ComponentMeta, ComponentStory } from '@storybook/react';
import { CardHabitStats } from 'Components/CardHabitStats/CardHabitStats';
import { EmptyHabit } from 'contexts/customhabit.context';

export default {
  title: 'Organisms/Cards/CardHabitStats',
  component: CardHabitStats
} as ComponentMeta<typeof CardHabitStats>;

const Template: ComponentStory<typeof CardHabitStats> = (args) => (
  <CardHabitStats {...args} />
);

export const HabitStatsCard = Template.bind({});
HabitStatsCard.args = {
  habit: EmptyHabit,
  graph: {
    labels: ['Fri', 'Sat', 'Sun', 'Mon', 'Tue', 'Wed', 'Today'],
    values: [50, 49, 62, 70, 81, 62, 38]
  },
  stats: {
    averageCompletion: 56,
    longestStreak: 18,
    currentStreak: 4,
    totalCompleted: 1800
  }
};
