import React from 'react';
import { ComponentStory, ComponentMeta } from '@storybook/react';
import store from 'store/store';
import { Provider } from 'react-redux';
import { SpiderGraph } from "../Components/SpiderGraph/SpiderGraph";

export default {
    title: 'Atoms/SpiderGraph',
    component: SpiderGraph,
} as ComponentMeta<typeof SpiderGraph>;

const Template: ComponentStory<typeof SpiderGraph> = (args) => <Provider store={store}><SpiderGraph {...args} /></Provider>;

export const Primary = Template.bind({});
Primary.args = {
    results: { 'exercise': 0 }
}