/* eslint-disable react-hooks/exhaustive-deps */
import { Button } from 'Components/Button/Button';
import { Loader } from 'Components/Loader/Loader';
import { ProgressBrain } from 'Components/ProgressBrain/ProgressBrain';
import { Typography } from 'Components/Typography/Typography';
import { useDates, useUserHabits } from 'helpers/stateHelper';
import { averageCompletionForDate } from 'helpers/utils';
import { ReactComponent as ActionsSVG } from 'img/ellipsis.svg';
import moment from 'moment';
import React, { useEffect, useMemo, useRef, useState } from 'react';
import './Calendar.scss';

export interface CalendarData {
  dayClass: string;
  wrapperClass?: string;
  dates: string[];
}

interface CalendarObjectProps {
  weekdays: string[];
  months: string[];
  data?: any;
}
export interface CalendarProps {
  // Additional classes to calendar
  calendarClass?: string;
  // hides everything in the header which includes default actions and typography components
  hideHeader?: boolean;
  // show selected date in header
  showSelectedDate?: boolean;
  // trims days (Sunday, Monday, ...) to specified length - possibly 1 for mobile devices
  dayTextLength?: number;
  // additional classes to day buttons
  dayClass?: string;
  // disables moving weeks / months
  disableNavigation?: boolean;
  // allows swiping left right but hides navigation controls
  hideNavigation?: boolean;
  // default calendar style and weekdays triggers onCalendarUpdate Function with param: selectedDate, startRange, and endRange as params
  // daysSelection calls onSelectedDaysChanged function
  calendarStyle?: 'default' | 'weekdays' | 'daysSelection';
  // additional classes to the body of the calendar
  bodyClass?: string;
  // additional actions that can be added to the top right of the calendar
  calendarActions?: React.ReactElement;
  // function called for when selectedDays is updated while in calendarStyle == 'daysSelection'
  // selectedDays ([Sunday, Monday, ...]) is passed to function called
  onSelectedDaysChanged?: any;
  // Called everytime calendar change is detected (month / week change, day is selected, ...)
  onCalendarUpdate?: Function;
  // Called everytime calendar change is detected (month / week change, day is selected, ...)
  onActionsClick?: Function;
  // hides default actions in top right of calendar
  hideDefaultActions?: boolean;
  // initial value for rangeType default is 'weeks'
  initialRangeType?: 'week' | 'month';
  // for mobile devices
  enableSwipe?: boolean;
  // dates passed to calendar that will be highlighted according to the styling passed
  calendarData?: CalendarData[];
}

/**
 * Calendar component is based on moment library such as weekdays to indicate days of the week (Sunday, Monday, etc.)
 * @param param0
 * @returns
 */
