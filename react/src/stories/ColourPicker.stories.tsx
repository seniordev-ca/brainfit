import React from 'react';
import { ComponentStory, ComponentMeta } from '@storybook/react';
import { ColourPicker } from '../Components/ColourPicker/ColourPicker';


export default {
  title: 'Molecules/ColourPicker',
  component: ColourPicker,
} as ComponentMeta<typeof ColourPicker>;

const Template: ComponentStory<typeof ColourPicker> = (args) => <ColourPicker {...args} />;

export const ColourPickerSheet = Template.bind({});
ColourPickerSheet.args = {
  selectedColour: "red"
}