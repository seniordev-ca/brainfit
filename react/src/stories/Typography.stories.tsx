import React from 'react';
import { ComponentStory, ComponentMeta } from '@storybook/react';

import { Typography } from '../Components/Typography/Typography';

export default {
    title: 'Atoms/Typography',
    component: Typography,
} as ComponentMeta<typeof Typography>;

const Template: ComponentStory<typeof Typography> = (args) => <Typography {...args} />;

export const Display = Template.bind({})
Display.args = {
    usage: 'display',
    content: 'The quick brown fox jumps over the lazy dog',
}

export const HeadingLarge = Template.bind({})
HeadingLarge.args = {
    usage: 'headingLarge',
    content: 'The quick brown fox jumps over the lazy dog',
}

export const HeadingMedium = Template.bind({})
HeadingMedium.args = {
    usage: 'headingMedium',
    content: 'The quick brown fox jumps over the lazy dog',
}

export const HeadingSmall = Template.bind({})
HeadingSmall.args = {
    usage: 'headingSmall',
    content: 'The quick brown fox jumps over the lazy dog',
}

export const Body = Template.bind({})
Body.args = {
    usage: 'body',
    content: 'The quick brown fox jumps over the lazy dog',
}

export const CaptionMedium = Template.bind({})
CaptionMedium.args = {
    usage: 'captionMedium',
    content: 'The quick brown fox jumps over the lazy dog',
}

export const CaptionRegular = Template.bind({})
CaptionRegular.args = {
    usage: 'captionRegular',
    content: 'The quick brown fox jumps over the lazy dog',
}

export const TabBarTablet = Template.bind({})
TabBarTablet.args = {
    usage: 'tabBarTablet',
    content: 'The quick brown fox jumps over the lazy dog',
}

export const TabBar = Template.bind({})
TabBar.args = {
    usage: 'tabBar',
    content: 'The quick brown fox jumps over the lazy dog',
}

export const HistoryBold = Template.bind({})
HistoryBold.args = {
    usage: 'historyBold',
    content: 'The quick brown fox jumps over the lazy dog',
}

export const HistoryRegular = Template.bind({})
HistoryRegular.args = {
    usage: 'historyRegular',
    content: 'The quick brown fox jumps over the lazy dog',
}