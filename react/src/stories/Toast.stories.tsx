import React from 'react';
import { ComponentStory, ComponentMeta } from '@storybook/react';

import { Toast } from '../Components/Toast/Toast';

export default {
    title: 'Molecules/Toast',
    component: Toast,
} as ComponentMeta<typeof Toast>;

const Template: ComponentStory<typeof Toast> = (args) => <Toast {...args} />;

export const Success = Template.bind({});
Success.args = {
    type: "success",
    content: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Cras id justo neque. Fusce et tempus quam."
}

export const Error = Template.bind({});
Error.args = {
    type: "error",
    content: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Cras id justo neque. Fusce et tempus quam."
}