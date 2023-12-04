import React from 'react';
import { ComponentStory, ComponentMeta } from '@storybook/react';

import { Footer } from '../Components/Footer/Footer';

export default {
    title: 'Archive/Organisms/Footer',
    component: Footer
} as ComponentMeta<typeof Footer>;

const Template: ComponentStory<typeof Footer> = (args) => <Footer />;

export const FooterTemplate = Template.bind({});