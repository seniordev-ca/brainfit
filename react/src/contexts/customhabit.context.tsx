import { Activity } from 'models/activity';
import { Habit, IHabit } from 'models/habit';
import moment from 'moment';
import { ColourPickerModal } from 'pages/Partials/ColourPickerModal';
import { CustomHabitModal } from 'pages/Partials/CustomHabitModal';
import { DatePickerBottomSheet } from 'pages/Partials/DatePickerBottomSheet';
import { DurationPickerBottomSheet } from 'pages/Partials/DurationPickerBottomSheet';
import { FrequencyPickerBottomSheet } from 'pages/Partials/FrequencyPickerBottomSheet';
import { HabitCollectionsModal } from 'pages/Partials/HabitCollectionsModal/HabitCollectionsModal';
import { HabitStatusPickerModal } from 'pages/Partials/HabitStatusPickerModal';
import { IconPickerModal } from 'pages/Partials/IconPickerModal';
import { NewHabitModal } from 'pages/Partials/NewHabitModal';
import { PillarSelectionModal } from 'pages/Partials/PillarSelectionModal/PillarSelectionModal';
import { TipsModal } from 'pages/Partials/TipsModal/TipsModal';
import { TypePickerModal } from 'pages/Partials/TypePickerModal';
import { UnitPickerModal } from 'pages/Partials/UnitPickerModal';
import { UpcomingModal } from 'pages/Partials/UpcomingModal/UpcomingModal';
import { ViewAllBottomSheet } from 'pages/Partials/ViewAllBottomSheet';
import { createContext, useCallback, useMemo, useState } from 'react';
import {
  DatabaseSavedHabit,
  HabitCollection,
  HabitPillar
} from '../types/types';

type InterfaceState = {
  customHabitOpen: boolean;
  colourPickerOpen: boolean;
  durationPickerOpen: boolean;
  startDatePickerOpen: boolean;
  endDatePickerOpen: boolean;
  iconPickerOpen: boolean;
  unitPickerOpen: boolean;
  typePickerOpen: boolean;
  statusPickerOpen: boolean;
  newHabitOpen: boolean;
  frequencyPickerOpen: boolean;
  pillarSelectionOpen: boolean;
  habitCollectionOpen: boolean;
  viewAllOpen: boolean;
  upcomingOpen: boolean;
  filterHabitsOpen: boolean;
  tipsOpen: boolean;
};

type InterfaceProps = {
  remindMePickerProps: Object;
};

type CustomHabitContextProps = {
  habit: Habit;
  pillar: HabitPillar | undefined;
  interfacesOpen: InterfaceState;
  collection: HabitCollection | undefined;

  tips: string;

  clearHabit: () => void;

  closeAllInterfaces: () => void;

  setCustomTips: (tips: string) => void;

  setCustomPillar: (pillar: HabitPillar | undefined) => void;

  setCustomHabit: (value: Habit) => void;
  setCustomHabitValue: (key: keyof Habit, value: any) => void;
  setCollection: (value: HabitCollection) => void;

  setInterfaceOpen: (key: keyof InterfaceState, value: boolean) => void;
};

export const EmptyHabit = Habit.create({
  id: '',
  title: 'New habit',
  pillars: [],
  cmsLink: '',

  startDate: moment().startOf('day').valueOf(),
  endDate: moment().set({ year: 2099 }).valueOf(),

  frequencyUnit: 'day',
  frequencyDays: [0, 1, 2, 3, 4, 5, 6],
  frequencyUnitQuantity: 1,

  frequencySpecificDay: -1,
  frequencySpecificDate: -1,

  units: 'Count',
  targetValue: 1,
  dailyDigest: false,
  reminders: [],
  icon: 'mdi:star',
  breakHabit: false,
  description: '',

  status: 'Active',
  colour: 'lightBlue',

  activities: [
    Activity.create({
      actDate: moment().startOf('day').valueOf(),
      breakHabit: false,
      cycle: 1,
      habitID: '',
      id: '',
      pillars: [],
      progress: 0,
      skipped: false,
      targetValue: 1,
      frequency: 'day',
      frequencyCount: 1
    })
  ]
});

