import { ReactElement, useContext, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { BottomSheet } from 'react-spring-bottom-sheet';
import './NewHabitModal.scss';

import { CustomHabitContext } from 'contexts/customhabit.context';
import {
  useContentfulChallenges,
  useContentfulCollections,
  useFilteredContentfulHabits
} from 'helpers/contentfulHelper';
import { getData, setDataFieldWithID } from 'slices/dataSlice';
import { Challenge, ChallengeMap, DialogProps, HabitPillar } from 'types/types';

import 'Components/HabitIcon/HabitIcon.scss';
import { ListGroup } from 'Components/ListGroup/ListGroup';
import { ListItem } from 'Components/ListItem/ListItem';
import { PageWrapper } from 'Components/PageWrapper/PageWrapper';
import { SegmentedControl } from 'Components/SegmentedControl/SegmentedControl';
import { Typography } from 'Components/Typography/Typography';

//
import { BottomSheetHeader } from 'Components/BottomSheetHeader/BottomSheetHeader';
import { Button } from 'Components/Button/Button';
import localization from 'helpers/localizationHelper';
import {
  challengeIconFrame,
  getDefaultIconFromPillars,
  HabitListItem,
  habitPillars
} from 'helpers/utils';
import _ from 'lodash';
import { Habit } from 'models/habit';
import { ChallengeDetailsSheet } from './ChallengeDetailsSheet';
import { ChallengesPerPillarSheet } from './ChallengesPerPillarSheet';

//import { ReactComponent as IconCheck } from '../../img/icon_check.svg';

export const NewHabitModal = ({ open, setOpen }: DialogProps): ReactElement => {
  const dispatch = useDispatch();
  const { data } = useSelector(getData);

  const [answers, setAnswers] = useState<string[]>([]);

  useEffect(() => {
    const qa = data?.questionnaireAnswers;
    if (qa?.length) {
      setAnswers(
        qa.length > 2 && Object.keys(qa[2]).length > 0
          ? Object.keys(qa[2]).filter((a: any) => {
              return qa[2][a];
            })
          : []
      );
    } else {
      setAnswers([]);
    }
  }, [data]);

  const { setInterfaceOpen, setCustomHabit, setCustomPillar } =
    useContext(CustomHabitContext);

  const [forYouHabitsArray, setForYouHabitsArray] = useState<Habit[]>([]);

  const [forYouChallengesArray, setForYouChallengesArray] = useState<
    Challenge[]
  >([]);

  const [pageState, setPageState] = useState<'Habits' | 'Challenges'>('Habits');

  const { challenges, challengesMap } = useContentfulChallenges();

  const { habits: filtered } = useFilteredContentfulHabits();
  const { collections } = useContentfulCollections();

  const [loadCollections, setLoadCollections] = useState(false);

  useEffect(() => {
    if (data?.newHabitState) {
      setPageState(data.newHabitState || 'Habits');

      dispatch(setDataFieldWithID({ id: 'newHabitState', value: '' }));
    } else {
      setPageState('Habits');
    }

    async function delayLoad() {
      await new Promise((r) => setTimeout(r, 1000));
      setLoadCollections(true);
    }
    if (open) {
      delayLoad();
    } else {
      setLoadCollections(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  useEffect(() => {
    if (filtered?.length) {
      const importantHabits = _.shuffle(
        filtered.filter((habit) => habit.important)
      );

      const pillarSpecificImportantHabits = _.shuffle(
        importantHabits.filter((habit) => answers.includes(habit.pillars[0]))
      );

      const remainingImportantHabits = _.shuffle(
        importantHabits.filter((habit) => !answers.includes(habit.pillars[0]))
      );

      const outForYou = _.take(
        [...pillarSpecificImportantHabits, ...remainingImportantHabits],
        3
      );

      setForYouHabitsArray(outForYou);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, filtered]);

  useEffect(() => {
    if (challenges?.length) {
      const pillarSpecificChallenges = _.shuffle(
        challenges.filter((challenge) => answers.includes(challenge.pillar))
      );

      const outForYou = _.take(pillarSpecificChallenges, 3);

      setForYouChallengesArray(outForYou);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, challenges]);

  // const appleHealthListItem = (): ReactElement => {
  //   if (platform === 'ios') {
  //     return (
  //       <ListItem
  //         label="Apple health"
  //         suffix={<Switch id="appleSwitch" initialValue={false} />}
  //       />
  //     );
  //   } else {
  //     return <></>;
  //   }
  // };

  const newHabitHeader = (): ReactElement => {
    return (
      <BottomSheetHeader
        title="Add"
        leftSideActionLabel="Close"
        leftSideActionOnClick={() => setOpen(false)}
      />
    );
  };

  // const IconForHabit = (icon: any): any => {
  //   return (
  //     <Icon
  //       icon={icon.icon}
  //       className={'habitGlyph'}
  //       width="45"
  //       height="45"
  //       inline={false}
  //     />
  //   );
  // };

  const checkMono = (content: string) => {
    return data.monoOption && data.colourOption
      ? data.colourOption
      : content.split(' ')[0].toLowerCase();
  };

  const clickHabit = (habit: Habit) => {
    setCustomHabit(habit);
    dispatch(
      setDataFieldWithID({
        id: 'newHabitType',
        value: 'predefined'
      })
    );
    setInterfaceOpen('customHabitOpen', true);
  };

  const displayUi = (): ReactElement => {
    if (pageState === 'Habits') {
      return (
        <div>
          <ListGroup
            heading="For you"
            listGroupType="listGroup_primary"
            items={forYouHabitsArray
              .filter((h) => h && h.pillars.length)
              .map((habit) => (
                <HabitListItem
                  habit={habit}
                  iconColourClass={checkMono(habit.pillars[0])}
                  onClick={() => clickHabit(habit)}
                />
              ))}
          />
          <br />
          <ListGroup
            heading="Browse by pillar"
            listGroupType="listGroup_primary"
            items={habitPillars.map((pillar) => (
              <ListItem
                label={pillar}
                prefix={getDefaultIconFromPillars([pillar])}
                chevron
                onClick={() => {
                  setCustomPillar(pillar);
                  setInterfaceOpen('viewAllOpen', true);
                }}
              />
            ))}
          />
          {loadCollections &&
            collections.map((collection) => (
              <ListGroup
                heading={collection.title}
                key={collection.title}
                listGroupType="listGroup_primary"
                items={collection.habits
                  // .slice(0, 2)
                  // .map((habit) => (
                  //   <ListItem label={habit.title} />
                  // ))}
                  .filter((h) => h && h.pillars.length)

                  .map((habit) => (
                    <HabitListItem
                      habit={habit}
                      iconColourClass={checkMono(habit.pillars[0])}
                      onClick={() => clickHabit(habit)}
                    />
                  ))}
              />
            ))}
        </div>
      );
    } else if (pageState === 'Challenges') {
      return (
        <Challenges
          challenges={challengesMap}
          forYouChallenges={forYouChallengesArray}
          open={open}
        />
      );
    }

    return <></>;
  };

  return (
    <BottomSheet
      header={newHabitHeader()}
      open={open}
      defaultSnap={({ maxHeight }) => maxHeight * 0.94}
      snapPoints={({ maxHeight }) => [maxHeight * 0.94]}
    >
      <PageWrapper sidesOnly>
        <div className="relative">
          <div className='font-bold'>
            <SegmentedControl
              indexSelected={pageState === 'Habits' ? 0 : 1}
              optionLabels={['Habits', 'Challenges']}
              onOptionSelected={(i: number) =>
                i === 0 ? setPageState('Habits') : setPageState('Challenges')
              }
            />
          </div>
          
          <div className={'mt-4'}>
            <Typography
              usage="body"
              content={localization.getString(
                pageState === 'Habits'
                  ? 'addHabitExplainer'
                  : 'addChallengeExplainer'
              )}
            />
          </div>

          <br />
          {displayUi()}
          {pageState === 'Habits' && (
            <div className="fixed-create-button">
              <Button
                buttonClass={['headingSmall']}
                buttonType="btn-primary"
                label="Create your own habit"
                onClick={() => {
                  dispatch(
                    setDataFieldWithID({ id: 'newHabitType', value: 'custom' })
                  );
                  setInterfaceOpen('customHabitOpen', true);
                }}
              />
            </div>
          )}
          <div className="h-24"></div>
        </div>
      </PageWrapper>
    </BottomSheet>
  );
};

const Challenges = ({
  challenges,
  forYouChallenges,
  open
}: {
  challenges: ChallengeMap;
  forYouChallenges: Challenge[];
  open: boolean;
}): ReactElement => {
  const [challenge, setChallenge] = useState<Challenge | undefined>();
  const [challengeDetailsOpen, setChallengeDetailsOpen] = useState(false);
  const [challengesPerPillarOpen, setChallengesPerPillarOpen] = useState(false);
  const [pillar, setPillar] = useState<HabitPillar>('Exercise');
  // const importantItems = _.chunk(challenges.important, 3)[0];

  const handleChallengeClick = (challenge: Challenge) => {
    setChallenge(challenge);
    setChallengeDetailsOpen(true);
  };

  const { data } = useSelector(getData);
  const { appearanceOption } = data;

  const [loadCollections, setLoadCollections] = useState(false);

  useEffect(() => {
    async function delayLoad() {
      await new Promise((r) => setTimeout(r, 1000));
      setLoadCollections(true);
    }
    if (open) {
      delayLoad();
    } else {
      setLoadCollections(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  return (
    <>
      {challenge && (
        <ChallengeDetailsSheet
          open={challengeDetailsOpen}
          setOpen={setChallengeDetailsOpen}
          challenge={challenge}
        />
      )}
      {challenges && pillar && (
        <ChallengesPerPillarSheet
          open={challengesPerPillarOpen}
          setOpen={setChallengesPerPillarOpen}
          challenges={challenges}
          pillar={pillar}
        />
      )}

      <div className="space-y-4">
        {forYouChallenges && forYouChallenges.length > 0 && (
          <ListGroup
            heading="For you"
            listGroupType="listGroup_primary"
            items={forYouChallenges.map((item) => (
              <ListItem
                label={item.title}
                sublabel={item.pillar || ''}
                prefix={challengeIconFrame(
                  item,
                  appearanceOption,
                  'background'
                )}
                onClick={() => handleChallengeClick(item)}
                chevron
              />
            ))}
          />
        )}
        <ListGroup
          heading="Browse by pillar"
          listGroupType="listGroup_primary"
          items={habitPillars.map((pillar) => (
            <ListItem
              label={pillar}
              prefix={getDefaultIconFromPillars([pillar])}
              chevron
              onClick={() => {
                setPillar(pillar);
                setChallengesPerPillarOpen(true);
              }}
            />
          ))}
        />
        {loadCollections && (
          <>
            {' '}
            <ListGroup
              heading="Other challenges"
              listGroupType="listGroup_primary"
              items={Object.values(challenges)
                .reduce((a, b) => [...a, ...b])
                .filter(
                  (item) =>
                    !forYouChallenges ||
                    forYouChallenges.findIndex((x) => item.id === x.id) === -1
                )
                .map((item) => (
                  <ListItem
                    label={item.title || ''}
                    sublabel={item.pillar || ''}
                    prefix={challengeIconFrame(
                      item,
                      appearanceOption,
                      'background'
                    )}
                    onClick={() => handleChallengeClick(item)}
                    chevron
                  />
                ))}
            />
          </>
        )}
      </div>
    </>
  );
};
