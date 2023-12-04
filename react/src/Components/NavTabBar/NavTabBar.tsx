import { useContext } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getData, setDataFieldWithID } from 'slices/dataSlice';
import './NavTabBar.scss';

import { Button } from 'Components/Button/Button';
import { Typography } from 'Components/Typography/Typography';
import { CustomHabitContext } from 'contexts/customhabit.context';
import localization from 'helpers/localizationHelper';
import { useDates, useUserHabits } from 'helpers/stateHelper';
import { useLocation, useNavigate } from 'react-router-dom';
import { ReactComponent as PlusSVG } from '../../img/icon_plus.svg';
import { ReactComponent as exploreOff } from '../../img/Nav/explore_off.svg';
import { ReactComponent as exploreOn } from '../../img/Nav/explore_on.svg';
import { ReactComponent as progressOff } from '../../img/Nav/progress_off.svg';
import { ReactComponent as progressOn } from '../../img/Nav/progress_on.svg';
import { ReactComponent as settingsOff } from '../../img/Nav/settings_off.svg';
import { ReactComponent as settingsOn } from '../../img/Nav/settings_on.svg';
import { ReactComponent as todayOff } from '../../img/Nav/today_off.svg';
import { ReactComponent as todayOn } from '../../img/Nav/today_on.svg';
import { ReactComponent as Tut3Arrow } from '../../img/tut3Arrow.svg';
import { NavTabItem } from '../NavTabItem/NavTabItem';

interface NavTabBarProps {
  showFAB?: boolean;
  showTutorial?: boolean;
}

export const NavTabBar = function ({
  showFAB,
  showTutorial,
  ...props
}: NavTabBarProps) {
  const navigate = useNavigate();
  const location = useLocation();
  const { setInterfaceOpen } = useContext(CustomHabitContext);
  const { data } = useSelector(getData);
  const dispatch = useDispatch();
  const { habits } = useUserHabits();
  const { setToToday } = useDates();

  const setTutorialDone = () => {
    if (habits.length > 0 && !data.tutorialHabitDone) {
      dispatch(setDataFieldWithID({ id: 'tutorialHabitDone', value: true }));
    }
    if (!data.tutorialDone) {
      dispatch(setDataFieldWithID({ id: 'tutorialDone', value: true }));
    }
  };
  let padNavLeft = '';
  let padNavRight = '';

  if (showFAB) {
    padNavLeft = 'mr-4';
    padNavRight = 'ml-4';
  }
  // console.log(showFAB);
  // console.log(padNavLeft);
  // console.log(padNavRight);

  return (
    <div
      className={[
        'navTabBar_tutorialOverlay',
        showTutorial ? 'active' : ''
      ].join(' ')}
    >
      <div className="navContainer tut3">
        {/* FAB tutorial */}
        <div className="tut3Content flex flex-col">
          <Typography usage="headingSmall" typeClass={['text-center']}>
            {habits?.length > 0 ? 'Add more habits' : 'Add your first habit'}
          </Typography>
          <Tut3Arrow className="m-auto" />
        </div>

        <div className="relative flex flex-row max-w-4xl m-auto p-2">
          <div className="flex-1">
            <NavTabItem
              IconActive={todayOn}
              IconInactive={todayOff}
              label={localization.getString('homeStringNav')}
              iconState={location.pathname === '/'}
              {...(location.pathname !== '/'
                ? {
                    onClick: () => {
                      setTutorialDone();
                      navigate('/');
                    }
                  }
                : {
                    // MIND-702
                    onClick: () => setToToday()
                  })}
            />
          </div>
          <div className={['flex-1', padNavLeft].join(' ')}>
            <NavTabItem
              IconActive={progressOn}
              IconInactive={progressOff}
              label={localization.getString('progressNav')}
              iconState={location.pathname === '/tracking'}
              {...(location.pathname !== '/tracking'
                ? {
                    onClick: () => {
                      setTutorialDone();
                      navigate('/tracking');
                    }
                  }
                : {})}
            />
          </div>
          {showFAB && (
            <div className="relative">
              <div className="absolute left-1/2 -translate-x-1/2 -top-12">
                <Button
                  onClick={() => {
                    setTutorialDone();
                    setInterfaceOpen('newHabitOpen', true);
                  }}
                  data-testid="nav-add-habit"
                  buttonType="btn-primary"
                  iconButtonSize="large"
                  Icon={PlusSVG}
                  iconOnly
                />
              </div>
            </div>
          )}
          <div className={['flex-1', padNavRight].join(' ')}>
            <NavTabItem
              IconActive={exploreOn}
              IconInactive={exploreOff}
              label={localization.getString('pillarsNav')}
              iconState={location.pathname === '/pillars'}
              {...(location.pathname !== '/pillars'
                ? {
                    onClick: () => {
                      setTutorialDone();
                      navigate('/pillars');
                    }
                  }
                : {})}
            />
          </div>
          <div className="flex-1">
            <NavTabItem
              IconActive={settingsOn}
              IconInactive={settingsOff}
              label={localization.getString('settingsNav')}
              iconState={
                location.pathname === '/settings' ||
                location.pathname === '/account' ||
                location.pathname === '/about' ||
                location.pathname === '/followUs' ||
                location.pathname === '/changeEmail' ||
                location.pathname === '/reset' ||
                location.pathname === '/deleteAccount' ||
                location.pathname === '/resetData'
              }
              {...(location.pathname !== '/settings'
                ? {
                    onClick: () => {
                      setTutorialDone();
                      navigate('/settings');
                    }
                  }
                : {})}
            />
          </div>
        </div>
      </div>
    </div>
  );
};
