import React from 'react';
import { ComponentStory, ComponentMeta } from '@storybook/react';

import { KeyValue } from '../Components/KeyValuePair/Keyvaluepair';

export default {
    title: 'Archive/Atoms/KeyValuePair',
    component: KeyValue,
} as ComponentMeta<typeof KeyValue>;

const Template: ComponentStory<typeof KeyValue> = (args) => <KeyValue {...args} />;

export const Default = Template.bind({});
Default.args = {
    kvpKey: 'Policy Holder',
    kvpValue: 'John Smith',
}