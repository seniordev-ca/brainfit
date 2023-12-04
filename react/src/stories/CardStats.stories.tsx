import React from 'react';
import { ComponentStory, ComponentMeta } from '@storybook/react';

import { CardStats } from 'Components/CardStats/CardStats';
import { ReactComponent as StarSVG } from '../img/icon_star.svg';

export default {
    title: 'Archive/Organisms/Cards/Stats',
    component: CardStats
} as ComponentMeta<typeof CardStats>;

const Template: ComponentStory<typeof CardStats> = (args) => <CardStats {...args} />;

export const StatsCard = Template.bind({});
StatsCard.args = {
    habitColour: "mental",
    Icon: StarSVG,
    habitName: "Habit Name",
    habitPillar: "Pillar",
    chartConfiguration: {
        data: [
            {
                percentComplete: 90,
                label: "Sun"
            },
            {
                percentComplete: 100,
                label: "Mon"
            },
            {
                percentComplete: 44,
                label: "Tue"
            },
            {
                percentComplete: 58,
                label: "Wed"
            },
            {
                percentComplete: 10,
                label: "Thu"
            },
            {
                percentComplete: 23,
                label: "Fri"
            },
            {
                percentComplete: 45,
                label: "Sat"
            },
        ]
    }
}