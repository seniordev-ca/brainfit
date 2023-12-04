import React from 'react';
import store from 'store/store';
import { Provider } from 'react-redux';
import { ComponentStory, ComponentMeta } from '@storybook/react';

import { Article } from '../Components/Article/Article';

export default {
  title: 'Atoms/Article',
  component: Article,
} as ComponentMeta<typeof Article>;

const Template: ComponentStory<typeof Article> = (args) => <Provider store={store}><Article {...args} /></Provider>;

export const DefaultArticle = Template.bind({});
DefaultArticle.args = {
  headerImageSrc: 'https://picsum.photos/1200/400',
  title: 'Title of article',
  byline: 'written by: John Doe or other optional text below the title',
  category: 'optional category',
  content: 'Sample article body content'
};

export const ArticleNoImage = Template.bind({});
ArticleNoImage.args = {
  content: 'test content property'
}

export const CustomContent = Template.bind({});
CustomContent.args = {
  children: (
    <>
      <h3>Hello world</h3>
      <p>This contains custom children content</p>
    </>
  )
}

export const CustomContentWithHeaderImage = Template.bind({});
CustomContentWithHeaderImage.args = {
  headerImageSrc: 'https://picsum.photos/1300/400',
  children: (
    <>
      <h3>Hello</h3>
      <p>This contains custom children content</p>
    </>
  )
}