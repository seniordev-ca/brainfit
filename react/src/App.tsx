// CSS
import './App.scss';

import { Capacitor } from '@capacitor/core';
import { TextZoom } from '@capacitor/text-zoom';
import { CommonContextProvider } from 'contexts/common.context';
import { CustomHabitContextProvider } from 'contexts/customhabit.context';
import { SignUpContextProvider } from 'contexts/signup.context';
import networkHelper from 'helpers/web/networkHelper';
import { AppUrlListener } from 'pages';
import { useSelector } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';
import { getData } from 'slices/dataSlice';
import Routes from './Routes';
import { useEffect, useState } from 'react';

import { StateHelperContextProvider } from 'contexts/stateHelper.context';
import { SWRConfig, SWRConfiguration } from 'swr';

import 'react-circular-progressbar/dist/styles.css';

const swrConfig: SWRConfiguration = {
  // Don't automatically refresh every X times
  refreshInterval: 0,
  // Don't automatically refresh on mount if it's stale
  revalidateIfStale: false,
  // Don't auotmatically revalidate on focus. Delete this when offline support is completed
  revalidateOnFocus: false,

  // Don't make the same request twice in 5 seconds
  dedupingInterval: 5000
};

const App = function () {
  let themeBasedOnSystem =
    window.matchMedia('(prefers-color-scheme: dark)') || 'light';

  const platform = Capacitor.getPlatform();
  const { data } = useSelector(getData);
  const [theme, setTheme] = useState(
    themeBasedOnSystem.matches ? 'dark' : 'light'
  );

  useEffect(() => {
    window
      .matchMedia('(prefers-color-scheme: dark)')
      ?.addEventListener('change', (event) => {
        const colorScheme = event.matches ? 'dark' : 'light';
        setTheme(colorScheme);
      });
  }, []);

  useEffect(() => {
    if (
      data.appearanceOption === 'dark' ||
      (data.appearanceOption === 'system' && theme === 'dark')
    ) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [theme, data.appearanceOption]);

  // For mobile, set font zoom based on device preference
  if (platform !== 'web') {
    TextZoom.getPreferred().then((result: any) => {
      TextZoom.set(result);
    });
  }

  startBackgroundProcesses(data);

  // if (data.storeLoaded) {
  return (
    <BrowserRouter>
      <AppUrlListener></AppUrlListener>
      <div className="App relative">
        <SWRConfig value={swrConfig}>
          <StateHelperContextProvider>
            <CustomHabitContextProvider>
              <SignUpContextProvider>
                <CommonContextProvider>
                  <Routes />
                </CommonContextProvider>
              </SignUpContextProvider>
            </CustomHabitContextProvider>
          </StateHelperContextProvider>
        </SWRConfig>
      </div>
    </BrowserRouter>
  );
  // } else {
  //   return (
  //     <SplashScreen
  //       splashScreenStyle={platform === 'web' ? { width: '33.3%' } : {}}
  //       centerStyle={{
  //         width: '62%'
  //       }}
  //       centerContent={
  //         <img src={mindOverMatterLogo} alt="mind over matter logo" />
  //       }
  //       bottomContent={
  //         <>
  //           <img src={wbhiLogo} alt="WBHI logo" style={{ width: '38%' }} />
  //           <img src={phacLogo} alt="PHAC logo" style={{ width: '62%' }} />
  //         </>
  //       }
  //     />
  //   );
  // }
};

const startBackgroundProcesses = (data: any) => {
  const getFitbitData = async () => {
    const token = data['fbToken'] || '';
    const refresh = data['fbRefreshToken'] || '';
    const userID = data['fbUserID'] || '';

    if (token && refresh && userID) {
      let result = await networkHelper.getFBUserProfile(token, refresh, userID);

      networkHelper.saveFBData(result.user);
    }
  };

  getFitbitData();

  // repeat every 5 mins
  setInterval(getFitbitData, 5 * 60 * 1000);
};

export default App;
