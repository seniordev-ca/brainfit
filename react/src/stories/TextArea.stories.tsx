import React from 'react';
import store from 'store/store';
import { Provider } from 'react-redux';

import { ComponentStory, ComponentMeta } from '@storybook/react';

import { ListItem } from '../Components/ListItem/ListItem'
import { TextArea } from 'Components/TextArea/TextArea';

export default {
    title: 'Atoms/Input',
    component: ListItem
} as ComponentMeta<typeof ListItem>;

const Template: ComponentStory<typeof ListItem> = (args) => <Provider store={store}><ListItem {...args} /></Provider>;

export const Textarea = Template.bind({})
Textarea.args = {
    listType: 'list-primary',
    label: <TextArea id='textarea' placeholder="Textarea Placeholder" rows={4} />
}