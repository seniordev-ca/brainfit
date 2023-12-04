import React from 'react';
import { ComponentStory, ComponentMeta } from '@storybook/react';
import reactLogo from '../img/react.svg';
import ImageAnchorMD from './Anchor.md';

import { Anchor } from '../Components/Anchor/Anchor';

export default {
    title: 'Atoms/Anchors',
    component: Anchor,
} as ComponentMeta<typeof Anchor>;

const Template: ComponentStory<typeof Anchor> = (args) => <Anchor {...args} />;

export const BodyAnchor = Template.bind({});
BodyAnchor.args = {
    label: 'Body Anchor',
    id: 'bodyAnchorID',
    target: '_self',
    href: '#',
    anchorClass: ['body_anchor'],
}

/**
 * Sample Anchor with footer_anchor class
 */
export const FooterAnchor = Template.bind({});
FooterAnchor.args = {
    label: 'Footer Anchor',
    id: 'footerAnchorID',
    target: '_self',
    href: '#',
    anchorClass: ['footer_anchor'],
}
FooterAnchor.parameters = {
    backgrounds: { default: 'Black' }
}

export const ImageAnchor = Template.bind({});
ImageAnchor.args = {
    id: 'imageAnchorID',
    target: '_self',
    href: '#',
    src: reactLogo,
}
ImageAnchor.parameters = {
    docs: {
        description: {
            story: ImageAnchorMD
        }
    }
}