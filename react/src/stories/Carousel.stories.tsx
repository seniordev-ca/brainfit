import React from 'react';
import store from 'store/store';
import { Provider } from 'react-redux';
import { ComponentStory, ComponentMeta } from '@storybook/react';

import { Carousel } from '../Components/Carousel/Carousel';

export default {
  title: 'Atoms/Carousel',
  component: Carousel,
} as ComponentMeta<typeof Carousel>;

const Template: ComponentStory<typeof Carousel> = (args) => <Provider store={store}><Carousel {...args} /></Provider>;

export const DefaultCarousel = Template.bind({});
DefaultCarousel.args = {
  carouselItems: [
    (
      <div className="border-8 border-black p-20 text-center">
        <h3>tip 1</h3>
        <p>
          some other text
        </p>
      </div>
    ),
    (
      <div className="border-8 border-black p-20 text-center">
        <h3>tip 2</h3>
        <p>
          some other text
        </p>
      </div>
    )
  ]
};


export const CustomClass = Template.bind({});
CustomClass.args = {
  carouselClass: "w-1/4",
  carouselItems: [
    (
      <div className="border-8 border-black p-20 text-center">
        <h3>tip 1</h3>
        <p>
          some other text
        </p>
      </div>
    ),
    (
      <div className="border-8 border-black p-20 text-center">
        <h3>tip 2</h3>
        <p>
          some other text
        </p>
      </div>
    )
  ]
};


export const MoreHTML = Template.bind({});
MoreHTML.args = {
  carouselClass: "w-1/4",
  carouselItems: [
    
    (
      <div className='w-full h-screen bg-green-200 pt-10 pb-32 text-center'>
        <iframe className={["mx-auto h-2/3 w-full"].join(' ')} src="https://www.youtube.com/embed/ym1zJGAW3WE" title="YouTube video player" frameBorder={0} allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowFullScreen></iframe>
        Onboarding<br />
        Sample image<br />
        <img src="https://via.placeholder.com/150" className="mx-auto my-0" alt="..."/>
      </div>

    ),
    (
      <div className='w-full h-screen bg-blue-200 pt-10 pb-32 mx-auto'>
        <img src="https://picsum.photos/700/400" alt="..." />
        test
      </div>
    ),
  ]
};

export const WithImages = Template.bind({});
WithImages.args = {
  carouselItems: [
    (
      <div className='w-full h-screen bg-green-200 pt-10 pb-32 text-center'>
        <iframe className={["mx-auto h-2/3 w-full"].join(' ')} src="https://www.youtube.com/embed/ym1zJGAW3WE" title="YouTube video player" frameBorder={0} allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowFullScreen></iframe>
        Onboarding<br />
        Sample image<br />
        <img src="https://via.placeholder.com/150" className="mx-auto my-0" alt="..."/>
      </div>

    ),
    (
      <div className='w-full h-screen bg-blue-200 pt-10 pb-32 mx-auto'>
        <img src="https://picsum.photos/700/400" alt="..." />
        test
      </div>
    ),
  ]
};