export const Calendar = function ({
  calendarClass = '',
  dayTextLength = 1,
  dayClass = '',
  initialRangeType = 'week',
  calendarStyle = 'default',
  disableNavigation = false,
  hideDefaultActions = false,
  enableSwipe = false,
  showSelectedDate = false,
  ...props
}: CalendarProps) {
  const now = moment();
  const { dates: datesState, setDates } = useDates();
  const dates = useMemo(() => datesState, [datesState]);
  const { habits: allHabits } = useUserHabits();
  const calendarBodyRef = useRef(null);
  const [loading, setLoading] = useState(true);
  const [rangeType] = useState(initialRangeType);
  // const [activeDate, setActiveDate] = useState<any>(dates.selected);
  // const [selectedDate, setSelectedDate] = useState<any>(dates.selected);
  const setSelectedDate = (selected: any) => {
    setDates({
      ...dates,
      selected
    });
  };
  const [selectedDays, setSelectedDays] = useState<string[]>([]);
  const [calendar, setCalendar] = useState<CalendarObjectProps>({
    weekdays: moment.weekdays(),
    months: moment.months()
  });
  const [touchStart, setTouchStart] = useState(0);
  const [touchEnd, setTouchEnd] = useState(0);
  const [headerText, setHeaderText] = useState(`This ${initialRangeType}`);

  const handleTouchStart = (e: any) => {
    setTouchStart(e.targetTouches[0].clientX);
  };

  const handleTouchMove = (e: any) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const handleTouchEnd = (e: any) => {
    if (touchStart - touchEnd > 150 && touchEnd !== 0) {
      console.log('swiped left');
      move('next');
      resetTouch();
    } else if (touchStart - touchEnd < -150 && touchEnd !== 0) {
      console.log('swiped right');
      move('prev');
      resetTouch();
    }
  };

  const handleDayClick = (e: any, date: any) => {
    e.stopPropagation();
    e.preventDefault();

    // Cannot select dates in the future
    if (!moment(date).isSameOrBefore(new Date(), 'day')) {
      return;
    }
    // Single date selected set value to state
    if (calendarStyle === 'default' || calendarStyle === 'weekdays') {
      setSelectedDate(moment(date));
    } else {
      // Different behavior for multiple selection
      const index = selectedDays.indexOf(date);

      if (index > -1) {
        setSelectedDays((prev: any) => prev.filter((day: any) => day !== date));
      } else {
        setSelectedDays((prev: any) => [...prev, date]);
      }
    }

    resetTouch();
  };

  // for default calendar and weekdays
  useEffect(() => {
    const loadCalendar = async () => {
      setLoading(true);

      // reset calendar.data state
      await setCalendar((prev: any) => ({
        ...prev,
        data: []
      }));

      // Get calendar range
      let startRange: any;
      let endRange: any;
      if (rangeType === 'month') {
        startRange = moment(dates.selected)
          .clone()
          .startOf('month')
          .startOf('week');
        endRange = moment(dates.selected).clone().endOf('month').endOf('week');
      } else if (rangeType === 'week') {
        startRange = moment(dates.selected).clone().startOf('week');
        endRange = moment(dates.selected).clone().endOf('week');
      }

      let days: any = [];
      let date = startRange.clone().subtract(1, 'day');
      // add days in range to array
      while (date.isBefore(endRange, 'day')) {
        days.push(date.add(1, 'day').clone());
      }

      // reload view
      await setCalendar((prev: any) => ({
        ...prev,
        data: days
      }));

      setLoading(false);
    };

    loadCalendar();
  }, [dates.selected, rangeType]);

  // For multiple selection type calendar
  useEffect(() => {
    const selectedDaysChanged = async () => {
      if (props.onSelectedDaysChanged) {
        props.onSelectedDaysChanged(selectedDays);
      }
    };

    selectedDaysChanged();
  }, [selectedDays]);

  // send new data to onCalendarUpdate function
  useEffect(() => {
    const getHeaderText = async (start: any, end: any) => {
      const currentRangeCondition =
        rangeType === 'month'
          ? start.month() === now.month()
          : start.week() === now.week();
      const previousRangeCondition =
        rangeType === 'month'
          ? start.month() + 1 === now.month()
          : start.week() + 1 === now.week();
      let headerText: string;
      if (currentRangeCondition) {
        headerText = `This ${rangeType}`;
      } else if (previousRangeCondition) {
        headerText = `Last ${rangeType}`;
      } else {
        headerText =
          start.month() === end.month()
            ? `${start.format('MMM D')} - ${end.format('D')}`
            : `${start.format('MMM D')} - ${end.format('MMM D')}`;
      }

      setHeaderText(headerText);
    };

    const selectedDateChanged = async () => {
      if (props.onCalendarUpdate) {
        // Get calendar range
        let startRange: any;
        let endRange: any;
        if (rangeType === 'month') {
          startRange = moment(dates.selected)
            .clone()
            .startOf('month')
            .startOf('week');
          endRange = moment(dates.selected)
            .clone()
            .endOf('month')
            .endOf('week');
          getHeaderText(
            moment(dates.selected).clone().startOf('month'),
            moment(dates.selected).clone().endOf('month')
          );
        } else if (rangeType === 'week') {
          startRange = moment(dates.selected).clone().startOf('week');
          endRange = moment(dates.selected).clone().endOf('week');
          getHeaderText(startRange, endRange);
        }
        props.onCalendarUpdate(dates.selected, startRange, endRange);
      }
    };

    selectedDateChanged();
  }, [dates.selected, rangeType]);

  // move calendar forward or backward
  const move = (direction: 'prev' | 'next') => {
    if (!disableNavigation) {
      setSelectedDate(
        direction === 'prev'
          ? dates.selected.clone().subtract(1, rangeType)
          : dates.selected.clone().add(1, rangeType)
      );
    }
  };

  // reset to prevent swipe detection on click / touch
  const resetTouch = () => {
    setTouchStart(0);
    setTouchEnd(0);
  };

  // if (loading) return <Loader hideText={true}/>
  const Calendar: React.ReactElement = (
    <div className={['custom-calendar', calendarClass].join(' ')}>
      {!props.hideHeader ? (
        <div className="calendar-header">
          {showSelectedDate ? (
            <Typography usage="headingSmall" typeClass={['w-full']}>
              {dates.selected.format('YYYY MMMM D ')}
            </Typography>
          ) : (
            <></>
          )}
          <div className="flex justify-start items-center w-full">
            <Typography usage="headingSmall" typeClass={['w-full']}>
              {headerText}
            </Typography>
            {props.calendarActions ? props.calendarActions : <></>}
            {!hideDefaultActions ? (
              <>
                <button
                  className="w-6 h-6 ellipsis"
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    props.onActionsClick && props.onActionsClick();
                  }}
                >
                  <ActionsSVG />
                </button>
                {/* <Dropdown
                    Icon={ActionsSVG}
                    dropdownToggleClass='w-6 h-6 p-0'
                    showDropdown={dropdownOpen}
                    dropdownOnClick={() => {
                      setDropdownOpen(!dropdownOpen)
                    }}
                    dropdownItems={[
                      {
                        label: 'today',
                        onClick: () => { setSelectedDate(now); setActiveDate(now) }
                      },
                      {
                        label: 'month',
                        onClick: () => setRangeType('month')
                      },
                      {
                        label: 'week',
                        onClick: () => setRangeType('weeks')
                      }
                    ]}
                    dropdownMenuClass="w-full"
                  /> */}
              </>
            ) : (
              <></>
            )}
          </div>
        </div>
      ) : (
        ''
      )}
      <div
        ref={calendarBodyRef}
        className={[props.bodyClass || 'calendar-body'].join(' ')}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        {loading ? <Loader hideText={true} /> : ''}
        {calendarStyle === 'default' || calendarStyle === 'weekdays' ? (
          <>
            {calendarStyle === 'default' ? (
              calendar.weekdays.map((day: any, i: number) => {
                return (
                  <Typography
                    key={`calendar-set-${i}`}
                    usage="historyRegular"
                    content={day.slice(0, dayTextLength)}
                  />
                );
              })
            ) : (
              <></>
            )}
            {calendar.data &&
              calendar.data.map((day: any, i: number) => {
                let dataDayClass = '';
                let dataWrapperClass = '';

                if (props.calendarData && props.calendarData.length > 0) {
                  props.calendarData.some((data: CalendarData) => {
                    if (
                      data.dates.some(
                        (date: any) =>
                          moment(date).format('YYYYMMDD') ===
                          moment(day).format('YYYYMMDD')
                      )
                    ) {
                      dataDayClass = data.dayClass;
                      dataWrapperClass = data.wrapperClass || '';
                    }
                    return '';
                  });
                }
                // add inactive class to days outside the month
                // const isInactive = (moment(day).month() !== activeDate.month()) ? 'inactive' : '';
                // add current class for today's date
                // const isCurrent = (moment(day).date() === now.day() + 1 && !isInactive) ? 'current' : '';
                const isCurrent =
                  moment(day).date() === now.day() + 1 ? 'current' : '';

                const avg = averageCompletionForDate(allHabits, day);
                // set active class for currently selected date
                const isActive =
                  moment(day).format('YYYYMMDD') ===
                  moment(dates.selected).format('YYYYMMDD')
                    ? 'active'
                    : '';

                return (
                  <div
                    key={`calendar-set-${i}`}
                    className={[
                      'calendar-day',
                      isCurrent,
                      // calendarStyle === 'default' ? isInactive : '',
                      dataWrapperClass
                    ].join(' ')}
                  >
                    <Button
                      buttonType="btn-tertiary"
                      label={
                        calendarStyle === 'default'
                          ? moment(day).format('D').toString()
                          : calendar.weekdays[moment(day).weekday()].slice(0, 1)
                      }
                      className={[
                        // "font-light text-xs w-7 h-7 bg-red-300 text-gray rounded-full text-center",
                        'font-light text-xs text-center relative',
                        dayClass,
                        // isActive,
                        dataDayClass
                      ].join(' ')}
                      onClick={(e: any) => handleDayClick(e, day)}
                    >
                      {(moment(day).date() > now.date() &&
                        moment(day).month() === now.month()) ||
                      moment(day).month() > now.month() ? (
                        <></>
                      ) : (
                        <ProgressBrain
                          progress={avg}
                          id={`calendar-set-${i}`}
                        />
                      )}
                      <Typography
                        usage="historyRegular"
                        typeClass={['calendar-day-text']}
                        content={
                          calendarStyle === 'default'
                            ? moment(day).format('D').toString()
                            : calendar.weekdays[moment(day).weekday()].slice(
                                0,
                                1
                              )
                        }
                      />
                    </Button>
                    {/* <button className={`${dayC}`} onClick={(e: any) => handleDayClick(e, day)}></button> */}
                    {isActive ? (
                      <div className="active-day-indicator"></div>
                    ) : (
                      <></>
                    )}
                  </div>
                );
              })}
          </>
        ) : calendarStyle === 'daysSelection' ? (
          <>
            {/* Should allow multiple selected and save selected days */}
            {/* Keeping this separate for readability */}
            {calendar.weekdays.map((day: any, i: number) => {
              // set active class for currently selected date
              const isActive = selectedDays.includes(day) ? 'active' : '';
              return (
                <div
                  key={`calendar-set-${i}`}
                  className={['calendar-day'].join(' ')}
                >
                  <Button
                    label={day.slice(0, 1)}
                    className={[
                      'font-light text-xs w-7 h-7 bg-red-300 text-gray rounded-full text-center',
                      dayClass,
                      isActive
                    ].join(' ')}
                    onClick={(e: any) => handleDayClick(e, day)}
                  />
                </div>
              );
            })}
          </>
        ) : (
          <></>
        )}
        {!disableNavigation && !props.hideNavigation ? (
          <>
            <button
              type="button"
              className="calendar-control group left-0 flex"
              onClick={() => move('prev')}
            >
              <span className="control-item">
                <svg
                  className="w-5 h-5 text-gray sm:w-6 sm:h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M15 19l-7-7 7-7"
                  ></path>
                </svg>
                <span className="hidden">Previous</span>
              </span>
            </button>
            <button
              type="button"
              className={['calendar-control group right-0 flex'].join(' ')}
              onClick={() => move('next')}
            >
              <span className="control-item">
                <svg
                  className="w-5 h-5 text-gray sm:w-6 sm:h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M9 5l7 7-7 7"
                  ></path>
                </svg>
                <span className="hidden">Next</span>
              </span>
            </button>
          </>
        ) : (
          <></>
        )}
      </div>
    </div>
  );

  return Calendar;
};
