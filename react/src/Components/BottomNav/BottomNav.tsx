import './BottomNav.scss'

import React from 'react';
import { useSelector } from 'react-redux';
import { getData } from 'slices/dataSlice';
import { NavTabBar } from 'Components/NavTabBar/NavTabBar';
import { useLocation } from 'react-router-dom';

export const BottomNav = function () {
  const location = useLocation();
  const { data } = useSelector(getData);
  return (
    <div id="bottomNav" className='pt-3 pb-4'>
      <NavTabBar 
        showFAB={location.pathname === '/'} 
        showTutorial={!data.tutorialDone}
      />
    </div>
  );
};
