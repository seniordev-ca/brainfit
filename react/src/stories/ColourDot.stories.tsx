import React from 'react';
import { ComponentStory, ComponentMeta } from '@storybook/react';

import { ColourDot } from 'Components/ColourDot/ColourDot';

export default {
    title: 'Atoms/ColourDot',
    component: ColourDot
} as ComponentMeta<typeof ColourDot>;

const Template: ComponentStory<typeof ColourDot> = (args) => <ColourDot {...args} />;

export const Default = Template.bind({});
Default.args = {
    dotColour: 'black'
}

export const Selected = Template.bind({});
Selected.args = {
    dotColour: 'lightBlue',
    selected: true
}