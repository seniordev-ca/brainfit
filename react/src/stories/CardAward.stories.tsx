import React from 'react';
import { ComponentStory, ComponentMeta } from '@storybook/react';

import { CardAward } from '../Components/CardAward/CardAward';

export default {
    title: 'Organisms/Cards/Awards',
    component: CardAward
} as ComponentMeta<typeof CardAward>;

const Template: ComponentStory<typeof CardAward> = (args) => <CardAward {...args} />;

export const AwardEarned = Template.bind({});
AwardEarned.args = {
    awardEarned: true,
    awardTitle: "7 day streak",
    awardDescription: "You received this award for completed all of your habits within a 7 day period.",
}

export const AwardUnearned = Template.bind({});
AwardUnearned.args = {
    awardEarned: false,
    awardTitle: "14 day streak",
    awardDescription: "You will receive this award when you complete all of your habits within a 14 day period.",
}