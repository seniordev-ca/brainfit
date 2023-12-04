import React from 'react';
import store from 'store/store';
import { Provider } from 'react-redux';
import { ComponentStory, ComponentMeta } from '@storybook/react';

import { Wizard } from '../Components/Wizard/Wizard';

export default {
    title: 'Archive/Organisms/Wizard',
    component: Wizard
} as ComponentMeta<typeof Wizard>;

const Template: ComponentStory<typeof Wizard> = (args) => <Provider store={store}><Wizard /></Provider>;

export const WizardTemplate = Template.bind({});