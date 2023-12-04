import { ComponentMeta, ComponentStory } from '@storybook/react';

import { StatsChartWithHistory } from 'Components/StatsChartWithHistory/StatsChartWithHistory';
import { EmptyHabit } from 'contexts/customhabit.context';
import { Activity } from 'models/activity';
import { Habit } from 'models/habit';
export default {
  title: 'Molecules/StatsChartWithHistory',
  component: StatsChartWithHistory
} as ComponentMeta<typeof StatsChartWithHistory>;

const Template: ComponentStory<typeof StatsChartWithHistory> = (args) => (
  <StatsChartWithHistory {...args} />
);

// const stories = storiesOf('StatsChart', module);

// stories.add(
//   'Stats chart',
//   () => <StatsChart labels={['Mo', 'We', 'Fri']} values={[0, 100, 50]} />,
//   {
//     options: {
//       labels: [],
//       values: []
//     }
//   }
// );

export const DayWithSingleEntry = Template.bind({});
DayWithSingleEntry.args = {
  habits: [
    Habit.create({
      ...EmptyHabit,
      activities: [
        Activity.create({
          actDate: Date.now(),
          breakHabit: false,
          cycle: 1,
          habitID: '',
          id: '',
          pillars: ['Exercise'],
          progress: 5,
          targetValue: 10,
          skipped: false,
          frequency: 'day',
          frequencyCount: 1
        })
      ]
    })
  ],
  colour: 'Exercise',
  frequency: 'day'
};
export const DayWithTwoEntries = Template.bind({});
DayWithTwoEntries.args = {
  habits: [
    Habit.create({
      ...EmptyHabit,
      activities: [
        Activity.create({
          actDate: Date.now(),
          breakHabit: false,
          cycle: 1,
          habitID: '',
          id: '',
          pillars: ['Exercise'],
          progress: 5,
          targetValue: 10,
          skipped: false,
          frequency: 'day',
          frequencyCount: 1
        }),
        Activity.create({
          actDate: Date.now() + 8.64e7,
          breakHabit: false,
          cycle: 2,
          habitID: '',
          id: '',
          pillars: ['Exercise'],
          progress: 8,
          targetValue: 10,
          skipped: false,
          frequency: 'day',
          frequencyCount: 1
        })
      ]
    })
  ],
  colour: 'Exercise',
  frequency: 'day'
};
