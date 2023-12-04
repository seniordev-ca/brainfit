import React from 'react';
import store from 'store/store';
import { Provider } from 'react-redux';
import { ComponentStory, ComponentMeta } from '@storybook/react';

import { ProgressBar } from '../Components/Progress/ProgressBar';

export default {
    title: 'Archive/Molecules/ProgressBar',
    component: ProgressBar
} as ComponentMeta<typeof ProgressBar>;

const Template: ComponentStory<typeof ProgressBar> = (args) => <Provider store={store}><ProgressBar /></Provider>;

export const ProgressBars = Template.bind({});
ProgressBars.parameters = {
    backgrounds: { default: 'Black'}
}