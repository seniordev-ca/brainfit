import React from 'react';
import store from 'store/store';
import { Provider } from 'react-redux';

import { ComponentStory, ComponentMeta } from '@storybook/react';

import { Input } from '../Components/Input/Input';
import { ListItem } from '../Components/ListItem/ListItem'
import { ReactComponent as InputUserSVG } from '../img/icon_inputUser.svg';
import { ReactComponent as InputEmailSVG } from '../img/icon_inputEmail.svg';
import { ReactComponent as InputPasswordSVG } from '../img/icon_inputPassword.svg';

export default {
    title: 'Atoms/Input',
    component: ListItem,
} as ComponentMeta<typeof ListItem>;

const Template: ComponentStory<typeof ListItem> = (args) => <Provider store={store}><ListItem {...args} /></Provider>;

export const TextInput = Template.bind({})
TextInput.args = {
    listType: 'list-primary',
    label: <Input id='input' placeholder='Placeholder Text' type='text' />,
}

export const UserNameInput = Template.bind({})
UserNameInput.args = {
    listType: 'list-primary',
    prefix: <InputUserSVG />,
    label: <Input id='input' placeholder='Full Name' type='text' />,
}

export const PasswordInput = Template.bind({})
PasswordInput.args = {
    listType: 'list-primary',
    prefix: <InputPasswordSVG />,
    label: <Input id='input' placeholder='Password' type='password' />,
}

export const EmailInput = Template.bind({})
EmailInput.args = {
    listType: 'list-primary',
    prefix: <InputEmailSVG />,
    label: <Input id='input' placeholder='Email' type='email' />,
}