const EmptyInterfaces: InterfaceState = {
  customHabitOpen: false,
  colourPickerOpen: false,
  durationPickerOpen: false,
  startDatePickerOpen: false,
  endDatePickerOpen: false,
  iconPickerOpen: false,
  unitPickerOpen: false,
  typePickerOpen: false,
  statusPickerOpen: false,
  newHabitOpen: false,
  frequencyPickerOpen: false,
  pillarSelectionOpen: false,
  viewAllOpen: false,
  upcomingOpen: false,
  habitCollectionOpen: false,
  filterHabitsOpen: false,
  tipsOpen: false
};

const InterfacePropsDefault: InterfaceProps = {
  remindMePickerProps: {}
};

export const BasicHabitContextProps: CustomHabitContextProps = {
  habit: EmptyHabit,
  pillar: undefined,
  interfacesOpen: EmptyInterfaces,
  collection: undefined,
  tips: '',

  closeAllInterfaces: () => { },
  clearHabit: () => { },
  setCustomTips: (value) => { },
  setCustomPillar: (value) => { },
  setCustomHabit: (value) => { },
  setCustomHabitValue: (key, value) => { },
  setInterfaceOpen: (key, value) => { },
  setCollection: (value) => { }
};

export const CustomHabitContext = createContext<CustomHabitContextProps>({
  habit: EmptyHabit,
  pillar: undefined,
  interfacesOpen: EmptyInterfaces,
  collection: undefined,
  tips: '',
  setCustomPillar: (value) => { },
  closeAllInterfaces: () => { },
  clearHabit: () => { },
  setCustomTips: (value) => { },
  setCustomHabit: (value) => { },
  setCustomHabitValue: (key, value) => { },
  setInterfaceOpen: (key, value) => { },
  setCollection: (value) => { }
});

