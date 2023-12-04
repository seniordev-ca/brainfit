import React from 'react';
import store from 'store/store';
import { Provider } from 'react-redux';

import { ComponentStory, ComponentMeta } from '@storybook/react';
import { ReactComponent as PlusSVG } from '../img/icon_plus.svg';
import { ReactComponent as StarSVG } from '../img/icon_star.svg';
import { ReactComponent as BetterSleep } from '../img/clipart_better-sleep.svg';
import { ReactComponent as InfoSVG } from '../img/iconInfoCircle.svg';

import { Switch } from '../Components/Switch/Switch';
import { Stepper } from '../Components/Stepper/Stepper';
import { HabitIcon } from '../Components/HabitIcon/HabitIcon';
import { IconFrame } from '../Components/IconFrame/IconFrame';
import { ProgressIcon } from '../Components/ProgressIcon/ProgressIcon';
import { ListItem } from "../Components/ListItem/ListItem";

export default {
    title: 'Atoms/ListItem',
    component: ListItem,
} as ComponentMeta<typeof ListItem>;

const Template: ComponentStory<typeof ListItem> = (args) => <Provider store={store}><ListItem {...args} /></Provider>;

export const Text = Template.bind({});
Text.args = {
    listType: "list-primary",
    label: "Text",
    chevron: false,
}

export const TextChevron = Template.bind({});
TextChevron.args = {
    listType: "list-primary",
    label: "Text",
    chevron: true,
}

export const GlyphTextChevron = Template.bind({});
GlyphTextChevron.args = {
    listType: "list-primary",
    prefix: <PlusSVG />,
    label: "Text",
    chevron: true,
}

export const TextTextChevron = Template.bind({});
TextTextChevron.args = {
    listType: "list-primary",
    label: "Text",
    suffix: "Text",
    chevron: true,
}

export const TextGlyphChevron = Template.bind({});
TextGlyphChevron.args = {
    listType: "list-primary",
    label: "Text",
    suffix: <StarSVG />,
    chevron: true,
}

export const TextSwitch = Template.bind({});
TextSwitch.args = {
    listType: "list-primary",
    label: "Text",
    suffix: <Switch id='switch' initialValue={false} />,
}

export const AllSlotsPrimary = Template.bind({});
AllSlotsPrimary.args = {
    listType: "list-primary",
    prefix: <StarSVG />,
    label: "Text",
    suffix: <Switch id='switch' initialValue={false} />,
    chevron: true,
}

export const AllSlotsSecondary = Template.bind({});
AllSlotsSecondary.args = {
    listType: "list-secondary",
    prefix: <StarSVG />,
    label: "Text",
    suffix: <Switch id='switch' initialValue={false} />,
    chevron: true,
}

export const TextTwoLines = Template.bind({});
TextTwoLines.args = {
    listType: "list-primary",
    label: "Text",
    sublabel: "Text",
    chevron: false,
    suffix: <PlusSVG />
}

export const Habit = Template.bind({});
Habit.args = {
    listType: "list-primary",
    prefix: <HabitIcon Icon={StarSVG} />,
    label: "Text",
    sublabel: "Frequency",
    chevron: false,
    suffix: <PlusSVG />
}

export const HabitHistory = Template.bind({});
HabitHistory.args = {
    listType: "list-primary",
    prefix: <ProgressIcon Icon={StarSVG} context="inList" habitColour="red" progress={75} />,
    label: "Today",
    sublabel: "3 of 4 completed",
    chevron: false,
    suffix: <InfoSVG />
}


export const RoundRec = Template.bind({});
RoundRec.args = {
    listType: "list-primary",
    prefix: <IconFrame Icon={BetterSleep} />,
    label: "Text",
    sublabel: "Subtitle",
    chevron: true
}

export const NotificationDot = Template.bind({});
NotificationDot.args = {
    listType: "list-primary",
    prefix: <IconFrame Icon={BetterSleep} />,
    label: "Text",
    sublabel: "Subtitle",
    chevron: true,
    notificationDot: true
}

export const Progress = Template.bind({});
Progress.args = {
    listType: "list-primary",
    prefix: <ProgressIcon progress={25} Icon={StarSVG} context='inList'/>,
    label: "Text",
    sublabel: "Frequency",
    chevron: false,
    suffix: <PlusSVG />
}

export const StepperComponent = Template.bind({});
StepperComponent.args = {
    listType: "list-primary",
    label: "Text",
    suffix: <Stepper />
}