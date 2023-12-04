import React from 'react';
import { ComponentStory, ComponentMeta } from '@storybook/react';

import { ReactComponent as BrainWave } from '../img/brainwave.svg';
import { CardChallenge } from 'Components/CardChallenge/CardChallenge';

export default {
    title: 'Organisms/Cards/Challenge',
    component: CardChallenge
} as ComponentMeta<typeof CardChallenge>;

const Template: ComponentStory<typeof CardChallenge> = (args) => <CardChallenge {...args} />;

export const Default = Template.bind({});
Default.args = {
    cardType: "card-actionable",
    challengeName: "Challenge Name",
    totalDuration: 10,
    completedDuration: 2,
    timeUnit: "days",
    Icon: BrainWave
}

export const NoIcon = Template.bind({});
NoIcon.args = {
    cardType: "card-notactionable",
    challengeName: "Challenge Name",
    totalDuration: 10,
    completedDuration: 2,
    timeUnit: "days",
}