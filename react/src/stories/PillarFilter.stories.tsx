import React from 'react';
import { ComponentStory, ComponentMeta } from '@storybook/react';

import { PillarFilter } from "../Components/PillarFilter/PillarFilter";

export default {
  title: 'Molecules/PillarFilter',
  component: PillarFilter
} as ComponentMeta<typeof PillarFilter>;

const Template: ComponentStory<typeof PillarFilter> = (args) => <PillarFilter />;

export const Primary = Template.bind({});
Primary.args = {

}