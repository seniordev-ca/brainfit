import React from 'react';
import { ComponentStory, ComponentMeta } from '@storybook/react';
import { ThemePicker } from 'Components/ThemePicker/ThemePicker';
import store from 'store/store';
import { Provider } from 'react-redux';

export default {
    title: 'Organisms/ThemePicker',
    component: ThemePicker,
} as ComponentMeta<typeof ThemePicker>;

const Template: ComponentStory<typeof ThemePicker> = (args) => <Provider store={store}><ThemePicker {...args} /></Provider>;

export const Default = Template.bind({});

export const Mono = Template.bind({});
Mono.args = {
    mono: true,
    colour: "red"
}
