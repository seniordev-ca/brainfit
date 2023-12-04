import { BottomNav } from 'Components/BottomNav/BottomNav';
import { PageWrapper } from 'Components/PageWrapper/PageWrapper';
import storageHelper from 'helpers/storageHelper';
import { About } from 'pages/About/About';
import { AccountAndData } from 'pages/AccountAndData/AccountAndData';
import { Activity } from 'pages/Activity/Activity';
import { Awards } from 'pages/Awards/Awards';
import { ChangeEmail } from 'pages/ChangeEmail/ChangeEmail';
import { CustomHabit } from 'pages/CustomHabit/CustomHabit';
import { DeleteAccount } from 'pages/DeleteAccount/DeleteAccount';
import { Explainer } from 'pages/Explainer/Explainer';
import { FollowUs } from 'pages/FollowUs/FollowUs';
import { Login } from 'pages/Login/Login';
import { Onboarding } from 'pages/Onboarding/Onboarding';
import { Reauthenticate } from 'pages/ReAuthenticate/ReAuthenticate';
import { ResetData } from 'pages/ResetData/ResetData';
import { ResetPassword } from 'pages/ResetPassword/ResetPassword';
import { ResetPasswordContinue } from 'pages/ResetPasswordContinue/ResetPasswordContinue';
import { SamplePage } from 'pages/SamplePage/SamplePage';
import { Settings } from 'pages/Settings/Settings';
import { SignUp } from 'pages/SignUp/SignUp';
import { SixPillars } from 'pages/SixPillars/SixPillars';
import { StartQuestionnaire } from 'pages/StartQuestionnaire/StartQuestionnaire';
import { Today } from 'pages/Today/Today';
import { Tracking } from 'pages/Tracking/Tracking';
import { TrackingIdeas } from 'pages/TrackingIdeas/TrackingIdeas';
import { TrackingPillar } from 'pages/TrackingPillar/TrackingPillar';
import { useContext, useEffect, useLayoutEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { Navigate, Outlet, Route, Routes, useLocation } from 'react-router-dom';
import { TransitionGroup } from 'react-transition-group';
import { getData } from './slices/dataSlice';

import { SyncHelper } from 'helpers/syncHelper';
import { neverEndingDate } from 'helpers/utils';
import { Activity as ActivityModel } from 'models/activity';
import { Habit } from 'models/habit';
import moment from 'moment';
import { CustomHabitContext } from 'contexts/customhabit.context';
import { CommonContext } from 'contexts/common.context';
import { SignUpContext } from 'contexts/signup.context';

const isDev =
  typeof process !== 'undefined'
    ? process?.env?.NODE_ENV !== 'production'
    : true;

const ListRoutes = () => {
  const location = useLocation();

  // Renders before useEffect
  useLayoutEffect(() => {
    window.scrollTo(0, 0);
  }, [location.key]);

  const [modal, setModal] = useState(false)
  const { interfacesOpen } = useContext(CustomHabitContext);
  const commonInterfacesOpen = useContext(CommonContext).interfacesOpen;
  const signupInterfacesOpen = useContext(SignUpContext).interfacesOpen;

  function displayAsModal() {
    return (
      interfacesOpen.newHabitOpen ||
      interfacesOpen.upcomingOpen ||
      signupInterfacesOpen.termsScreenOpen ||
      commonInterfacesOpen.articleOpen ||
      commonInterfacesOpen.pillarDescriptionOpen ||
      commonInterfacesOpen.notificationsOpen ||
      commonInterfacesOpen.calendarOpen ||
      commonInterfacesOpen.satisfactionBottomSheetOpen ||
      commonInterfacesOpen.habitDetailsOpen
    )
  }

  useEffect(() => {
    setModal(displayAsModal())
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [interfacesOpen, signupInterfacesOpen, commonInterfacesOpen])

  // Dev tools hacks because....yeah

  useEffect(() => {
    if (isDev) {
      const win = window as any;

      const startOfWeek = moment().startOf('week');
      const twoWeeksAgo = moment().startOf('week').subtract(2, 'week');
      // const thisMonth = moment().startOf('month');

      win.streaksNoWeekly = () => {
        const toAdd: Habit[] = [];
        const streakDaily = Habit.create({
          id: 'setmeup-streaks-nobreak',
          title: 'setmeup-streaks-nobreak',
          activities: [],
          breakHabit: false,
          colour: 'Exercise',
          dailyDigest: false,
          description: 'Added for testing purposes',
          startDate: startOfWeek.valueOf(),

          endDate: neverEndingDate,
          frequencyDays: [0, 1, 2, 3, 4, 5, 6],
          frequencyUnit: 'day',
          frequencyUnitQuantity: 1,
          pillars: ['Exercise'],
          cmsLink: '',

          frequencySpecificDay: -1,
          frequencySpecificDate: -1,

          units: 'Count',
          targetValue: 10,
          reminders: [],
          icon: 'mdi:star',
          status: 'Active'
        });
        const daysSinceStartOfWeek = moment().day() + 1;
        console.log('satis', daysSinceStartOfWeek);

        for (let i = 0; i < daysSinceStartOfWeek; i += 1) {
          streakDaily.putActivity(
            ActivityModel.create({
              actDate: moment(streakDaily.startDate)
                .add(i, streakDaily.frequencyUnit)
                .valueOf(),
              breakHabit: streakDaily.breakHabit,
              cycle: i + 1,
              habitID: streakDaily.id,
              id: '',
              frequency: streakDaily.frequencyUnit,
              frequencyCount: streakDaily.frequencyUnitQuantity,
              pillars: streakDaily.pillars,
              progress: 10,
              targetValue: 10
            })
          );
        }

        toAdd.push(streakDaily);
        SyncHelper.putManyHabits(toAdd, true);
      };
      win.streaksWeekly = () => {
        const toAdd: Habit[] = [];
        const streakWeekly = Habit.create({
          id: 'setmeup-weekly-streaks-nobreak',
          title: 'setmeup-weekly-streaks-nobreak',
          activities: [],
          breakHabit: false,
          colour: 'Exercise',
          dailyDigest: false,
          description: 'Added for testing purposes',
          startDate: twoWeeksAgo.valueOf(),

          endDate: neverEndingDate,
          frequencyDays: [0, 1, 2, 3, 4, 5, 6],
          frequencyUnit: 'week',
          frequencyUnitQuantity: 1,
          pillars: ['Exercise'],
          cmsLink: '',

          frequencySpecificDay: -1,
          frequencySpecificDate: -1,

          units: 'Count',
          targetValue: 10,
          reminders: [],
          icon: 'mdi:star',
          status: 'Active'
        });

        for (let i = 0; i < 3; i += 1) {
          streakWeekly.putActivity(
            ActivityModel.create({
              actDate: moment(streakWeekly.startDate)
                .add(i, streakWeekly.frequencyUnit)
                .valueOf(),
              breakHabit: streakWeekly.breakHabit,
              cycle: i + 1,
              habitID: streakWeekly.id,
              id: '',
              frequency: streakWeekly.frequencyUnit,
              frequencyCount: streakWeekly.frequencyUnitQuantity,
              pillars: streakWeekly.pillars,
              progress: 10,
              targetValue: 10
            })
          );
        }

        toAdd.push(streakWeekly);
        SyncHelper.putManyHabits(toAdd, true);
      };
    }
  }, []);

  return (
    <TransitionGroup>
      {/* <CSSTransition key={location.key} classNames="slide" timeout={400}> */}
      <Routes location={location}>
        <Route path="/" element={<Outlet />}>
          {/* Public routes */}
          <Route index element={<CheckOnboarded modal={modal} />} />
          <Route path="selected/:selectedHabit" element={<CheckOnboarded modal={modal} />} />
          <Route
            path="sample"
            element={
              <WithNav modal={modal}>
                <SamplePage />
              </WithNav>
            }
          />
          <Route
            path="signup"
            element={
              <PageWrapper modal={modal} keyboardPadding>
                <SignUp />
              </PageWrapper>
            }
          />
          <Route
            path="pillars"
            element={
              <WithNav modal={modal}>
                <SixPillars />
              </WithNav>
            }
          />
          <Route
            path="pillars/explain/:pillar"
            element={
              <WithNav modal={modal}>
                <Explainer />
              </WithNav>
            }
          />
          <Route
            path="pillars/habits/:pillar"
            element={<WithNav modal={modal}>Future content</WithNav>}
          />
          <Route
            path="onboarding"
            element={
              <PageWrapper modal={modal} sidesOnly>
                <Onboarding />
              </PageWrapper>
            }
          />
          <Route
            path="questionnaire"
            element={
              <PageWrapper modal={modal}>
                <StartQuestionnaire />
              </PageWrapper>
            }
          />

          <Route
            path="settings"
            element={
              <WithNav modal={modal}>
                <Settings />
              </WithNav>
            }
          />
          <Route
            path="tracking"
            element={
              <WithNav modal={modal}>
                <Tracking />
              </WithNav>
            }
          />
          <Route
            path="trackingPillar"
            element={
              <WithNav modal={modal}>
                <TrackingPillar />
              </WithNav>
            }
          />
          <Route
            path="login"
            element={
              <PageWrapper modal={modal} keyboardPadding>
                <Login />
              </PageWrapper>
            }
          />
          <Route
            path="trackingIdeas"
            element={
              <WithNav modal={modal}>
                <TrackingIdeas />
              </WithNav>
            }
          />
          <Route
            path="activity"
            element={
              <WithNav modal={modal}>
                <Activity />
              </WithNav>
            }
          />
          <Route
            path="customHabit"
            element={
              <WithNav modal={modal}>
                <CustomHabit />
              </WithNav>
            }
          />
          <Route
            path="award"
            element={
              <WithNav modal={modal}>
                <Awards />
              </WithNav>
            }
          />
          <Route
            path="about"
            element={
              <WithNav modal={modal}>
                <About />
              </WithNav>
            }
          />
          <Route
            path="followUs"
            element={
              <WithNav modal={modal}>
                <FollowUs />
              </WithNav>
            }
          />
          <Route
            path="account"
            element={
              <WithNav modal={modal}>
                <AccountAndData />
              </WithNav>
            }
          />
          <Route
            path="resetData"
            element={
              <WithNav modal={modal}>
                <ResetData />
              </WithNav>
            }
          />
          <Route
            path="deleteAccount"
            element={
              <PageWrapper>
                <DeleteAccount />
              </PageWrapper>
            }
          />
          <Route
            path="reset"
            element={
              <PageWrapper>
                <ResetPassword />
              </PageWrapper>
            }
          />
          <Route
            path="resetContinue"
            element={
              <PageWrapper>
                <ResetPasswordContinue />
              </PageWrapper>
            }
          />
          <Route
            path="reauth"
            element={
              <PageWrapper>
                <Reauthenticate />
              </PageWrapper>
            }
          />
          <Route
            path="changeEmail"
            element={
              <WithNav modal={modal}>
                <PageWrapper>
                  <ChangeEmail />
                </PageWrapper>
              </WithNav>
            }
          />

          {/* Authorized paths */}
          <Route element={<AuthWrapper />}>
            {/* Sample route */}
            {/* <Route path="/admin" element={<App />} /> */}
          </Route>

          {/*
          Redirecting changed in react-router v6
          Background: https://gist.github.com/mjackson/b5748add2795ce7448a366ae8f8ae3bb
        */}
          <Route path="*" element={<Navigate replace to="/404" />} />
        </Route>
      </Routes>
      {/* </CSSTransition> */}
    </TransitionGroup>
  );
};

const WithNav = (props: any) => {
  return (
    <div id="foo">
      <div>
        <PageWrapper modal={props.modal}>{props.children}</PageWrapper>
      </div>
      <div className="w-full sticky bottom-0 bg-white z-20">
        <BottomNav />
      </div>
    </div>
  );
};

const CheckOnboarded = ({ modal = false }) => {
  const { data } = useSelector(getData);

  if (data.storeLoaded && !data.onboardingDone) {
    return (
      <PageWrapper modal={modal}>
        <Onboarding />
      </PageWrapper>
    );
  }

  return (
    <WithNav modal={modal}>
      <Today />
    </WithNav>
  );
};

/**
 * Routes to pages that need authentication
 *
 * @param param0
 * @returns
 */
const AuthWrapper = () => {
  const location = useLocation();
  const [token, setToken] = useState();
  useEffect(() => {
    const getData = async () => {
      const token = await storageHelper.get('token');
      setToken(token);
    };
    getData();
  }, []);

  return token ? (
    <Outlet />
  ) : (
    <Navigate to="/login" replace state={{ from: location }} />
  );
};

export default ListRoutes;
