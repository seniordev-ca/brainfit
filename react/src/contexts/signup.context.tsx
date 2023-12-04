import { Terms } from 'Components/Terms/Terms';
import { Appearance } from 'Components/Appearance/Appearance'
import { ChangeNameBottomSheet } from 'pages/Partials/ChangeNameBottomSheet';
import { createContext, useState } from 'react';

type InterfaceState = {
  termsScreenOpen: boolean;
  appearanceScreenOpen: boolean;
  changeNameBottomSheetOpen: boolean;
};

type SignUpContextProps = {
  interfacesOpen: InterfaceState;
  appearanceOption: string

  closeAllInterfaces: () => void;

  setInterfaceOpen: (key: keyof InterfaceState, value: boolean) => void;
  setAppearanceOption: (key: string) => void;
};

const EmptyInterfaces: InterfaceState = {
  termsScreenOpen: false,
  appearanceScreenOpen: false,
  changeNameBottomSheetOpen: false,
};

export const BasicTermsContextProps: SignUpContextProps = {
  interfacesOpen: EmptyInterfaces,
  appearanceOption: 'System',
  closeAllInterfaces: () => {},
  setInterfaceOpen: (key, value) => {},
  setAppearanceOption: (key) => {}
};

export const SignUpContext = createContext<SignUpContextProps>({
  interfacesOpen: EmptyInterfaces,
  appearanceOption: 'System',
  closeAllInterfaces: () => {},
  setInterfaceOpen: (key, value) => {},
  setAppearanceOption: (key) => {}
});

export function SignUpContextProvider({
  children
}: {
  children: React.ReactNode;
}) {
  const [openInterfaces, setOpenInterfaces] =
    useState<InterfaceState>(EmptyInterfaces);

  const [optionAppearance, setOptionAppearance] =
    useState<string>('System');

  const setInterfaceOpen = (where: keyof InterfaceState, value: boolean) => {
    setOpenInterfaces((old) => {
      return {
        ...old,
        [`${where}`]: value
      };
    });
  };

  const setAppearanceOption = (key: string) => {
    setOptionAppearance(() => key)
  }

  const closeAllInterfaces = () => {
    setOpenInterfaces(EmptyInterfaces);
  };

  return (
    <SignUpContext.Provider
      value={{
        interfacesOpen: openInterfaces,
        appearanceOption: optionAppearance,
        closeAllInterfaces: closeAllInterfaces,
        setInterfaceOpen: setInterfaceOpen,
        setAppearanceOption: setAppearanceOption
      }}
    >
      {children}

      <Terms
        open={openInterfaces.termsScreenOpen}
        setOpen={(open) => setInterfaceOpen('termsScreenOpen', open)}
      />

      <Appearance 
        open={openInterfaces.appearanceScreenOpen}
        setOpen={(open) => setInterfaceOpen('appearanceScreenOpen', open)}
      />

      <ChangeNameBottomSheet
        open={openInterfaces.changeNameBottomSheetOpen}
        setOpen={(open) => setInterfaceOpen('changeNameBottomSheetOpen', open)} />
    </SignUpContext.Provider>
  );
}
