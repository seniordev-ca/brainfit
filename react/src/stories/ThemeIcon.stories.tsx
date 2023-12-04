import React from 'react';
import { ComponentStory, ComponentMeta } from '@storybook/react';
import { ThemeIcon } from 'Components/ThemePicker/ThemeIcon';

// import { ReactComponent as LightColour } from '../img/Theme/theme_lightMode_colour.svg';

export default {
    title: 'Atoms/ThemeIcon',
    component: ThemeIcon,
} as ComponentMeta<typeof ThemeIcon>;

const Template: ComponentStory<typeof ThemeIcon> = (args) => <ThemeIcon {...args} />;

export const ColourDefault = Template.bind({});
ColourDefault.args = {
    label: "Default",
}
export const ColourSelected = Template.bind({});
ColourSelected.args = {
    label: "Default",
    selected: true
}
export const MonoDefault = Template.bind({})
MonoDefault.args = {
    colour: "red", 
    label: "Mono"
}
export const MonoSelected = Template.bind({})
MonoSelected.args = {
    colour: "red",
    label: "Mono",
    selected: true
}