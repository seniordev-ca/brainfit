/* eslint-disable react-hooks/exhaustive-deps */
import React, { useRef } from 'react';
import { Button } from 'Components/Button/Button';
import './ExpandedCalendar.scss';
import moment, { Moment } from 'moment';
import { Typography } from 'Components/Typography/Typography';
import { useEffect, useState } from 'react';
import { ProgressBrain } from 'Components/ProgressBrain/ProgressBrain';
import { useUserHabits } from 'helpers/stateHelper';

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
export interface ExpandedCalendarProps {
  // Additional classes to calendar
  calendarClass?: string;
  // hides everything in the header which includes default actions and typography components
  hideHeader?: boolean;
  // trims days (Sunday, Monday, ...) to specified length - possibly 1 for mobile devices
  dayTextLength?: number;
  // additional classes to day buttons
  dayClass?: string;
  // additional classes to the body of the calendar
  bodyClass?: string;
  // additional actions that can be added to the top right of the calendar
  calendarActions?: React.ReactElement;
  // function called on day click
  onDayClick?: Function;
  // for mobile devices
  enableSwipe?: boolean;
  // dates passed to calendar that will be highlighted according to the styling passed
  calendarData?: CalendarData[];
  // show calendar after render of bottom sheet fix
  showCalendar?: boolean;
  currentMonth?: number;
  selectedDate?: Moment;
}

/**
 * Calendar component is based on moment library such as weekdays to indicate days of the week (Sunday, Monday, etc.)
 * @param param0
 * @returns
 */
