import { useEffect, useState, useContext } from 'react';
import moment from 'moment';
import { BottomSheet } from 'react-spring-bottom-sheet';
import { getAuth } from 'firebase/auth';
import { useSelector } from 'react-redux';
import { getData } from 'slices/dataSlice';
import { DialogProps } from 'types/types';
import { useSatisfactions } from 'helpers/stateHelper';
import NetworkHelper from 'helpers/web/networkHelper';
import { isToday } from 'helpers/utils';
import { CommonContext } from 'contexts/common.context';

import { PageWrapper } from 'Components/PageWrapper/PageWrapper';
import { SelfAssessment } from 'Components/SelfAssessment/SelfAssessment';
import { Typography } from 'Components/Typography/Typography';
import { BottomSheetHeader } from 'Components/BottomSheetHeader/BottomSheetHeader';

export const SatisfactionBottomSheet = ({ open, setOpen }: DialogProps) => {
  const { data } = useSelector(getData);
  const answers = data.questionnaireAnswers || [];
  const [levels, setLevels] = useState<{}>({
    exercise: answers[1]?.['exercise'] ?? 3,
    nutrition: answers[1]?.['nutrition'] ?? 3,
    'stress-management': answers[1]?.['stress-management'] ?? 3,
    social: answers[1]?.['social'] ?? 3,
    sleep: answers[1]?.['sleep'] ?? 3,
    'mental-stimulation': answers[1]?.['mental-stimulation'] ?? 3
  });
  const [lastUpdatedAt, setLastUpdatedAt] = useState('');
  const { satisfactions, mutate } = useSatisfactions();
  const { setInterfaceOpen } = useContext(CommonContext);

  useEffect(() => {
    if (satisfactions) {
      const lastLevels = { ...satisfactions[0] };
      if (lastLevels.satisfactions) {
        setLevels(lastLevels.satisfactions);
        setLastUpdatedAt(
          isToday(lastLevels?.createdAt)
            ? 'Today'
            : moment(lastLevels?.createdAt).format('MMM Do')
        );
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [satisfactions]);

  const close = () => {
    setInterfaceOpen('satisfactionBottomSheetOpen', false);
  };

  const onSave = async () => {
    const auth = getAuth();

    if (auth.currentUser !== null) {
      const res = await NetworkHelper.addSatisfactions(levels);
      if (res) {
        await mutate();
      }

      close();
    }
  };
  return (
    <BottomSheet
      id="satisfactionBottomSheet"
      className="z-50 pb-10 h-screen"
      open={open}
      defaultSnap={({ maxHeight }) => maxHeight * 0.94}
      snapPoints={({ maxHeight }) => [maxHeight * 0.94]}
      header={
        <BottomSheetHeader
          title="Update levels"
          leftSideActionLabel="Back"
          leftSideActionOnClick={() => setOpen(false)}
          rightSideActionLabel="Save"
          rightSideActionOnClick={onSave}
        />
      }
    >
      <PageWrapper>
        <div id="satisfactionContent" className="w-full block">
          <Typography usage="headingMedium" typeClass={['mt-4 mb-2 text-left']}>
            Rate your satisfaction level with these areas of your health?
          </Typography>
          <Typography usage="body" typeClass={['mb-10 text-left']}>
            Last updated on <span className="font-bold">{lastUpdatedAt}</span>
          </Typography>
          <SelfAssessment answer={levels} onValueChanged={setLevels} />
        </div>
      </PageWrapper>
    </BottomSheet>
  );
};
