import { Button } from 'Components/Button/Button';
import { ProgressIcon } from 'Components/ProgressIcon/ProgressIcon';
import { Typography } from 'Components/Typography/Typography';
import { CustomHabitContext } from 'contexts/customhabit.context';
import { useChallenges } from 'helpers/stateHelper';
import {
  displayStatusString,
  getTimeFormattedValue,
  habitFrequencyToDisplayText,
  habitIcon
} from 'helpers/utils';

import moment from 'moment';

import { SyncHelper } from 'helpers/syncHelper';
import { Activity } from 'models/activity';
import { Habit } from 'models/habit';
import {
  ReactElement,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState
} from 'react';
import { useDispatch } from 'react-redux';
import { BottomSheet } from 'react-spring-bottom-sheet';
import { setDataFieldWithID } from 'slices/dataSlice';
import { ReactComponent as Checkmark } from '../../img/icon_check.svg';
import { ReactComponent as StepDown } from '../../img/icon_stepdown.svg';
import { ReactComponent as StepUp } from '../../img/icon_stepup.svg';
import { Dialog } from '@capacitor/dialog';

import { ChallengeDetailsSheet } from './ChallengeDetailsSheet';
import './HabitCompletionBottomSheet.scss';

interface HabitCompletionBottomSheetProps {
  open: any;
  setOpen: any;

  habitSelected: Habit;
  selectedDate: any;
  setHabitDetailsOpen?: any;
  completionLabel?: string;
}

