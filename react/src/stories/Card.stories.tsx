import React from 'react';
import { ComponentStory, ComponentMeta } from '@storybook/react';
import background from '../img/sampleRaster.jpg';

import { Card } from '../Components/Card/Card';

export default {
    title: 'Atoms/Card',
    component: Card
} as ComponentMeta<typeof Card>;

const Template: ComponentStory<typeof Card> = (args) => <Card {...args} />;

export const ActionableWithImage = Template.bind({});
ActionableWithImage.args = {
    cardType: "card-actionable",
    imgSrc: background,
    imgCaption: "May 12"
}

export const Actionable = Template.bind({});
Actionable.args = {
    cardType: "card-actionable",
}

export const NotActionable = Template.bind({});
NotActionable.args = {
    cardType: "card-notactionable",
}