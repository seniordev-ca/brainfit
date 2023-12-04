import { Capacitor } from '@capacitor/core';
import { Button } from 'Components/Button/Button';
import { Calendar } from 'Components/Calendar/Calendar';
import { CardHabit } from 'Components/CardHabit/CardHabit';
import { Typography } from 'Components/Typography/Typography';
import { CommonContext } from 'contexts/common.context';
import { EmptyHabit } from 'contexts/customhabit.context';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';

import { getAuth } from 'firebase/auth';
import NotificationHelper from 'helpers/notificationHelper';
import { useChallenges, useDates, useUserHabits } from 'helpers/stateHelper';
import { SyncHelper } from 'helpers/syncHelper';
import {
  displayStatusAndGoalString,
  getPillarFromPillars
} from 'helpers/utils';
import { ReactComponent as NotificationWithDotSVG } from 'img/notification-bell-dot.svg';
import { ReactComponent as NotificationSVG } from 'img/notification-bell.svg';
import { Activity } from 'models/activity';
import { Habit } from 'models/habit';
import moment from 'moment';
import { HabitCompletionBottomSheet } from 'pages/Partials/HabitCompletionBottomSheet';
import { HabitDetailsBottomSheet } from 'pages/Partials/HabitDetailsBottomSheet';
import { HabitStatusPickerModal } from 'pages/Partials/HabitStatusPickerModal';
import {
  ReactElement,
  useCallback,
  useContext,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState
} from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import { getData, setDataFieldWithID } from 'slices/dataSlice';
import { NotificationItem } from 'types/types';
import './Today.scss';

dayjs.extend(relativeTime);

/**
 * Today page
 *
 * @returns
 */
