import { CustomHabitContext } from "contexts/customhabit.context";
import { ReactElement, useContext } from "react";
import { BottomSheet } from "react-spring-bottom-sheet";
import { DialogProps } from "types/types";
import parse from 'html-react-parser';
import { PageWrapper } from "Components/PageWrapper/PageWrapper";
import { BottomSheetHeader } from "Components/BottomSheetHeader/BottomSheetHeader";



export const TipsModal = ({ open, setOpen }: DialogProps): ReactElement => {
  const { tips } = useContext(CustomHabitContext);


  const Header = (): ReactElement => {
    return (
      <BottomSheetHeader title='Tips' leftSideActionLabel='Close' leftSideActionOnClick={() => setOpen(false)} />
    );
  };


  return (
    <BottomSheet header={Header()} open={open}
      defaultSnap={({ maxHeight }) => maxHeight * 0.94}
      snapPoints={({ maxHeight }) => [
        maxHeight * 0.94
      ]} >
      <PageWrapper sidesOnly>
        <div className="text-mom_lightMode_text-neutral dark:text-mom_darkMode_text-neutral">
          {parse(tips)}
        </div>
      </PageWrapper>
    </BottomSheet>
  );
}