import { Dialog } from '@capacitor/dialog';
import { Button } from 'Components/Button/Button';
import { Input } from 'Components/Input/Input';
import { ListGroup } from 'Components/ListGroup/ListGroup';
import { ListItem } from 'Components/ListItem/ListItem';
import { Switch } from 'Components/Switch/Switch';
import { CustomHabitContext } from 'contexts/customhabit.context';
import localization from 'helpers/localizationHelper';
import { ReactElement, useContext, useEffect, useState } from 'react';
import { BottomSheet } from 'react-spring-bottom-sheet';
import { DialogProps, HabitPillar, HabitReminder } from 'types/types';

import { Capacitor } from '@capacitor/core';
import { LocalNotifications } from '@capacitor/local-notifications';
import { Icon } from '@iconify/react';
import { BottomSheetHeader } from 'Components/BottomSheetHeader/BottomSheetHeader';
import { ColourDot } from 'Components/ColourDot/ColourDot';
import { HabitIcon } from 'Components/HabitIcon/HabitIcon';
import 'Components/HabitIcon/HabitIcon.scss';
import { PageWrapper } from 'Components/PageWrapper/PageWrapper';
import { Stepper } from 'Components/Stepper/Stepper';
import { TextArea } from 'Components/TextArea/TextArea';
import { Typography } from 'Components/Typography/Typography';
import NotificationHelper from 'helpers/notificationHelper';
import { SyncHelper } from 'helpers/syncHelper';
import {
  daysOfWeek,
  displayStatusString,
  getDateText,
  getDefaultIconFromPillars,
  getProperHabitCss,
  getTimeFormattedValue,
  habitFrequencyToDisplayText,
  habitIcon,
  includesPillar,
  randomForNotifId
} from 'helpers/utils';
import moment from 'moment';
import { useSelector } from 'react-redux';
import { getData } from 'slices/dataSlice';
import { ReactComponent as PlusSVG } from '../../img/icon_plus.svg';
import { PillarSelectionModal } from './PillarSelectionModal/PillarSelectionModal';
import { RemindPickerBottomSheet } from './RemindPickerBottomSheet';

