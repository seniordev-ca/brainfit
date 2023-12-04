import React from 'react';
import { ComponentStory, ComponentMeta } from '@storybook/react';

import { NavTabBar } from '../Components/NavTabBar/NavTabBar';
import { BrowserRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import store from 'store/store';

export default {
    title: 'Molecules/Navigation',
    component: NavTabBar
} as ComponentMeta<typeof NavTabBar>;

const Template: ComponentStory<typeof NavTabBar> = (args) => <Provider store={store}><BrowserRouter><div className="mt-38"><NavTabBar {...args} /></div></BrowserRouter></Provider>;

export const ShowFAB = Template.bind({});
ShowFAB.args = {
    showFAB: true
}

export const ShowFABTutorial = Template.bind({});
ShowFABTutorial.args = {
    showFAB: true,
    showTutorial: true
}

export const HideFAB = Template.bind({});
HideFAB.args = {
    showFAB: false
}