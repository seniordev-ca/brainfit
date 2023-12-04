import { CalendarBottomSheet } from 'pages/Partials/CalendarBottomSheet';
import { NotificationBottomSheet } from 'pages/Partials/NotificationsBottomSheet';
import { PillarDescriptionBottomSheet } from 'pages/Partials/PillarDescriptionBottomSheet';
import { createContext, useState } from 'react';
import { SatisfactionBottomSheet } from 'pages/Partials/SatisfactionBottomSheet';
import { HabitDetailsBottomSheet } from 'pages/Partials/HabitDetailsBottomSheet';
import { Habit } from 'models/habit';

type InterfaceState = {
  notificationsOpen: boolean;
  pillarDescriptionOpen: boolean;
  calendarOpen: boolean;
  satisfactionBottomSheetOpen: boolean;
  habitDetailsOpen: boolean;
  articleOpen: boolean;
};

export interface CommonContextProps {
  interfacesOpen: InterfaceState;
  selectedHabit?: Habit;
  closeAllInterfaces: () => void;
  setSelectedHabit: (habit?: Habit) => void;
  setInterfaceOpen: (key: keyof InterfaceState, value: boolean) => void;

  openInterfaceAndSelectHabit: (
    key: keyof InterfaceState,
    habit?: Habit
  ) => void;
}

const EmptyInterfaces: InterfaceState = {
  notificationsOpen: false,
  pillarDescriptionOpen: false,
  calendarOpen: false,
  satisfactionBottomSheetOpen: false,
  habitDetailsOpen: false,
  articleOpen: false
};

export const CommonContext = createContext<CommonContextProps>(
  {} as CommonContextProps
);

export function CommonContextProvider({
  children
}: {
  children: React.ReactNode;
}) {
  const [openInterfaces, setOpenInterfaces] =
    useState<InterfaceState>(EmptyInterfaces);

  const [selectedHabit, setSelectedHabit] = useState<Habit | undefined>(
    undefined
  );

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

  const openAndSelect = (where: keyof InterfaceState, habit?: Habit) => {
    setInterfaceOpen(where, true);
    setSelectedHabit(habit);
  };

  return (
    <CommonContext.Provider
      value={{
        interfacesOpen: openInterfaces,

        closeAllInterfaces: closeAllInterfaces,
        setSelectedHabit: setSelectedHabit,

        openInterfaceAndSelectHabit: openAndSelect,

        setInterfaceOpen: setInterfaceOpen
      }}
    >
      {children}

      <PillarDescriptionBottomSheet
        open={openInterfaces.pillarDescriptionOpen}
        setOpen={(open) => setInterfaceOpen('pillarDescriptionOpen', open)}
      />
      <NotificationBottomSheet
        open={openInterfaces.notificationsOpen}
        setOpen={(open) => setInterfaceOpen('notificationsOpen', open)}
      />
      <CalendarBottomSheet
        open={openInterfaces.calendarOpen}
        setOpen={(open) => setInterfaceOpen('calendarOpen', open)}
      />
      <SatisfactionBottomSheet
        open={openInterfaces.satisfactionBottomSheetOpen}
        setOpen={(open) =>
          setInterfaceOpen('satisfactionBottomSheetOpen', open)
        }
      />
      {selectedHabit ? (
        <HabitDetailsBottomSheet
          open={openInterfaces.habitDetailsOpen}
          setOpen={(open) => setInterfaceOpen('habitDetailsOpen', open)}
          habitSelected={selectedHabit}
        />
      ) : (
        <></>
      )}
    </CommonContext.Provider>
  );
}
