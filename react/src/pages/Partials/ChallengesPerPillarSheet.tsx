import { BottomSheet } from 'react-spring-bottom-sheet';
import { Challenge, ChallengeMap, DialogProps, HabitPillar } from 'types/types';

import { BottomSheetHeader } from 'Components/BottomSheetHeader/BottomSheetHeader';
import { ListGroup } from 'Components/ListGroup/ListGroup';
import { ListItem } from 'Components/ListItem/ListItem';
import { PageWrapper } from 'Components/PageWrapper/PageWrapper';
import { useState } from 'react';
import { ChallengeDetailsSheet } from './ChallengeDetailsSheet';
import { useSelector } from 'react-redux';
import { getData } from 'slices/dataSlice';
import { challengeIconFrame } from 'helpers/utils';

type ChallengesPerPillarSheetProps = DialogProps & {
  pillar: HabitPillar;
  challenges: ChallengeMap;
};

export function ChallengesPerPillarSheet({
  open,
  setOpen,
  pillar,
  challenges
}: ChallengesPerPillarSheetProps) {
  const [challenge, setChallenge] = useState<Challenge>();
  const [challengeDetailsOpen, setChallengeDetailsOpen] = useState(false);

  const { data } = useSelector(getData);
  const { appearanceOption } = data

  const handleChallengeClick = (challenge: Challenge) => {
    setChallenge(challenge);
    setChallengeDetailsOpen(true);
  };

  const importantPillarChallenges = [
    ...challenges.important,
    ...challenges.othersImportant
  ].filter((item) => item.pillar === pillar);

  console.log(challenges, challenge, pillar);

  return (
    <>
      {challenge && (
        <ChallengeDetailsSheet
          open={challengeDetailsOpen}
          setOpen={setChallengeDetailsOpen}
          challenge={challenge}
        />
      )}
      <BottomSheet
        open={open}
        defaultSnap={({ maxHeight }) => maxHeight * 0.94}
        snapPoints={({ maxHeight }) => [maxHeight * 0.94]}
        header={
          <BottomSheetHeader
            title={pillar}
            leftSideActionLabel="Back"
            leftSideActionOnClick={() => setOpen(false)}
          />
        }
      >
        <PageWrapper sidesOnly>
          <div className={'py-4'}>
            {importantPillarChallenges.length > 0 && <div className={'my-8'}>
              <ListGroup
                listGroupType="listGroup_primary"
                heading={`Top ${pillar.toLowerCase()} challenges`}
                items={importantPillarChallenges.map((item) => (
                  <ListItem
                    label={item.title}
                    sublabel={item.pillar}
                    prefix={challengeIconFrame(item, appearanceOption)}
                    onClick={() => handleChallengeClick(item)}
                    chevron
                  />
                ))}
              />
            </div>}

            <ListGroup
              listGroupType="listGroup_primary"
              heading={`Other ${pillar.toLowerCase()} challenges`}
              items={challenges[pillar]
                .filter(
                  (item) =>
                    importantPillarChallenges.findIndex(
                      (x) => item.id === x.id
                    ) === -1
                )
                .map((item) => {
                  return (
                    <ListItem
                      label={item.title}
                      sublabel={item.pillar}
                      prefix={challengeIconFrame(item, appearanceOption)}
                      onClick={() => handleChallengeClick(item)}
                      chevron
                    />
                  );
                })}
            />
          </div>
        </PageWrapper>
      </BottomSheet>
    </>
  );
}