export const Today = (): ReactElement => {
  const platform = Capacitor.getPlatform();

  const dispatch = useDispatch();

  const { challenges } = useChallenges();
  const { habits: allHabits } = useUserHabits();

  let { dates: datesState, setDates } = useDates();

  const { data } = useSelector(getData);

  const { selectedHabit } = useParams();

  const { notifications } = data;

  const dates = useMemo(() => datesState, [datesState]);
  const [showRequestPushNotification, setShowRequestPushNotification] =
    useState(false);
  const [showCreateAccount, setShowCreateAccount] = useState(false);
  const [unreadNotifications, setUnreadNotifications] = useState(0);
  const auth = getAuth();

  const { setInterfaceOpen: setCommonInterfaceOpen } =
    useContext(CommonContext);

  const [habitProgressOpen, setHabitProgressOpen] = useState(false);
  const [habitDetailsOpen, setHabitDetailsOpen] = useState(false);
  const [selectedID, setSelectedID] = useState<string>('');
  const [firstLoading, setFirstLoading] = useState(false);
  const [tutorialHabit, setTutorialHabit] = useState<Habit>(EmptyHabit);
  const [statusModalOpen, setStatusModalOpen] = useState(false);

  const [selected, setSelected] = useState(EmptyHabit);
  const [habits, setHabits] = useState<Habit[]>([]);
  const [uiScrolled, setUiScrolled] = useState(false);

  // const [loading, setLoading] = useState(true);

  const dailyHabits = useMemo(() => {
    return (
      habits?.filter(
        (h) =>
          h.frequencyUnit === 'day' ||
          h.isShowingSpecificallyForDate(dates.selected.valueOf())
      ) || []
    );
  }, [habits, dates.selected]);

  const weeklyHabits = useMemo(() => {
    return habits?.filter((h) => h.frequencyUnit === 'week') || [];
  }, [habits]);

  const monthlyHabits = useMemo(() => {
    return (
      habits?.filter(
        (h) => h.frequencyUnit === 'month' && !dailyHabits?.includes(h)
      ) || []
    );
  }, [habits, dailyHabits]);

  const titleRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const pageWrapper = document.getElementsByClassName('pageWrapper')[0]
    if ((allHabits.length === 0 || !uiScrolled) && pageWrapper) {
      const safeAreaTop = getComputedStyle(
        document.documentElement
      ).getPropertyValue('--sat');
      pageWrapper.scrollTo(0, 105 + parseInt(safeAreaTop));
      if (habits.length > 0) {
        setUiScrolled(true);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [allHabits]);

  useEffect(() => {
    const checkPermissions = async () => {
      const permissions = await NotificationHelper.getNotificationPermissions();
      console.log('permissions', permissions);
      if (permissions === 'prompt' || permissions === 'denied') {
        setShowRequestPushNotification(true);
      } else {
        await NotificationHelper.addListeners();
      }
    };

    const checkAccount = () => {
      const user = auth.currentUser;
      if (user && !user.isAnonymous) {
        setShowCreateAccount(false);
      } else {
        setShowCreateAccount(true);
      }
    };

    if (platform !== 'web') {
      checkPermissions();
    }
    checkAccount();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (notifications && notifications.length > 0) {
      setUnreadNotifications(
        notifications?.filter(
          (notification: NotificationItem) => !notification.read
        ).length
      );
    } else {
      setUnreadNotifications(0);
    }
  }, [notifications]);

  useLayoutEffect(() => {
    if (allHabits) {
      setHabits(
        allHabits?.filter((h) => h.isScheduledFor(dates.selected.valueOf()))
      );
    }
  }, [allHabits, dates.selected]);

  const setTutorialDone = useCallback(() => {
    if (firstLoading) {
      setFirstLoading(false);
      dispatch(setDataFieldWithID({ id: 'tutorialDone', value: true }));
      dispatch(setDataFieldWithID({ id: 'tutorialHabitDone', value: true }));
    }
  }, [setFirstLoading, dispatch, firstLoading]);

  useEffect(() => {
    if (habits) {
      setSelected(() => habits.find((h) => h.id === selectedID) || EmptyHabit);
    }
  }, [selectedID, habits]);

  useEffect(() => {
    if (selectedHabit && habits?.find((h) => h.id === selectedHabit)) {
      setSelectedID(selectedHabit);
      setHabitProgressOpen(true);
    }
  }, [selectedHabit, habits])

  const habitOnClickIcon = useCallback(
    (habit: Habit) => {
      if (habit.status === 'Paused') {
        setSelectedID(habit.id);
        setStatusModalOpen(true);
      } else {
        const actb = habit.getActivityForDate(dates.selected.valueOf());

        let nextProgress = (actb?.progress || 0) + 1;

        if (habit.isTime) {
          // Add 30 seconds if it's time?
          nextProgress = (actb?.progress || 0) + 60;
        }

        // This will always be correct as the `activities array will always be populated to the current timeline.

        actb.progress = nextProgress;
        habit.putActivity(actb);
        SyncHelper.putHabit(habit, true);

        // SyncHelper.putActivity(actb);

        setTutorialDone();
      }
    },
    [dates.selected, setTutorialDone]
  );

  const habitOnClickCard = useCallback(
    (habit: Habit) => {
      const auth = getAuth();

      if (auth.currentUser !== null) {
        setSelectedID(habit.id);
        if (habit.status === 'Paused') {
          setStatusModalOpen(true);
        } else {
          setHabitProgressOpen(true);
        }
      }
      setTutorialDone();
    },
    [setSelectedID, setStatusModalOpen, setHabitProgressOpen, setTutorialDone]
  );

  const checkPausedOrSkipped = useCallback(
    (habit: Habit) => {
      const act = habit.getActivityForDate(dates.selected.valueOf());
      return habit.status === 'Paused' || act?.skipped;
    },
    [dates.selected]
  );

  const onCalendarUpdate = async (
    selectedDate: any,
    startDate: any,
    endDate: any
  ) => {
    setDates({
      ...dates,
      selected: selectedDate,
      start: startDate,
      end: endDate
    });
  };
  // const displayPillarString = (pillarString: string | undefined) => {
  //   let tempString: any = pillarString;
  //   if (tempString && tempString.includes(',')) {
  //     tempString = tempString.replace(/,/g, ' + ');
  //     tempString = tempString.slice(0, -3);
  //     return tempString;
  //   } else if (tempString) {
  //     return tempString;
  //   }
  //   return '';
  // };

  const overlimit = useCallback((item: Activity | Habit) => {
    return item.progress > item.targetValue;
  }, []);

  const getHeaderText = () => {
    const today = moment();
    const startOfCurrentWeek = today.clone().startOf('week');
    const endOfCurrentWeek = today.clone().endOf('week');
    let afterFromDate = moment(dates.selected).isSameOrAfter(
      startOfCurrentWeek
    );
    let beforeToDate = moment(dates.selected).isSameOrBefore(endOfCurrentWeek);

    if (dates.selected.format('YYYYMMDD') === today.format('YYYYMMDD')) {
      return 'Today';
    } else if (
      dates.selected.year() === today.year() &&
      dates.selected.month() === today.month() &&
      +dates.selected.day() === +today.day() - 1
    ) {
      return 'Yesterday';
    } else if (afterFromDate && beforeToDate) {
      return moment.weekdays()[dates.selected.weekday()];
    } else {
      return dates.selected.format('MMM D');
    }
  };

  useEffect(() => {
    if (habits?.length > 0 && data.storeLoaded && !data.tutorialDone) {
      setFirstLoading(true);
      setTutorialHabit(dailyHabits[0] || weeklyHabits[0] || monthlyHabits[0]);
    } else {
      setFirstLoading(false);
      setTutorialHabit(EmptyHabit);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data.storeLoaded, data.tutorialDone, habits]);

  const getCardClassName = (unit: string, index: number) => {
    return firstLoading && (tutorialHabit.frequencyUnit !== unit || index > 0)
      ? 'blur pointer-events-none'
      : firstLoading
        ? 'relative z-10'
        : '';
  };

  const getHeaderClassName = (unit: string) => {
    return firstLoading && tutorialHabit.frequencyUnit !== unit
      ? 'blur'
      : 'relative z-10';
  };

  const getTypographyText = (unit: string) => {
    if (firstLoading && tutorialHabit.frequencyUnit === unit) {
      return `This ${unit}`;
    } else {
      if (unit === 'week') {
        return 'Weekly Goals';
      }
      return 'Monthly Goals';
    }
  };

  function statusModalClose(open: boolean) {
    if (!open && selected.id) {
      SyncHelper.putHabit(selected);
    }
    setStatusModalOpen(open);
  }

  return (
    // <div id="today" className="text-left">
    <div id="today" className="text-left h-full">
      <Calendar
        initialRangeType="week"
        dayClass={platform === 'ios' ? 'w-12 h-12' : ''}
        hideNavigation={true}
        onCalendarUpdate={onCalendarUpdate}
        // calendarData={calendarData}
        // {...(platform === 'web') ? { bodyClass: 'mom-calendar-body' } : null}
        bodyClass={`mom-calendar-body`}
        onActionsClick={() => {
          setCommonInterfaceOpen('calendarOpen', true);
        }}
      />
      <HabitCompletionBottomSheet
        open={habitProgressOpen}
        setOpen={setHabitProgressOpen}
        habitSelected={selected}
        selectedDate={dates.selected}
        setHabitDetailsOpen={setHabitDetailsOpen}
      />

      <HabitDetailsBottomSheet
        open={habitDetailsOpen}
        setOpen={setHabitDetailsOpen}
        habitSelected={selected}
      />

      <HabitStatusPickerModal
        habit={selected}
        open={statusModalOpen}
        setOpen={statusModalClose}
        onStatusSelected={(s) => (selected.status = s)}
      />

      {((firstLoading && dailyHabits.length > 0) || !firstLoading) && (
        <div ref={titleRef} id="todayHeader" className="mb-8 grid grid-cols-2">
          <Typography usage="headingLarge">{getHeaderText()}</Typography>
          <div className={'flex justify-end items-center'}>
            <Button
              id="notificationButton"
              onClick={() => {
                setTutorialDone();
                setCommonInterfaceOpen('notificationsOpen', true);
              }}
              Icon={
                (data.signupClicked || !showCreateAccount) &&
                  (data.enableNotificationClicked ||
                    !showRequestPushNotification) &&
                  unreadNotifications === 0
                  ? // && data.dailyDigestClicked
                  NotificationSVG
                  : NotificationWithDotSVG
              }
              buttonClass={['!w-9 !h-9 float-right']}
              buttonType="btn-tertiary"
              iconOnly
            />
          </div>
        </div>
      )}
      {habits && habits.length > 0 ? (
        <div>
          {dailyHabits.map((item: Habit, i: number) => {
            // return (
            //   <IC
            //     habits={habits}
            //     id={item.id}
            //     selDate={dates.selected.valueOf()}
            //   />
            // );
            const challenge =
              challenges &&
              challenges.find((x: any) => x.id === item.challengeID);

            const act = item.getActivityForDate(dates.selected.valueOf());
            const prog = act?.completion || 0;
            const skipped = act?.skipped;

            return (
              <div
                key={`daily-goal-${i + 1}`}
                className={`mb-4 ${getCardClassName('day', i)}`}
              >
                {/* <Prog progress={prog + _.random(-10, 10)} /> */}

                <CardHabit
                  habitName={item.title}
                  habitPillar={getPillarFromPillars(item.pillars)}
                  habitStatus={displayStatusAndGoalString(
                    item,
                    item.getActivityForDate(dates.selected.valueOf())
                      ?.progress || 0,
                    skipped
                  )}
                  habitColour={item.colour}
                  habitIcon={item.icon}
                  habitProgress={prog}
                  onClickIcon={() => habitOnClickIcon(item)}
                  onClickCard={() => habitOnClickCard(item)}
                  challenge={challenge ? challenge.title : ''}
                  cardScreen={checkPausedOrSkipped(item)}
                  overlimit={item.breakHabit && overlimit(act || item)}
                  multiplePillars={item.pillars.length > 1}
                  showTutorial={
                    i < 1 &&
                    firstLoading &&
                    tutorialHabit.frequencyUnit === 'day'
                  }
                />
              </div>
            );
          })}
          {weeklyHabits.length > 0 && (
            <Typography
              usage={
                tutorialHabit.frequencyUnit === 'week'
                  ? 'headingLarge'
                  : 'headingMedium'
              }
              typeClass={[
                // mt:16 from the last daily + 8 from here
                ` mt-6 mb-4 font-bold ${getHeaderClassName('week')}`
              ]}
            >
              {getTypographyText('week')}
            </Typography>
          )}
          {weeklyHabits.map((item: Habit, i: number) => {
            const challenge =
              challenges &&
              challenges.find((x: any) => x.id === item.challengeID);
            const act = item.getActivityForDate(dates.selected.valueOf());
            const prog = act?.completion || 0;
            const skipped = act?.skipped;

            return (
              <div
                key={`weekly-goal-${i + 1}`}
                className={`mb-4 ${getCardClassName('week', i)}`}
              >
                <CardHabit
                  habitName={item.title}
                  habitPillar={getPillarFromPillars(item.pillars)}
                  habitStatus={displayStatusAndGoalString(
                    item,
                    item.getActivityForDate(dates.selected.valueOf())
                      ?.progress || 0,
                    skipped
                  )}
                  habitColour={item.colour}
                  habitIcon={item.icon}
                  habitProgress={prog}
                  onClickIcon={() => habitOnClickIcon(item)}
                  onClickCard={() => habitOnClickCard(item)}
                  challenge={challenge ? challenge.title : ''}
                  cardScreen={checkPausedOrSkipped(item)}
                  overlimit={item.breakHabit && overlimit(act || item)}
                  multiplePillars={item.pillars.length > 1}
                  showTutorial={
                    i < 1 &&
                    firstLoading &&
                    tutorialHabit.frequencyUnit === 'week'
                  }
                />
              </div>
            );
          })}

          {monthlyHabits.length > 0 && (
            <Typography
              usage={
                tutorialHabit.frequencyUnit === 'month'
                  ? 'headingLarge'
                  : 'headingMedium'
              }
              typeClass={[`mt-6 mb-4 font-bold ${getHeaderClassName('month')}`]}
            >
              {getTypographyText('month')}
            </Typography>
          )}
          {monthlyHabits.map((item: Habit, i: number) => {
            const act = item.getActivityForDate(dates.selected.valueOf());
            const prog = act?.completion;
            const skipped = act?.skipped;
            const challenge =
              challenges &&
              challenges.find((x: any) => x.id === item.challengeID);
            return (
              <div
                key={`monthly-goal-${i + 1}`}
                className={`mb-4 ${getCardClassName('month', i)}`}
              >
                <CardHabit
                  habitName={item.title}
                  habitPillar={getPillarFromPillars(item.pillars)}
                  habitStatus={displayStatusAndGoalString(
                    item,
                    item.getActivityForDate(dates.selected.valueOf())
                      ?.progress || 0,
                    skipped
                  )}
                  habitColour={item.colour}
                  habitIcon={item.icon}
                  habitProgress={prog}
                  onClickIcon={() => habitOnClickIcon(item)}
                  onClickCard={() => habitOnClickCard(item)}
                  challenge={challenge ? challenge.title : ''}
                  cardScreen={checkPausedOrSkipped(item)}
                  overlimit={item.breakHabit && overlimit(act || item)}
                  multiplePillars={item.pillars.length > 1}
                  showTutorial={
                    i < 1 &&
                    firstLoading &&
                    tutorialHabit.frequencyUnit === 'month'
                  }
                />
              </div>
            );
          })}
        </div>
      ) : (
        <></>
      )}

      {habits && !habits.length ? (
        <div>
          <div className="col text-right"></div>

          <div className="text-center mt-20">
            <Typography usage="headingMedium" content="No habits scheduled" />
          </div>
        </div>
      ) : (
        <></>
      )}
    </div>
  );
};
