import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { App, URLOpenListenerEvent } from '@capacitor/app';

const AppUrlListener: React.FC<any> = () => {
  let navigate = useNavigate();
  useEffect(() => {
    App.addListener('appUrlOpen', (event: URLOpenListenerEvent) => {
      const slug = event.url.split('mindovermatterapp.org').pop();
      if (slug) {
        navigate(slug);
      }
    });
  }, [navigate]);

  return null;
};

export default AppUrlListener;