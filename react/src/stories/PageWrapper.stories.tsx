import React from 'react';
import { ComponentStory, ComponentMeta } from '@storybook/react';
import { Typography } from 'Components/Typography/Typography';

import { PageWrapper } from "../Components/PageWrapper/PageWrapper";

export default {
    title: 'Templates/PageWrapper',
    component: PageWrapper,
    parameters: {
        layout: 'fullscreen',
    }
} as ComponentMeta<typeof PageWrapper>;

const Template: ComponentStory<typeof PageWrapper> = (args) => <PageWrapper {...args} />;

export const Primary = Template.bind({});
Primary.args = {

}

export const Modal = Template.bind({});
Modal.args = {
    modal: true,
    children: [
        <Typography usage='headingMedium' content='Page Title' />,
        <Typography usage='body' content='Lorem ipsum dolor sit amet, consectetur adipiscing elit. In tempor scelerisque libero, hendrerit ullamcorper metus luctus quis. Donec a mattis quam, sit amet ultrices augue. Praesent et commodo ligula. In placerat felis eu eros convallis malesuada. Morbi venenatis dolor in elit consectetur interdum. In ultrices risus hendrerit, mattis purus blandit, hendrerit est. Mauris libero lorem, tristique at felis tincidunt, feugiat bibendum velit. Lorem ipsum dolor sit amet, consectetur adipiscing elit. In tempor scelerisque libero, hendrerit ullamcorper metus luctus quis. Donec a mattis quam, sit amet ultrices augue. Praesent et commodo ligula. In placerat felis eu eros convallis malesuada. Morbi venenatis dolor in elit consectetur interdum. In ultrices risus hendrerit, mattis purus blandit, hendrerit est. Mauris libero lorem, tristique at felis tincidunt, feugiat bibendum velit. Lorem ipsum dolor sit amet, consectetur adipiscing elit. In tempor scelerisque libero, hendrerit ullamcorper metus luctus quis. Donec a mattis quam, sit amet ultrices augue. Praesent et commodo ligula. In placerat felis eu eros convallis malesuada. Morbi venenatis dolor in elit consectetur interdum. In ultrices risus hendrerit, mattis purus blandit, hendrerit est. Mauris libero lorem, tristique at felis tincidunt, feugiat bibendum velit. Lorem ipsum dolor sit amet, consectetur adipiscing elit. In tempor scelerisque libero, hendrerit ullamcorper metus luctus quis. Donec a mattis quam, sit amet ultrices augue. Praesent et commodo ligula. In placerat felis eu eros convallis malesuada. Morbi venenatis dolor in elit consectetur interdum. In ultrices risus hendrerit, mattis purus blandit, hendrerit est. Mauris libero lorem, tristique at felis tincidunt, feugiat bibendum velit. Lorem ipsum dolor sit amet, consectetur adipiscing elit. In tempor scelerisque libero, hendrerit ullamcorper metus luctus quis. Donec a mattis quam, sit amet ultrices augue. Praesent et commodo ligula. In placerat felis eu eros convallis malesuada. Morbi venenatis dolor in elit consectetur interdum. In ultrices risus hendrerit, mattis purus blandit, hendrerit est. Mauris libero lorem, tristique at felis tincidunt, feugiat bibendum velit.' />
    ]
}