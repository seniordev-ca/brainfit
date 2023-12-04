import React from 'react';
import { ComponentStory, ComponentMeta } from '@storybook/react';

import { NavTabItem } from '../Components/NavTabItem/NavTabItem';
import { ReactComponent as todayOff } from '../img/Nav/today_off.svg';
import { ReactComponent as progressOff } from '../img/Nav/progress_off.svg';
import { ReactComponent as exploreOff } from '../img/Nav/explore_off.svg';
import { ReactComponent as settingsOff } from '../img/Nav/settings_off.svg';
import { ReactComponent as todayOn } from '../img/Nav/today_on.svg';
import { ReactComponent as progressOn } from '../img/Nav/progress_on.svg';
import { ReactComponent as exploreOn } from '../img/Nav/explore_on.svg';
import { ReactComponent as settingsOn } from '../img/Nav/settings_on.svg';

export default {
    title: 'Atoms/NavTabItem',
    component: NavTabItem,
  } as ComponentMeta<typeof NavTabItem>;

  const Template: ComponentStory<typeof NavTabItem> = (args) => <NavTabItem {...args} />;

export const Home = Template.bind({});
Home.args = {
  IconActive: todayOn,
  IconInactive: todayOff,
  label: 'Home',
};

export const Progress = Template.bind({});
Progress.args = {
  IconActive: progressOn,
  IconInactive: progressOff,
  label: 'Progress',
};

export const Explore = Template.bind({});
Explore.args = {
  IconActive: exploreOn,
  IconInactive: exploreOff,
  label: 'Explore',
};

export const Settings = Template.bind({});
Settings.args = {
  IconActive: settingsOn,
  IconInactive: settingsOff,
  label: 'Settings',
};