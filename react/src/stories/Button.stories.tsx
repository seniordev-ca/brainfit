import React from 'react';
import { ComponentStory, ComponentMeta } from '@storybook/react';

import { Button } from '../Components/Button/Button';
import { ReactComponent as PlusSVG } from '../img/icon_plus.svg';
import { ReactComponent as PillarSleep } from '../img/Pillars/icon_pillar_sleep.svg';
import { ReactComponent as ChevronNext } from '../img/icon_chevronNext.svg';
import { ReactComponent as ChevronPrev } from '../img/icon_chevronPrev.svg';

export default {
  title: 'Atoms/Button',
  component: Button,
} as ComponentMeta<typeof Button>;

const Template: ComponentStory<typeof Button> = (args) => <Button {...args} />;

export const Primary = Template.bind({});
Primary.args = {
  buttonType: "btn-primary",
  label: 'Primary Button',
};

export const PrimaryDisabled = Template.bind({});
PrimaryDisabled.args = {
  buttonType: "btn-primary",
  label: 'Primary Button',
  disabledState: true
};

export const PrimaryLoading = Template.bind({});
PrimaryLoading.args = {
  buttonType: "btn-primary",
  label: 'Primary Button',
  disabledState: true,
  loading: true
};

export const Secondary = Template.bind({});
Secondary.args = {
  buttonType: "btn-secondary",
  label: 'Secondary Button',
};

export const SecondaryDisabled = Template.bind({});
SecondaryDisabled.args = {
  buttonType: "btn-secondary",
  label: 'Secondary Button',
  disabledState: true
};

export const SecondaryLoading = Template.bind({});
SecondaryLoading.args = {
  buttonType: "btn-secondary",
  label: 'Secondary Button',
  disabledState: true,
  loading: true
};

export const Tertiary = Template.bind({});
Tertiary.args = {
  buttonType: "btn-tertiary",
  label: 'Transparent Button',
};

export const TertiaryDisabled = Template.bind({});
TertiaryDisabled.args = {
  buttonType: "btn-tertiary",
  label: 'Transparent Button',
  disabledState: true
};

export const TertiaryLoading = Template.bind({});
TertiaryLoading.args = {
  buttonType: "btn-tertiary",
  label: 'Transparent Button',
  disabledState: true,
  loading: true
};

export const IconPrimaryMediumNext = Template.bind({});
IconPrimaryMediumNext.args = {
  buttonType: "btn-primary",
  ariaLabel: "Add new habit",
  Icon: PlusSVG,
  iconOnly: true,
  iconButtonSize: "medium"
};

export const IconSecondaryMedium = Template.bind({});
IconSecondaryMedium.args = {
  buttonType: "btn-secondary",
  Icon: PlusSVG,
  iconOnly: true,
  iconButtonSize: "medium"
};

export const IconTertiaryMedium = Template.bind({});
IconTertiaryMedium.args = {
  buttonType: "btn-tertiary",
  Icon: PlusSVG,
  iconOnly: true,
  iconButtonSize: "medium"
};

export const IconNextLarge = Template.bind({});
IconNextLarge.args = {
  buttonType: "btn-primary",
  ariaLabel: "Add new habit",
  Icon: ChevronNext,
  iconOnly: true,
  iconButtonSize: "large"
};

export const IconPrevLarge = Template.bind({});
IconPrevLarge.args = {
  buttonType: "btn-primaryInvert",
  ariaLabel: "Add new habit",
  Icon: ChevronPrev,
  iconOnly: true,
  iconButtonSize: "large"
};

export const ToggleOff = Template.bind({});
ToggleOff.args = {
  buttonType: "btn-secondary",
  buttonFormat: "toggle",
  toggleState: false,
  Icon: PillarSleep,
  label: "Text"
}

export const ToggleOn = Template.bind({});
ToggleOn.args = {
  buttonType: "btn-secondary",
  buttonFormat: "toggle",
  toggleState: true,
  Icon: PillarSleep,
  label: "lorem ipsum dolor sit amet lorem ipsum"
}