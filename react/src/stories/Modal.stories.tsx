import React from 'react';
import store from 'store/store';
import { Provider } from 'react-redux';
import { ComponentStory, ComponentMeta } from '@storybook/react';

import { Modal } from '../Components/Modal/Modal';

export default {
  title: 'Archive/Molecules/Modal',
  component: Modal,
} as ComponentMeta<typeof Modal>;

const Template: ComponentStory<typeof Modal> = (args) => <Provider store={store}><Modal {...args} /></Provider>;

export const DefaultModal = Template.bind({});
DefaultModal.args = {
  showModal: true,
  showFooter: true,
  children: <>sample body</>
};