export const HabitCompletionBottomSheet = ({
  open,
  setOpen,
  selectedDate,
  setHabitDetailsOpen,
  habitSelected,
  completionLabel = 'Progress'
}: HabitCompletionBottomSheetProps) => {
  const [focused, setFocused] = useState<any>();
  const dispatch = useDispatch();
  let completionInputRef = useRef<any>();
  const [challengeDetailsOpen, setChallengeDetailsOpen] = useState(false);

  const { challenges }: any = useChallenges();

  const challenge = useMemo(
    () =>
      challenges &&
      challenges.find((x: any) => x.id === habitSelected.challengeID),
    [challenges, habitSelected.challengeID]
  );

  const [time, setTime] = useState<any>();

  const [history, setHistory] = useState<number[]>([]);
  const { setCustomHabit, setInterfaceOpen } = useContext(CustomHabitContext);

  const activity = useMemo(
    () =>
      habitSelected.getActivityForDate(selectedDate) ||
      Activity.create({
        actDate: moment(selectedDate).startOf('day').valueOf(),
        breakHabit: habitSelected.breakHabit,
        cycle: habitSelected.currentCycle,
        habitID: habitSelected.id,
        id: '',
        pillars: habitSelected.pillars,
        progress: 0,
        skipped: false,
        frequency: habitSelected.frequencyUnit,
        frequencyCount: habitSelected.frequencyUnitQuantity,
        targetValue: habitSelected.targetValue
      }),

    // eslint-disable-next-line react-hooks/exhaustive-deps
    [habitSelected, selectedDate]
  );
  const publishProgressUpdate = async (
    newValue: number,
    skipped: boolean = activity.skipped || false
  ) => {
    if (habitSelected?.id) {
      setHistory((h) => [...h, activity.progress]);
      activity.skipped = skipped;
      activity.progress = Math.max(newValue, 0); // Progress can never be negative
      habitSelected.putActivity(activity);

      SyncHelper.putHabit(habitSelected);
    }
  };

  useEffect(() => {
    if (open) {
      if (activity.progress && habitSelected.isTime && !time) {
        const now = moment();
        now.set({
          hour: Math.trunc(activity.progress),
          minute: Math.trunc((activity.progress % 1) * 60)
        });
        setTime(now.format('H:mm'));
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  useEffect(() => {
    if (completionInputRef.current) {
      console.log(completionInputRef.current);
    }
  }, [completionInputRef]);

  useEffect(() => {
    if (!habitSelected.id) {
      setOpen(false);
    }
  }, [habitSelected, setOpen]);

  const handleInputChange = (e: any) => {
    publishProgressUpdate(e.target.value);
  };

  const handleTimeInputChange = (value: string | number) => {
    let newValue = 0;

    // setTimeHistory((prev: number[]) => [...prev, activity.progress]);
    if (typeof value === 'string') {
      const components = value.split(':');

      if (components.length === 3) {
        const [hour, minute, second] = components;
        newValue = +hour * 60 * 60 + +minute * 60 + +second;
      } else if (components.length === 2) {
        const [minute, second] = components;
        newValue = +minute * 60 + +second;
      } else if (!isNaN(+value)) {
        newValue = +value;
      } else {
        return;
      }
    } else {
      newValue = value;
    }

    publishProgressUpdate(newValue);
  };

  async function enterValue() {
    const { value, cancelled } = await Dialog.prompt({
      title: 'Enter value',
      message: ``
    });

    if (!cancelled) {
      if (habitSelected.isTime) {
        const newText = value.replace(/[^0-9:]/g, '');
        handleTimeInputChange(newText);
      } else {
        const numericValue = parseInt(value.replace(/\D/g, ''));

        publishProgressUpdate(numericValue);
      }
    }
  }

  const progress = activity?.completion || 0;
  const header = (): ReactElement => {
    return (
      <div className="inline-flex justify-between w-full mt-4">
        {challenge && (
          <ChallengeDetailsSheet
            open={challengeDetailsOpen}
            setOpen={setChallengeDetailsOpen}
            challenge={challenge}
          />
        )}

        <Typography
          typeClass={['header_primary']}
          usage="headingSmall"
          onClick={() =>
            challenge
              ? setChallengeDetailsOpen(true)
              : completionLabel === 'Progress'
                ? setHabitDetailsOpen(true)
                : setOpen(false)
          }
          content={challenge ? 'View challenge' : completionLabel}
        />
        {/* <span onClick={() => setOpen(false)}>Close</span> */}
        <div className="inline-flex gap-x-3">
          <Typography
            typeClass={['header_primary']}
            usage="headingSmall"
            content="Enter value"
            onClick={async () => {
              await enterValue();
            }}
          />
          {!challenge && (
            <Typography
              typeClass={['header_primary']}
              usage="headingSmall"
              content="Edit"
              onClick={async () => {
                setCustomHabit(habitSelected);
                dispatch(
                  setDataFieldWithID({ id: 'newHabitType', value: 'edit' })
                );
                setInterfaceOpen('customHabitOpen', true);
              }}
            />
          )}
        </div>
      </div>
    );
  };

  return (
    <BottomSheet
      id="habitCompletionBottomSheet"
      className="pb-10"
      open={open}
      header={header()}
      onDismiss={() => {
        setOpen(false);
      }}
    // sibling={
    //   <div
    //     className="custom-backdrop"
    //     onClick={(e) => {
    //       e.preventDefault();
    //       e.stopPropagation();
    //       // if (toggle) {
    //       //   toggle();
    //       //   sheetRef.current.snapTo(0);
    //       // }
    //     }}
    //   />
    // }
    >
      <div className="px-6 pb-10 pt-7">
        <div id="hcbsContent" className="w-full block">
          <div className="w-full flex justify-center">
            <div className="w-24">
              <ProgressIcon
                context="onWhite"
                progress={progress}
                habitColour={habitSelected.colour}
                gradientClass={
                  habitSelected.breakHabit &&
                    activity.progress > activity.targetValue
                    ? 'overlimit'
                    : ''
                }
                Icon={() =>
                  habitIcon(
                    habitSelected.colour,
                    habitSelected.pillars,
                    habitSelected.icon
                  )
                }
              />
            </div>
          </div>
          <Typography
            typeClass={['text-center mt-6 opacity-50']}
            content={habitSelected.pillars
              .map((pillar: string) => pillar)
              .join(', ')}
            usage="captionRegular"
          />
          <Typography
            usage="headingLarge"
            typeClass={[
              'text-center my-2 text-mom_lightMode_text-neutral dark:text-mom_darkMode_text-neutral line-clamp-3'
            ]}
          >
            {habitSelected.title}
          </Typography>
          <Typography
            typeClass={[
              'text-center text-light text-mom_lightMode_text-neutral dark:text-mom_darkMode_text-neutral opacity-75 line-clamp-1',

              activity.breakHabit && activity.progress > activity.targetValue
                ? '!text-mom_lightMode_text-overMaximum !dark:text-mom_darkMode_text-overMaximum'
                : ''
            ]}
            content={`${habitFrequencyToDisplayText(
              habitSelected.frequencyUnit,
              habitSelected.frequencyUnitQuantity
            )} goal: ${displayStatusString(habitSelected)}`}
            usage="captionRegular"
          />
          <div className="mb-12">
            {challenge && challenge.title && (
              <Typography
                typeClass={['text-center opacity-50 mt-3 line-clamp-1']}
                content={challenge.title}
                usage="body"
              />
            )}
          </div>

          {!activity.skipped && (
            <div className="progress-controls w-full justify-center items-center gap-x-20">
              <Button
                Icon={StepDown}
                iconOnly
                buttonType="btn-secondary"
                disabled={activity.progress <= 0}
                onClick={() =>
                  publishProgressUpdate(
                    habitSelected.isTime
                      ? activity.progress - 60
                      : activity.progress - 1
                  )
                }
                iconButtonSize="medium"
                buttonClass={['float-left']}
              />
              <Button
                Icon={StepUp}
                iconOnly
                buttonType="btn-secondary"
                onClick={() =>
                  publishProgressUpdate(
                    habitSelected.isTime
                      ? activity.progress + 60
                      : activity.progress + 1
                  )
                }
                iconButtonSize="medium"
                buttonClass={['float-right']}
              />
              <div className="text-center mb-10">
                {!habitSelected.breakHabit && progress === 100 ? (
                  <div data-testid="checkmark">
                    <Checkmark
                      width="65"
                      height="52.7"
                      className="border-none inline m-0 w-30 text-center text-display text-mom_lightMode_text-neutral dark:text-mom_darkMode_text-neutral dark:fill-mom_darkMode_icon-neutral"
                    />
                  </div>
                ) : (
                  <>
                    {habitSelected.isTime ? (
                      <input
                        type="text"
                        ref={completionInputRef}
                        className={`border-none m-0 p-0 w-[65%] text-center text-display font-bold dark:bg-mom_darkMode_text-dark dark:text-mom_darkMode_text-neutral ${habitSelected.breakHabit &&
                          //progress
                          activity.progress > habitSelected.targetValue
                          ? 'text-mom_lightMode_text-overMaximum'
                          : 'text-mom_lightMode_text-neutral '
                          }`}
                        onBlur={(e) => {
                          setFocused(false);
                          handleTimeInputChange(e.target.value);
                        }}
                        onFocus={() => setFocused(true)}
                        {...(!focused
                          ? {
                            value: getTimeFormattedValue(activity.progress)
                          }
                          : null)}
                        onClick={async () => {
                          await enterValue();
                        }}
                      />
                    ) : (
                      <>
                        <input
                          ref={completionInputRef}
                          type="number"
                          id="habitProgress"
                          value={activity.progress}
                          className={`border-none m-0 p-0 w-16 text-center text-display font-bold dark:bg-mom_darkMode_text-dark dark:text-mom_darkMode_text-neutral ${habitSelected.breakHabit &&
                            activity.progress > habitSelected.targetValue
                            ? 'text-mom_lightMode_text-overMaximum'
                            : ' text-mom_lightMode_text-neutral'
                            }`}
                          onChange={handleInputChange}
                          onClick={async () => {
                            await enterValue();
                          }}
                        />
                      </>
                    )}
                  </>
                )}
              </div>
            </div>
          )}
        </div>
        {activity.skipped ? (
          <Button
            buttonType="btn-tertiary"
            buttonClass={['w-full rounded-full headingSmall']}
            onClick={() => {
              publishProgressUpdate(activity.progress, false);
            }}
          >
            Don't skip for today
          </Button>
        ) : (
          <div id="hcbsControls" className="w-full mt-3 text-center">
            {/* TODO: add functions when time picker finalized */}
            {habitSelected.isTime && progress !== 100 ? (
              <div className="flex justify-center gap-x-2">
                {
                  habitSelected.targetValue >= 600 &&
                  (
                    <>
                      <Button
                        buttonType="btn-tertiary"
                        label="Undo"
                        disabled={!history.length}
                        onClick={() => {
                          if (history.length) {
                            const his = [...history];
                            const top = his.pop()!;
                            publishProgressUpdate(top);
                            setHistory(his);
                          }
                        }}
                      />
                      <Button
                        buttonType="btn-tertiary"
                        label="+5m"
                        onClick={() => {
                          handleTimeInputChange(activity.progress + 300);
                        }}
                      />
                    </>
                  )
                }
                {
                  habitSelected.targetValue >= 3600 &&
                  <Button
                    buttonType="btn-tertiary"
                    label="+30m"
                    onClick={() => {
                      handleTimeInputChange(activity.progress + 1800);
                    }}
                  />
                }
                {
                  habitSelected.targetValue >= 7200 &&
                  <Button
                    buttonType="btn-tertiary"
                    label="+60m"
                    onClick={() => {
                      handleTimeInputChange(activity.progress + 3600);
                    }}
                  />
                }
              </div>
            ) : (
              <></>
            )}

            {activity.progress < habitSelected.targetValue ? (
              <div className="block w-full">
                {!habitSelected.isTime && (
                  <Button
                    buttonType="btn-primary"
                    label="Mark Complete"
                    buttonClass={['w-full rounded-full headingSmall']}
                    onClick={() =>
                      publishProgressUpdate(habitSelected.targetValue)
                    }
                  />
                )}
                <Button
                  buttonType="btn-tertiary"
                  buttonClass={['w-full rounded-full headingSmall']}
                  onClick={() => {
                    publishProgressUpdate(activity.progress, true);
                  }}
                >
                  Skip Today
                </Button>
              </div>
            ) : (
              <></>
            )}
          </div>
        )}
      </div>
    </BottomSheet>
  );
};
