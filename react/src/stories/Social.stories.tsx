import React from 'react';
import { ComponentStory, ComponentMeta } from '@storybook/react';

import { Social } from '../Components/Social/Social';

export default {
    title: 'Archive/Molecules/Social',
    component: Social
} as ComponentMeta<typeof Social>;

const Template: ComponentStory<typeof Social> = (args) => <Social />;

export const SocialLinks = Template.bind({});
SocialLinks.parameters = {
    backgrounds: { default: 'Black'}
}