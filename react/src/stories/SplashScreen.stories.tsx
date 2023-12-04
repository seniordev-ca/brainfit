import React from 'react';
import store from 'store/store';
import { Provider } from 'react-redux';
import { ComponentStory, ComponentMeta } from '@storybook/react';

import { SplashScreen } from '../Components/SplashScreen/SplashScreen';

export default {
  title: 'Atoms/SplashScreen',
  component: SplashScreen,
} as ComponentMeta<typeof SplashScreen>;

const Template: ComponentStory<typeof SplashScreen> = (args) => <Provider store={store}><SplashScreen {...args} /></Provider>;

export const DefaultSplashScreen = Template.bind({});
DefaultSplashScreen.args = {
  centerContent: (
    <>
      Place logo here
    </>
  ),
  topContent: (
    <>
      header content
    </>
  ),
  bottomContent: (
    <>
      footer content
    </>
  )
}
