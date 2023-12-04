import React from 'react';
import { ComponentStory, ComponentMeta } from '@storybook/react';
import background from '../img/sampleRaster.jpg';

import { CardArticle } from '../Components/CardArticle/CardArticle';

export default {
    title: 'Organisms/Cards/Article',
    component: CardArticle
} as ComponentMeta<typeof CardArticle>;

const Template: ComponentStory<typeof CardArticle> = (args) => <CardArticle {...args} />;

export const ArticleCard = Template.bind({});
ArticleCard.args = {
    articleTitle: "Article Title",
    articlePillar: "Exercise",
    articleHabits: "Includes 2 habits",
    articleDate: "May 12",
    articleImg: background
}