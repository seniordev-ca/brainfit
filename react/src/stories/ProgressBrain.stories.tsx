import React from 'react';

import { ComponentStory, ComponentMeta } from '@storybook/react';

import { ProgressBrain } from 'Components/ProgressBrain/ProgressBrain';

export default {
    title: 'Atoms/ProgressBrain',
    component: ProgressBrain,
} as ComponentMeta<typeof ProgressBrain>;

const Template: ComponentStory<typeof ProgressBrain> = (args) => <ProgressBrain {...args} />;

export const Primary = Template.bind({});
Primary.args = {
    progress: 50,
    id: "brain"
}