export function CustomHabitContextProvider({
  children
}: {
  children: React.ReactNode;
}) {
  const [habit, setHabit] = useState<Habit>(EmptyHabit);

  const [collection, setCollection] = useState<HabitCollection>();
  const [pillar, setPillar] = useState<HabitPillar | undefined>('Exercise');
  const [tips, setTips] = useState('');

  const [openInterfaces, setOpenInterfaces] =
    useState<InterfaceState>(EmptyInterfaces);
  const [userHabits, setUserHabits] = useState<DatabaseSavedHabit[]>([]);

  const setCustomHabitValue = useCallback((key: keyof IHabit, value: any) => {
    setHabit((old) => Habit.create({ ...old, [`${key}`]: value }));
  }, []);

  const setCustomUserHabits = (value: DatabaseSavedHabit[]) => {
    setUserHabits(value);
  };

  const setCustomCollection = (value: HabitCollection) => {
    setCollection(() => value);
  };

  const setCustomHabit = (value: Habit) => {
    setHabit(() => value);
  };

  const setCustomPillar = (value: HabitPillar | undefined) => {
    setPillar(value);
  };
  const clearHabit = () => {
    setHabit(EmptyHabit);
  };

  const setInterfaceOpen = (where: keyof InterfaceState, value: boolean) => {
    setOpenInterfaces((old) => {
      return {
        ...old,
        [`${where}`]: value
      };
    });
  };

  const closeAllInterfaces = () => {
    setOpenInterfaces(EmptyInterfaces);
  };

  const contextValue = useMemo(() => {
    return {
      habit: habit,
      pillar: pillar,
      interfacesOpen: openInterfaces,
      userHabits: userHabits,
      interfaceProps: InterfacePropsDefault,
      collection: collection,
      tips: tips,

      setCustomTips: setTips,
      clearHabit: clearHabit,
      closeAllInterfaces: closeAllInterfaces,
      setCustomPillar: setCustomPillar,
      setCustomHabit: setCustomHabit,
      setInterfaceOpen: setInterfaceOpen,
      setCustomHabitValue: setCustomHabitValue,
      setUserHabits: setCustomUserHabits,
      setCollection: setCustomCollection
    };
  }, [
    habit,
    openInterfaces,
    pillar,
    setCustomHabitValue,
    userHabits,
    collection,
    tips
  ]);

  return (
    // @ts-ignore
    <CustomHabitContext.Provider value={contextValue}>
      {children}

      <ColourPickerModal
        open={openInterfaces.colourPickerOpen}
        setOpen={(open) => setInterfaceOpen('colourPickerOpen', open)}
      />
      <IconPickerModal
        open={openInterfaces.iconPickerOpen}
        setOpen={(open) => setInterfaceOpen('iconPickerOpen', open)}
      />
      <UnitPickerModal
        open={openInterfaces.unitPickerOpen}
        setOpen={(open) => setInterfaceOpen('unitPickerOpen', open)}
      />
      <TypePickerModal
        open={openInterfaces.typePickerOpen}
        setOpen={(open) => setInterfaceOpen('typePickerOpen', open)}
      />
      <HabitStatusPickerModal
        habit={habit}
        onStatusSelected={(status) => setCustomHabitValue('status', status)}
        open={openInterfaces.statusPickerOpen}
        setOpen={(open) => setInterfaceOpen('statusPickerOpen', open)}
      />
      <CustomHabitModal
        open={openInterfaces.customHabitOpen}
        setOpen={(open) => setInterfaceOpen('customHabitOpen', open)}
      />
      <DurationPickerBottomSheet
        open={openInterfaces.durationPickerOpen}
        setOpen={(open) => setInterfaceOpen('durationPickerOpen', open)}
      />
      <DatePickerBottomSheet
        id="startDate"
        label="Set start date"
        open={openInterfaces.startDatePickerOpen}
        setOpen={(open) => setInterfaceOpen('startDatePickerOpen', open)}
      />
      <DatePickerBottomSheet
        id="endDate"
        label="Set end date"
        open={openInterfaces.endDatePickerOpen}
        setOpen={(open) => setInterfaceOpen('endDatePickerOpen', open)}
      />
      <FrequencyPickerBottomSheet
        open={openInterfaces.frequencyPickerOpen}
        setOpen={(open) => setInterfaceOpen('frequencyPickerOpen', open)}
      />

      <PillarSelectionModal
        open={openInterfaces.pillarSelectionOpen}
        setOpen={(open: boolean) =>
          setInterfaceOpen('pillarSelectionOpen', open)
        }
      />
      <NewHabitModal
        open={openInterfaces.newHabitOpen}
        setOpen={(open: boolean) => {
          setInterfaceOpen('newHabitOpen', open);
        }}
      />
      <UpcomingModal
        open={openInterfaces.upcomingOpen}
        setOpen={(open: boolean) => {
          setInterfaceOpen('upcomingOpen', open);
        }}
      />
      <HabitCollectionsModal
        open={openInterfaces.habitCollectionOpen}
        setOpen={(open: boolean) => {
          setInterfaceOpen('habitCollectionOpen', open);
        }}
      />
      <ViewAllBottomSheet
        open={openInterfaces.viewAllOpen}
        setOpen={(open: boolean) => {
          setInterfaceOpen('viewAllOpen', open);
        }}
      />
      <TipsModal
        open={openInterfaces.tipsOpen}
        setOpen={(open: boolean) => {
          setInterfaceOpen('tipsOpen', open);
        }}
      />

      <span
        className={
          'hidden bg-mom_lightMode_icon-black bg-mom_lightMode_icon-pink bg-mom_lightMode_icon-purple bg-mom_lightMode_icon-red bg-mom_lightMode_icon-orange bg-mom_lightMode_icon-yellow bg-mom_lightMode_icon-teal bg-mom_lightMode_icon-green bg-mom_lightMode_icon-blue bg-mom_lightMode_icon-lightBlue bg-mom_lightMode_icon-brown bg-mom_lightMode_icon-grey bg-mom_lightMode_icon-default bg-mom_lightMode_icon-exercise bg-mom_lightMode_icon-nutrition bg-mom_lightMode_icon-stress bg-mom_lightMode_icon-sleep bg-mom_lightMode_icon-mental bg-mom_lightMode_icon-social '
        }
      />
    </CustomHabitContext.Provider>
  );
}