export const ExpandedCalendar = function ({
  calendarClass = '',
  dayTextLength = 1,
  dayClass = '',
  enableSwipe = false,
  showCalendar = false,
  ...props
}: ExpandedCalendarProps) {
  const now = moment();
  const calendarMonthsRef = useRef<any>(null);
  const currentMonthRef = useRef<any>(null);
  const loading = !showCalendar;
  const { habits: allHabits } = useUserHabits();
  const [selectedDate, setSelectedDate] = useState<any>(
    props.selectedDate || now
  );
  const [calendar, setCalendar] = useState<CalendarObjectProps>({
    weekdays: moment.weekdays(),
    months: moment.months()
  });
  const [activeMonth, setActiveMonth] = useState<any>(
    props.currentMonth || now.month()
  );
  const [activeYear, setActiveYear] = useState<any>(now.year());
  const [touchStart, setTouchStart] = useState(0);
  const [touchEnd, setTouchEnd] = useState(0);

  const handleTouchStart = (e: any) => {
    setTouchStart(e.targetTouches[0].clientY);
  };

  const handleTouchMove = (e: any) => {
    setTouchEnd(e.targetTouches[0].clientY);
  };

  const resetTouch = () => {
    setTouchStart(0);
    setTouchEnd(0);
  };

  const handleTouchEnd = () => {
    console.log(`touchStart: ${touchStart} touchEnd: ${touchEnd}`);

    // prevent moving onClick
    if (touchStart !== 0 && touchEnd !== 0) {
      if (touchStart - touchEnd > 150) {
        console.log('swiped up');
        if (activeMonth + 2 <= 11) {
          setActiveMonth(activeMonth + 2);
        } else {
          setActiveMonth(0);
          setActiveYear(activeYear + 1);
        }
      }

      if (touchStart - touchEnd < -150) {
        console.log('swiped down');
        if (activeMonth - 2 >= 0) {
          setActiveMonth(activeMonth - 2);
        } else {
          setActiveMonth(11);
          setActiveYear(activeYear - 1);
        }
      }
    }

    resetTouch();
  };

  const handleDayClick = (e: any, date: any) => {
    e.stopPropagation();
    e.preventDefault();

    // Cannot select dates in the future
    if (!moment(date).isSameOrBefore(new Date(), 'day')) {
      return;
    }

    setSelectedDate(moment(date));
    props.onDayClick && props.onDayClick(moment(date));
  };

  useEffect(() => {
    loadCalendar();
  }, [activeMonth]);

  const loadCalendar = async () => {
    // range is infinitely scrolling
    let monthData: any = {};
    const monthsToRender =
      (activeMonth + 1) % 2 === 0
        ? calendar.months.slice(activeMonth - 1, activeMonth + 1)
        : calendar.months.slice(activeMonth, activeMonth + 2);
    monthsToRender.forEach((month: string) => {
      let days: any = [];
      const monthToRender = moment(`${month} 1, ${activeYear}`);
      const startRange: any = moment(monthToRender)
        .clone()
        .startOf('month')
        .startOf('week');
      const endRange: any = moment(monthToRender)
        .clone()
        .endOf('month')
        .endOf('week');

      let date = startRange.clone().subtract(1, 'day');
      // add days in range to array
      while (date.isBefore(endRange, 'day')) {
        days.push(date.add(1, 'day').clone());
      }

      monthData[`${activeYear}-${month}`] = days;
      console.log(`${activeYear}-${month}`);
    });

    await setCalendar((prev: any) => ({
      ...prev,
      data: monthData
    }));
  };

  // scroll to current month
  useEffect(() => {
    if (currentMonthRef.current) {
      currentMonthRef.current.scrollIntoView({
        block: 'start',
        inline: 'center',
        behavior: 'smooth',
        duration: 1000
      });
    }
  }, [loading]); // add loading as dependency to prevent rescrolling to current month on rerender

  // if (loading) return <Loader hideText={true} />
  const Calendar: React.ReactElement = (
    <div className={['custom-expanded-calendar', calendarClass].join(' ')}>
      <div className={[props.bodyClass || 'calendar-body pb-8'].join(' ')}>
        <div className="calendar-grid auto-rows-fr">
          {calendar.weekdays.map((day: any) => {
            return (
              <Typography
                key={day}
                usage="historyRegular"
                typeClass={['calendar-weekday']}
                content={day.slice(0, dayTextLength)}
              />
            );
          })}
        </div>
        <div
          ref={calendarMonthsRef}
          className="calendar-months"
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
        >
          {calendar.data &&
            Object.keys(calendar.data).map((key: string, i: number) => {
              const days = calendar.data[key];
              const [, month] = key.split('-');

              return (
                <div
                  key={key}
                  className={`${key} calendar-grid calendar-month`}
                  {...(moment(`${key}-01`).format('YYYY-MMMM') ===
                  now.format('YYYY-MMMM')
                    ? { ref: currentMonthRef, 'data-test': 'test' }
                    : null)}
                >
                  {days.map((day: any, i: number) => {
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

                    const habitsForTheDay = allHabits.filter((h) =>
                      h.isScheduledFor(moment(day).valueOf())
                    );
                    const allCompletions = habitsForTheDay.map(
                      (a) =>
                        a.getActivityForDate(moment(day).valueOf())
                          ?.completion || 0
                    );
                    const total = allCompletions.length
                      ? allCompletions.reduce((a, b) => a + b)
                      : 0;
                    const avg = total / (habitsForTheDay.length || 1);

                    const isCurrent =
                      moment(day).date() === now.day() + 1 ? 'current' : '';
                    // set active class for currently selected date
                    const isActive =
                      moment(day).format('YYYYMMDD') ===
                      moment(selectedDate).format('YYYYMMDD')
                        ? 'active'
                        : '';
                    // if range type is infinite don't add days outside the month
                    if (calendar.months[moment(day).month()] !== month) {
                      return (
                        <div
                          key={`${key}-empty-${i}`}
                          className={[
                            'empty calendar-day',
                            dataWrapperClass
                          ].join(' ')}
                        ></div>
                      );
                    }
                    return (
                      <div key={`calendar-set-${i}`} className="relative">
                        {day.date() === 1 ? (
                          <div className="calendar-month-label">
                            <Typography
                              typeClass={[
                                'absolute -top-7',
                                i + (1 % 7) === 1
                                  ? 'left-0'
                                  : i + (1 % 7) === 7
                                  ? 'right-0'
                                  : 'left-1/2 -translate-x-1/2'
                              ]}
                              content={calendar.months[day.month()]}
                              usage="headingSmall"
                            />
                          </div>
                        ) : (
                          <></>
                        )}
                        <div
                          className={[
                            'calendar-day',
                            isCurrent,
                            // calendarStyle === 'default' ? isInactive : '',
                            dataWrapperClass
                          ].join(' ')}
                        >
                          <Button
                            buttonType="btn-tertiary"
                            label={moment(day).format('D').toString()}
                            className={[
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
                              content={moment(day).format('D').toString()}
                            />
                          </Button>
                          {isActive ? (
                            <div className="active-day-indicator"></div>
                          ) : (
                            <></>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              );
            })}
        </div>
      </div>
    </div>
  );

  return Calendar;
};
