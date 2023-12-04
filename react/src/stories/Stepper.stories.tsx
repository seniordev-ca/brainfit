import React from 'react';
import { ComponentStory, ComponentMeta } from '@storybook/react';

import { Stepper } from 'Components/Stepper/Stepper';

export default {
    title: 'Atoms/Stepper',
    component: Stepper,
} as ComponentMeta<typeof Stepper>;

const Template: ComponentStory<typeof Stepper> = (args) => <Stepper {...args} />;

export const Primary = Template.bind({});