export const CustomHabitModal = ({ open, setOpen }: DialogProps) => {
  const {
    habit,
    setCustomHabitValue,
    setInterfaceOpen,
    clearHabit,
    closeAllInterfaces,
    setCustomTips
  } = useContext(CustomHabitContext);

  //const [showHabitDropdown, setShowHabitDropdown] = useState(false);

  const [pillarSelectionOpen, setPillarSelectionOpen] = useState(false);

  const [submitting, setSubmitting] = useState(false);

  const [selectedReminderIndex, setSelectedReminderIndex] = useState(0);

  const [reminderOpen, setReminderOpen] = useState(false);

  const { data } = useSelector(getData);
  const [title, setTitle] = useState<
    'Add habit' | 'Create habit' | 'Edit habit' | 'View habit'
  >('Add habit');

  const [buttonLabel, setButtonLabel] = useState<'Add habit' | 'Edit habit'>(
    'Add habit'
  );

  const hasChallenge = habit.challengeID ? true : false;

  useEffect(() => {
    if (data.newHabitType === 'custom') {
      setTitle('Create habit');
      setButtonLabel('Add habit');
    } else if (data.newHabitType === 'predefined') {
      setTitle('Add habit');
      setButtonLabel('Add habit');
    } else if (data.newHabitType === 'edit') {
      setTitle('Edit habit');
      setButtonLabel('Edit habit');
    } else if (data.newHabitType === 'view') {
      setTitle('View habit');
    }
  }, [data.newHabitType]);

  if (habit.tips) {
    console.log(habit.tips);
  }

  useEffect(() => {
    if (
      (habit.colour === 'lightBlue' ||
        habit.colour === undefined ||
        includesPillar(habit.colour)) &&
      habit.pillars.length
    ) {
      setCustomHabitValue('colour', habit.pillars[0]);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [habit.pillars]);

  // useEffect(() => {
  //   setErrorMessage('');
  // }, [habit.pillars, habit.title]);

  // //Fields for values of each list item
  const close = () => {
    setInterfaceOpen('customHabitOpen', false);
  };

  const customHabitHeader = (): ReactElement => {
    return (
      <BottomSheetHeader
        title={title}
        leftSideActionLabel="Back"
        leftSideActionOnClick={close}
        {...(!hasChallenge
          ? {
              rightSideActionLabel: habit.id ? 'Save' : 'Add',
              rightSideActionOnClick: onSaveClick
            }
          : {})}
      />
    );
  };

  const onSaveClick = async () => {
    if (submitting) {
      return;
    }

    // setErrorMessage('');
    if (!habit.title) {
      await Dialog.alert({
        message: 'Please fill in the title field'
      });
      return;
    }
    if (!habit.pillars.length) {
      await Dialog.alert({
        message: 'Please select at least 1 pillar'
      });
      return;
    }
    if (!habit.colour) {
      await Dialog.alert({
        message: 'Please select a colour'
      });
      return;
    }

    if (!habit.frequencyUnit) {
      await Dialog.alert({
        message: "Please select 'how often' value"
      });
      return;
    }

    if (!habit.units) {
      await Dialog.alert({
        message: "Please select 'unit' value"
      });
      return;
    }
    if (habit.targetValue <= 0) {
      await Dialog.alert({
        message: 'Please choose a count value.'
      });
      return;
    }
    setSubmitting(true);

    // We changed our target value so we have to change it everywhere.
    if (
      habit.activities[habit.activities.length - 1].targetValue !==
      habit.targetValue
    ) {
      // Need to do a bulk method. This is fine for the quick beta showcase.
      habit.activities.forEach((a) => {
        a.targetValue = habit.targetValue;
      });
    }

    await SyncHelper.putHabit(habit);

    closeAllInterfaces();

    setSubmitting(false);
    close();
  };

  const [iconColour, icon] = [habit.colour, habit.icon];

  const RenderIcon = ({ isInList = true }: any) => {
    if (icon !== '') {
      return icon?.startsWith('eva:') || icon?.startsWith('mdi:') ? (
        <Icon
          icon={icon}
          className={`habitGlyph !w-10 ${getProperHabitCss(
            habit.colour
          )} !bg-transparent`}
          width="40"
          height="40"
          inline={false}
        />
      ) : (
        <div
          className={`display-icon habitGlyph ${isInList ? 'w-10 h-10' : ''}`}
          style={{
            fontSize: '20px'
          }}
        >
          {icon}
        </div>
      );
    } else {
      return (
        <div
          className={`display-default-icon habitGlyph ${
            isInList
              ? `!w-10 items-center ${getProperHabitCss(
                  habit.colour
                )} !bg-transparent`
              : ``
          }`}
        >
          {getDefaultIconFromPillars(habit.pillars)}
        </div>
      );
    }
  };

  const addReminder = (reset = true) => {
    const defaultDay =
      habit.frequencyUnit === 'week'
        ? 1
        : habit.frequencyUnit === 'month'
        ? '1st day'
        : '';
    // habit.reminders.push({ time: '9:00 AM', ...habit.frequencyUnit !== 'day' ? { day: defaultDay } : null })

    if (reset) {
      setCustomHabitValue('reminders', [
        {
          time: '9:00 AM',
          ...(habit.frequencyUnit === 'month'
            ? { day: defaultDay }
            : habit.frequencyUnit === 'week'
            ? { days: [defaultDay] }
            : null)
        }
      ]);
    } else {
      setCustomHabitValue('reminders', [
        ...habit.reminders,
        {
          time: '9:00 AM',
          ...(habit.frequencyUnit === 'month'
            ? { day: defaultDay }
            : habit.frequencyUnit === 'week'
            ? { days: [defaultDay] }
            : null)
        }
      ]);
    }
  };

  const getReminders = (): any => {
    const listItems =
      habit.reminders?.length > 0
        ? habit.reminders.map((reminder, i) => {
            let daysStr: string[] = [];
            if (reminder.days && reminder.days.length > 0) {
              daysStr = reminder.days.map((day: number) =>
                ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'][day].slice(0, 1)
              );
            }
            return (
              <ListItem
                key={`reminder-${i}`}
                label={reminder.time}
                {...(reminder.day
                  ? { suffix: reminder.day }
                  : reminder.days
                  ? { suffix: `On ${daysStr.join(', ')}` }
                  : null)}
                onClick={async () => {
                  setSelectedReminderIndex(i);
                  setReminderOpen(true);
                }}
                chevron={true}
              />
            );
          })
        : [];

    return listItems;
  };

  const firstSection = (): ReactElement => {
    let goalString = `${habitFrequencyToDisplayText(
      habit.frequencyUnit,
      habit.frequencyUnitQuantity
    )} goal: ${displayStatusString(habit)}`;

    if (title === 'Create habit' || title === 'Edit habit') {
      return (
        <div className="mt-4">
          <div className="text-center mb-8">
            <Typography
              usage="captionRegular"
              typeClass={['opacity-50']}
              content={habit.pillars[0] ? habit.pillars[0] : 'Pillar'}
            />
            <Typography
              usage="headingLarge"
              content={habit.title !== '' ? habit.title : 'New habit'}
            />
            <Typography
              usage="captionRegular"
              typeClass={['opacity-75']}
              content={goalString}
            />
          </div>
          <ListGroup
            heading="Info"
            items={[
              <ListItem
                label={
                  <Input
                    value={habit.title}
                    type="text"
                    disableState
                    id="habitName"
                    tabIndex={1}
                    placeholder="New habit name"
                    onChange={(e: any) => {
                      setCustomHabitValue('title', e.target.value);
                    }}
                  />
                }
              />,
              <ListItem
                label={
                  habit.cmsLink || habit.challengeID ? (
                    <span
                      dangerouslySetInnerHTML={{
                        __html: habit.description
                      }}
                    />
                  ) : (
                    <TextArea
                      value={habit.description}
                      tabIndex={2}
                      id="description"
                      placeholder="Description (optional)"
                      disableState
                      rows={3}
                      onInput={(e: any) => {
                        console.log(e.target.value);
                        setCustomHabitValue('description', e.target.value);
                      }}
                    />
                  )
                }
              />
            ]}
          />
          <ListGroup
            items={[
              <ListItem
                label="Pillar"
                suffix={
                  Array.isArray(habit.pillars)
                    ? habit.pillars.length > 0
                      ? [
                          ...habit.pillars.map((value: HabitPillar) => {
                            return value.toString();
                          })
                        ].join(', ')
                      : 'Select'
                    : habit.pillars
                }
                chevron
                onClick={() => setPillarSelectionOpen(true)}
              />
            ]}
          />
        </div>
      );
    } else if (title === 'Add habit') {
      return (
        <div className="mt-4">
          <div className="text-center mb-8">
            <Typography
              usage="captionRegular"
              typeClass={['opacity-50']}
              content={habit.pillars[0] ? habit.pillars[0] : 'Pillar'}
            />
            <Typography
              usage="headingLarge"
              typeClass={['my-1']}
              content={habit.title}
            />
            <Typography
              usage="captionRegular"
              typeClass={['opacity-75']}
              content={goalString}
            />
          </div>
          <ListGroup
            heading="About"
            items={[
              //
              <ListItem
                tabIndex={1}
                label={
                  habit.cmsLink || habit.challengeID ? (
                    <span
                      dangerouslySetInnerHTML={{
                        __html: habit.description
                      }}
                    />
                  ) : (
                    habit.description
                  )
                }
              />,
              <ListItem
                onClick={() => {
                  if (habit.tips !== undefined) {
                    setCustomTips(habit.tips);
                    setInterfaceOpen('tipsOpen', true);
                  }
                }}
                label={
                  <Typography
                    usage="body"
                    content="See tips"
                    typeClass={[
                      '!text-mom_lightMode_text-primary dark:!text-mom_darkMode_text-primary'
                    ]}
                  />
                }
              />
            ]}
          />

          <ListGroup
            items={[
              <ListItem
                label="Pillar"
                suffix={
                  Array.isArray(habit.pillars)
                    ? habit.pillars.length > 0
                      ? [
                          ...habit.pillars.map((value: HabitPillar) => {
                            return value.toString();
                          })
                        ].join(', ')
                      : 'Select'
                    : habit.pillars
                }
                chevron
                onClick={() => setPillarSelectionOpen(true)}
              />
            ]}
          />
        </div>
      );
    } else if (title === 'View habit') {
      return (
        <div className="mt-4">
          <div className="mb-8">
            <ListGroup
              heading="Info"
              items={[
                //
                <ListItem
                  tabIndex={1}
                  label={
                    habit.cmsLink || habit.challengeID ? (
                      <span
                        dangerouslySetInnerHTML={{
                          __html: habit.description
                        }}
                      />
                    ) : (
                      habit.description
                    )
                  }
                />,
                <ListItem
                  onClick={() => {
                    if (habit.tips !== undefined) {
                      setCustomTips(habit.tips);
                      setInterfaceOpen('tipsOpen', true);
                    }
                  }}
                  // label={'View tips'}
                  label={
                    <Typography
                      content="See tips"
                      usage="body"
                      typeClass={[
                        '!text-mom_lightMode_text-primary dark:!text-mom_darkMode_text-primary'
                      ]}
                    />
                  }
                />
              ]}
            />
          </div>
        </div>
      );
    }

    return <></>;
  };

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
  }, [open]);

  const reminderChanged = (reminder: HabitReminder) => {
    habit.reminders[selectedReminderIndex] = reminder;
    setCustomHabitValue('reminders', [...habit.reminders]);
  };

  const deleteReminder = (reminder: HabitReminder) => {
    setReminderOpen(false);

    habit.reminders = habit.reminders.filter((r) => r.id !== reminder.id);

    setCustomHabitValue('reminders', habit.reminders);

    // This is fine it's a singular reminder for a singular habit
    LocalNotifications.cancel({
      notifications: [{ id: reminder.id }]
    });
  };

  const frequencySuffix = () => {
    return habit.frequencyDays?.length < 7
      ? `On ${habit.frequencyDays?.map((d) => daysOfWeek[d]).join(', ')}`
      : '';
  };

  const Details = () => (
    <ListGroup
      listGroupType="listGroup_primary"
      heading="Details"
      items={[
        <ListItem
          label="Goal"
          suffix={habit.breakHabit ? 'Break a habit' : 'Build a habit'}
          chevron={!hasChallenge}
          onClick={() =>
            !hasChallenge && setInterfaceOpen('typePickerOpen', true)
          }
        />,
        <ListItem
          label="Unit"
          chevron={!hasChallenge}
          suffix={`${habit.breakHabit ? 'Max ' : ''}${habit.units}`}
        />,
        <ListItem
          label="Value"
          suffix={
            habit.isTime
              ? getTimeFormattedValue(habit.targetValue)
              : `${habit.targetValue} ${habit.units}`
          }
        />,
        <ListItem
          label="Frequency"
          suffix={habitFrequencyToDisplayText(habit.frequencyUnit)}
        />,
        [
          ...(habit.remindMe
            ? [
                <ListItem
                  label="Remind me"
                  suffix={
                    <Switch
                      controlled
                      initialValue={habit.remindMe}
                      onSwitchToggle={async (_, setChecked) => {
                        setChecked(habit.remindMe);
                      }}
                      id="remindMe"
                    />
                  }
                />,
                getReminders()
              ]
            : [])
        ]
      ]}
    />
  );

  return (
    <>
      <BottomSheet
        initialFocusRef={undefined}
        id="customHabitModal"
        header={customHabitHeader()}
        open={open}
        defaultSnap={({ maxHeight }) => window.innerHeight * 0.95}
        snapPoints={({ maxHeight }) => [window.innerHeight * 0.95]}
        onSpringEnd={(event) => {
          if (event.type === 'CLOSE') {
            clearHabit();
          }
        }}
      >
        <PageWrapper sidesOnly keyboardPadding>
          {/* <div className="dark:text-mom_darkMode_text-neutral">
            {errorMessage}
          </div> */}

          <PillarSelectionModal
            open={pillarSelectionOpen}
            setOpen={setPillarSelectionOpen}
          />

          <div
            className="w-20 h-25"
            data-testid={iconColour}
            style={{ margin: 'auto' }}
          >
            {/* @ts-ignore */}

            {/* HabitIcon component may need updating? */}
            {typeof icon !== 'undefined' &&
            typeof iconColour !== 'undefined' ? (
              <HabitIcon
                habitColour={iconColour}
                Icon={() => habitIcon(iconColour, habit.pillars, icon)}
              />
            ) : (
              <></>
            )}
          </div>
          {/* MIND-687 point 1 */}
          {habit.cmsLink ? <div tabIndex={1} /> : <></>}

          {firstSection()}
          <ListGroup
            listGroupType="listGroup_primary"
            heading="Appearance"
            items={[
              <ListItem
                label="Icon"
                onClick={() =>
                  !hasChallenge ? setInterfaceOpen('iconPickerOpen', true) : {}
                }
                suffix={<RenderIcon />}
                chevron={!hasChallenge}
              />,
              <ListItem
                label="Colour"
                onClick={() =>
                  !hasChallenge
                    ? setInterfaceOpen('colourPickerOpen', true)
                    : {}
                }
                suffix={<ColourDot borderless dotColour={habit.colour} />}
                chevron={!hasChallenge}
              />
            ]}
          />

          {/* <ListGroup
          listGroupType="listGroup_primary"
          heading="Details"
          items={[
            <ListItem
              label="Add to daily digest"
              suffix={
                <Switch
                  initialValue={habit.dailyDigest}
                  onSwitchToggle={() =>
                    setCustomHabitValue('dailyDigest', !habit.dailyDigest)
                  }
                  id={'digestSwitch'}
                />
              }
            />
          ]}
        /> */}
          {!hasChallenge ? (
            <>
              <ListGroup
                listGroupType="listGroup_primary"
                heading="Goal"
                items={[
                  <ListItem
                    label="I want to"
                    suffix={
                      habit.breakHabit ? 'Break a habit' : 'Build a habit'
                    }
                    chevron={true}
                    onClick={() => setInterfaceOpen('typePickerOpen', true)}
                  />,
                  <ListItem
                    label="Unit"
                    chevron={true}
                    onClick={() => setInterfaceOpen('unitPickerOpen', true)}
                    suffix={`${habit.breakHabit ? 'Max ' : ''}${habit.units}`}
                  />,
                  <ListItem
                    chevron={habit.isTime}
                    label=""
                    onClick={() =>
                      habit.isTime
                        ? setInterfaceOpen('durationPickerOpen', true)
                        : undefined
                    }
                    prefix={
                      !habit.isTime ? (
                        <Input
                          value={habit.targetValue.toString()}
                          type="number"
                          id={''}
                          placeholder="count"
                          disableState
                          onChange={(e: any) => {
                            if (e.target.value < 0) {
                              setCustomHabitValue('targetValue', 0);
                            } else {
                              setCustomHabitValue(
                                'targetValue',
                                Number(e.target.value)
                              );
                            }
                          }}
                        />
                      ) : (
                        <Typography usage="body" content="Value" />
                      )
                    }
                    suffix={
                      habit.isTime ? (
                        getTimeFormattedValue(habit.targetValue)
                      ) : (
                        <Stepper
                          onStepClick={(dir: 'up' | 'down') =>
                            dir === 'up'
                              ? setCustomHabitValue(
                                  'targetValue',
                                  habit.targetValue + 1
                                )
                              : setCustomHabitValue(
                                  'targetValue',
                                  habit.targetValue > 0
                                    ? habit.targetValue - 1
                                    : 0
                                )
                          }
                        />
                      )
                    }
                  />
                ]}
              />
              {loadCollections && (
                <>
                  <ListGroup
                    listGroupType="listGroup_primary"
                    heading="Frequency"
                    items={[
                      <ListItem
                        label={habitFrequencyToDisplayText(
                          habit.frequencyUnit,
                          habit.frequencyUnitQuantity
                        )}
                        suffix={frequencySuffix()}
                        chevron={true}
                        onClick={() =>
                          setInterfaceOpen('frequencyPickerOpen', true)
                        }
                      />,
                      <ListItem
                        label="Starts"
                        chevron={true}
                        onClick={() =>
                          setInterfaceOpen('startDatePickerOpen', true)
                        }
                        suffix={getDateText(moment(habit.startDate))}
                      />,
                      <ListItem
                        label="Ends"
                        chevron={true}
                        onClick={() =>
                          setInterfaceOpen('endDatePickerOpen', true)
                        }
                        suffix={
                          !habit.isNeverEnding
                            ? getDateText(moment(habit.endDate))
                            : 'Never'
                        }
                      />,
                      <ListItem
                        label="Remind me"
                        suffix={
                          <Switch
                            controlled
                            initialValue={habit.remindMe}
                            onSwitchToggle={async (checked: boolean) => {
                              if (checked) {
                                const granted =
                                  await NotificationHelper.requestNotifications();
                                if (
                                  !granted &&
                                  Capacitor.getPlatform() !== 'web'
                                ) {
                                  await Dialog.alert({
                                    title: 'Permissions needed',
                                    message:
                                      'Please enable notifications permissions'
                                  });
                                }
                                habit.reminders = [
                                  {
                                    id: randomForNotifId(),
                                    time: '9:00 AM'
                                  }
                                ];
                                setCustomHabitValue(
                                  'reminders',
                                  habit.reminders
                                );
                              } else {
                                if (habit.id) {
                                  SyncHelper.removeNotifications([habit]);
                                }
                                setCustomHabitValue('reminders', []);
                              }
                            }}
                            id="remindMe"
                          />
                        }
                      />,
                      ...getReminders(),
                      habit.remindMe ? (
                        <ListItem
                          label="Add reminder"
                          labelClass="!text-mom_lightMode_action-primary !dark:text-mom_darkMode_action-primary"
                          chevron={true}
                          onClick={() => addReminder(false)}
                          prefix={
                            <PlusSVG className="!fill-mom_lightMode_action-primary !dark:fill-mom_darkMode_action-primary" />
                          }
                        />
                      ) : null
                    ]}
                  />
                  {habit.id ? (
                    <ListGroup
                      listGroupType="listGroup_primary"
                      heading="Status"
                      items={[
                        <ListItem
                          label={habit.status}
                          chevron={true}
                          className="capitalize"
                          onClick={() =>
                            setInterfaceOpen('statusPickerOpen', true)
                          }
                        />
                      ]}
                    />
                  ) : (
                    <></>
                  )}
                  {habit.id ? (
                    <div className={'w-full pt-12'}>
                      <Button
                        buttonType="btn-tertiary"
                        label={'Delete habit'}
                        onClick={async () => {
                          const { value } = await Dialog.confirm({
                            title: `Delete ${habit.title}?`,
                            message: localization.getString(
                              'deleteHabitExplainer'
                            ),
                            okButtonTitle: 'Delete'
                          });

                          if (value) {
                            await SyncHelper.removeHabit(habit);

                            closeAllInterfaces();
                            close();
                          }
                        }}
                      />
                    </div>
                  ) : (
                    <Button label={buttonLabel} onClick={() => onSaveClick()} />
                  )}
                  <br />
                  <br />
                  {/*  */}
                  {/*  */}
                  {/*  */}
                  <div>
                    <p></p> {/**This is simply for proper spacing */}
                  </div>{' '}
                </>
              )}
            </>
          ) : (
            <></>
          )}
          {hasChallenge ? <Details /> : <></>}
          {hasChallenge ? (
            <Typography
              content={localization.getString('habitInChallengeExplainer')}
              usage="body"
              // 24 from the list + 12 here = 36
              typeClass={['mt-3', 'mb-[58px]']}
            />
          ) : (
            <></>
          )}
        </PageWrapper>
      </BottomSheet>
      {habit.reminders[selectedReminderIndex] ? (
        <RemindPickerBottomSheet
          open={reminderOpen}
          setOpen={setReminderOpen}
          onChange={reminderChanged}
          onDelete={deleteReminder}
          reminder={habit.reminders[selectedReminderIndex]}
        />
      ) : (
        <></>
      )}
    </>
  );
};
