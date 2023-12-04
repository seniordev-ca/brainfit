import React from 'react';
import store from 'store/store';
import { Provider } from 'react-redux';
import { ComponentStory, ComponentMeta } from '@storybook/react';

import { BottomSheetHeader } from '../Components/BottomSheetHeader/BottomSheetHeader';

export default {
  title: 'Molecules/BottomSheetHeader',
  component: BottomSheetHeader,
} as ComponentMeta<typeof BottomSheetHeader>;

const Template: ComponentStory<typeof BottomSheetHeader> = (args) => {
  return <Provider store={store}><div><div className='h-20'><BottomSheetHeader {...args} /></div></div></Provider>
};

export const Default = Template.bind({});
Default.args = { title: "Test title", leftSideActionLabel: 'Back', rightSideActionLabel: 'Share' };