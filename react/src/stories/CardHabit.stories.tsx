import React from 'react';
import { ComponentStory, ComponentMeta } from '@storybook/react';

import { CardHabit } from '../Components/CardHabit/CardHabit';

export default {
    title: 'Organisms/Cards/Habit',
    component: CardHabit
} as ComponentMeta<typeof CardHabit>;

const Template: ComponentStory<typeof CardHabit> = (args) => <CardHabit {...args} />;

export const HabitCard = Template.bind({});
HabitCard.args = {
    habitIcon: "eva:clock-outline",
    habitName: "Habit Name",
    habitStatus: "Status",
    habitPillar: "Exercise",
    habitColour: "Exercise",
    habitProgress: 66,
}

export const HabitCardTutorial = Template.bind({});
HabitCardTutorial.args = {
    habitIcon: "eva:clock-outline",
    habitName: "Habit Name",
    habitStatus: "Status",
    habitPillar: "Exercise",
    habitColour: "Exercise",
    habitProgress: 66,
    showTutorial: true,
}

export const HabitCardPaused = Template.bind({});
HabitCardPaused.args = {
    habitIcon: "eva:clock-outline",
    habitName: "Habit Name",
    habitStatus: "Status",
    habitPillar: "Exercise",
    habitColour: "Exercise",
    habitProgress: 66,
    cardScreen: true
}