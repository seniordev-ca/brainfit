import React from 'react';

import { ComponentStory, ComponentMeta } from '@storybook/react';
import { ReactComponent as BetterSleep } from '../img/clipart_better-sleep.svg';

import { IconFrame } from 'Components/IconFrame/IconFrame';

export default {
    title: 'Atoms/IconFrame',
    component: IconFrame,
} as ComponentMeta<typeof IconFrame>;

const Template: ComponentStory<typeof IconFrame> = (args) => <IconFrame {...args} />;

export const Primary = Template.bind({});
Primary.args = {
    Icon: BetterSleep,
}
Primary.parameters = { backgrounds: { default: 'Light'}}