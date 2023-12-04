import React from 'react';
import store from 'store/store';
import { Provider } from 'react-redux';
import { ComponentStory, ComponentMeta } from '@storybook/react';
import { NewsFeed } from '../Components/NewsFeed/NewsFeed';
export default {
  title: 'Molecules/NewsFeed',
  component: NewsFeed
} as ComponentMeta<typeof NewsFeed>;
const Template: ComponentStory<typeof NewsFeed> = (args) => (
  <Provider store={store}>
    <NewsFeed {...args} />
  </Provider>
);
export const DefaultNewsFeed = Template.bind({});
DefaultNewsFeed.args = {
  newsFeedItems: [
    {
      articleTitle: 'Title',
      articlePillar: 'Exercise',
      articleImg: 'https://picsum.photos/700/400'
    },
    {
      articleTitle: 'Title 2',
      articlePillar: 'Nutrition',
      articleImg: 'https://picsum.photos/700/400'
    },
    {
      articleTitle: 'Title 3',
      articlePillar: 'Mental Stimulation',
      articleImg: 'https://picsum.photos/800/400'
    }
  ]
};
