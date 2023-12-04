import React from 'react';
import store from 'store/store';
import { Provider } from 'react-redux';

import { ComponentStory, ComponentMeta } from '@storybook/react';

import { InputStyled } from '../Components/InputStyled/InputStyled';
import inputUserSVG from '../img/icon_inputUser.svg';
import inputEmailSVG from '../img/icon_inputEmail.svg';
import inputPasswordSVG from '../img/icon_inputPassword.svg';

export default {
    title: 'Archive/Atoms/Input',
    component: InputStyled,
} as ComponentMeta<typeof InputStyled>;

const Template: ComponentStory<typeof InputStyled> = (args) => <Provider store={store}><InputStyled {...args} /></Provider>;

export const TextInput = Template.bind({});
TextInput.args = {
    type: 'text',
    id: 'textInputID',
    required: false,
    placeholder: 'Placeholder text',
};

export const UserNameInput = Template.bind({});
UserNameInput.args = {
    Icon: inputUserSVG,
    type: 'text',
    id: 'textInputID',
    required: false,
    placeholder: 'Full Name',
};

export const PasswordInput = Template.bind({});
PasswordInput.args = {
    Icon: inputPasswordSVG,
    type: 'password',
    id: 'passwordInputID',
    required: false,
    placeholder: 'Password',
};

export const EmailInput = Template.bind({});
EmailInput.args = {
    Icon: inputEmailSVG,
    type: 'email',
    id: 'emailInputID',
    required: false,
    placeholder: 'Email',
};