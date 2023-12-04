import React from 'react';
import store from 'store/store';
import { Provider } from 'react-redux';
import { ComponentStory, ComponentMeta } from '@storybook/react';

import { Progress } from '../Components/Progress/Progress';

export default {
    title: 'Archive/Atoms/Progress',
    component: Progress,
} as ComponentMeta<typeof Progress>;

const Template: ComponentStory<typeof Progress> = (args) => <Provider store={store}><Progress {...args} /></Provider>;

export const Incomplete = Template.bind({});
Incomplete.args = {
    header: 'Step 1',
    desc: 'Description of Step 1',
    stateClass: 'progress_incomplete',
}

export const Active = Template.bind({});
Active.args = {
    header: 'Step 1',
    desc: 'Description of Step 1',
    stateClass: 'progress_active',
}

export const Complete = Template.bind({});
Complete.args = {
    header: 'Step 1',
    desc: 'Description of Step 1',
    stateClass: 'progress_complete',
}

export const SubItem = Template.bind({});
SubItem.args = {
    header: 'Step 2a',
    desc: 'Description of Step 2a',
    stateClass: 'progress_incomplete',
    primary: false,
}