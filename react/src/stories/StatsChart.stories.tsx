import { ComponentMeta, ComponentStory } from '@storybook/react';

import { StatsChart } from 'Components/StatsChart/StatsChart';
export default {
  title: 'Atoms/StatsChart',
  component: StatsChart
} as ComponentMeta<typeof StatsChart>;

const Template: ComponentStory<typeof StatsChart> = (args) => (
  <StatsChart {...args} />
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

export const Primary = Template.bind({});
Primary.args = {
  labels: ['Mo', 'We', 'Fri'],
  values: [0, 100, 50]
};
