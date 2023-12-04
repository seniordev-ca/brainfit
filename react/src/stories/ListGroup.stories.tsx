import React from 'react';
import store from 'store/store';
import { Provider } from 'react-redux';

import { ComponentStory, ComponentMeta } from '@storybook/react';
import { ReactComponent as StarSVG } from '../img/icon_star.svg';
import { ReactComponent as BetterSleep } from '../img/clipart_better-sleep.svg';
import { ReactComponent as InfoSVG } from '../img/iconInfoCircle.svg';
import { ReactComponent as All } from '../img/Pillars/icon_pillar_all.svg';
import { ReactComponent as Exercise } from '../img/Pillars/icon_pillar_exercise.svg';
import { ReactComponent as Nutrition } from '../img/Pillars/icon_pillar_nutrition.svg';
import { ReactComponent as Social } from '../img/Pillars/icon_pillar_social.svg';
import { ReactComponent as Sleep } from '../img/Pillars/icon_pillar_sleep.svg';
import { ReactComponent as Stress } from '../img/Pillars/icon_pillar_stress.svg';
import { ReactComponent as Mental } from '../img/Pillars/icon_pillar_mental.svg';


import { Switch } from '../Components/Switch/Switch';
import { Stepper } from '../Components/Stepper/Stepper';
import { Input } from '../Components/Input/Input';
import { TextArea } from '../Components/TextArea/TextArea';
import { HabitIcon } from '../Components/HabitIcon/HabitIcon';
import { IconFrame } from '../Components/IconFrame/IconFrame';
import { ProgressIcon } from '../Components/ProgressIcon/ProgressIcon';
import { Trend } from 'Components/Trend/Trend';

import { ListItem } from "../Components/ListItem/ListItem";
import { ListGroup } from "../Components/ListGroup/ListGroup";

export default {
    title: 'Molecules/ListGroup',
    component: ListGroup,
} as ComponentMeta<typeof ListGroup>;

const Template: ComponentStory<typeof ListGroup> = (args) => <Provider store={store}><ListGroup {...args} /></Provider>;

export const Primary = Template.bind({});
Primary.args = {
    listGroupType: "listGroup_primary",
    heading: "Heading",
    items: [
        <ListItem label="Text" suffix="Test Text" chevron={true} />,
        <ListItem label="Text" prefix={<StarSVG />} chevron={true} />,
        <ListItem label="Text" suffix={<Switch id='switch' initialValue={false} />} />,
        <ListItem label="Text" suffix={<Stepper />} />,
        <ListItem label={<Input id='input' placeholder='Placeholder Text' type='text' />} />,
        <ListItem label={<TextArea id='textarea' placeholder='Textarea Placeholder' rows={4} />} />,
        <ListItem label="Text" sublabel="Text" chevron={true} />,
        <ListItem prefix={<ProgressIcon Icon={StarSVG} context="inList" habitColour="red" progress={75} />} label="Today" sublabel="3 of 4 completed" suffix={<InfoSVG />} />,
        <ListItem label="Text" sublabel="Frequency" prefix={<HabitIcon Icon={StarSVG} />} chevron={true} />,
        <ListItem label="Text" sublabel="Subtitle" prefix={<IconFrame Icon={BetterSleep} />} chevron={true} notificationDot={true} />,
        <ListItem label={<Trend pillar="Exercise" direction="better" change={10} />} />
    ]
}

export const Secondary = Template.bind({});
Secondary.args = {
    listGroupType: "listGroup_secondary",
    heading: "Heading",
    items: [
        <ListItem label="Text" suffix="Test Text" chevron={true} />,
        <ListItem label="Text" prefix={<StarSVG />} chevron={true} />,
        <ListItem label="Text" suffix={<Switch id='switch' initialValue={false} />} />,
        <ListItem label="Text" suffix={<Stepper />} />,
        <ListItem label={<Input id='input' placeholder='Placeholder Text' type='text' />} />,
        <ListItem label={<TextArea id='textarea' placeholder='Textarea Placeholder' rows={4} />} />,
        <ListItem label="Text" sublabel="Text" chevron={true} />,
        <ListItem prefix={<ProgressIcon Icon={StarSVG} context="inList" habitColour="red" progress={75} />} label="Today" sublabel="3 of 4 completed" suffix={<InfoSVG />} />,
        <ListItem label="Text" sublabel="Frequency" prefix={<HabitIcon Icon={StarSVG} />} chevron={true} />,
        <ListItem label="Text" sublabel="Subtitle" prefix={<IconFrame Icon={BetterSleep} />} chevron={true} notificationDot={true} />,
        <ListItem label={<Trend pillar="Exercise" direction="better" change={10} />} />
    ]
}

export const PillarSelect = Template.bind({});
PillarSelect.args = {
    listGroupType: "listGroup_primary",
    heading: "Browse by pillar",
    items: [
        <ListItem prefix={<All />} label="All Pillars" chevron={true} />,
        <ListItem prefix={<Exercise />} label="Exercise" chevron={true} />,
        <ListItem prefix={<Nutrition />} label="Nutrition" chevron={true} />,
        <ListItem prefix={<Social />} label="Social Activity" chevron={true} />,
        <ListItem prefix={<Sleep />} label="Sleep" chevron={true} />,
        <ListItem prefix={<Stress />} label="Stress Management" chevron={true} />,
        <ListItem prefix={<Mental />} label="Mental Stimulation" chevron={true} />,
    ]
}