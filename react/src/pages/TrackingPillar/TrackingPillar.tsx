import './TrackingPillar.scss';
import { ReactElement } from 'react';
import * as contentful from 'contentful';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getData, setDataFieldWithID } from 'slices/dataSlice';

import './TrackingPillar.scss';

import { useNavigate } from 'react-router-dom';
import { Habit } from 'Components/Habit/Habit';
import NetworkHelper from 'helpers/web/networkHelper';
import { getAuth } from 'firebase/auth';
import { Calendar } from 'Components/Calendar/Calendar';
import { Capacitor } from '@capacitor/core';
import moment from 'moment';
import { HabitContent, ScheduledHabit } from 'types/types';
import { useContentful } from 'helpers/contentfulHelper';

interface HabitInterface {
  id: string;
  pillar: string;
  title: string;
}

export const TrackingPillar = (props: any): ReactElement => {
  const { data } = useSelector(getData);
  const navigate = useNavigate();
  const platform = Capacitor.getPlatform();
  const [dates, setDates] = useState({
    start: moment().startOf('week'),
    end: moment().endOf('week'),
    selected: moment()
  });
  const dispatch = useDispatch();

  const { client } = useContentful();

  const [habits, setHabits] = useState<contentful.Entry<HabitContent>[]>([]);
  const [userHabits, setUserHabits] = useState<ScheduledHabit[]>([]);
  const [isUserHabit, setIsUserHabit] = useState<boolean>(false);

  useEffect(() => {
    client
      .getEntries<HabitContent>({
        content_type: 'habit'
      })
      .then((data: any) => {
        if (data.items) {
          setHabits(data.items);
        }
      });

    async function getUserHabits() {
      const auth = getAuth();
      if (auth.currentUser != null) {
        let tempArray: any = NetworkHelper.getHabitsByPillar(
          data.currentPillar.toLowerCase(),
          false
        );
        return tempArray;
      }
      return null;
    }

    let habitArray = getUserHabits();
    habitArray.then((data) => {
      if (data != null) {
        let tempHabitArray: ScheduledHabit[] = data;
        setUserHabits(tempHabitArray);
        if (tempHabitArray.length >= 1) {
          setIsUserHabit(true);
        }
      }
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // dates changed
  useEffect(() => {
    console.log(dates);
  }, [dates]);

  const onCalendarUpdate = async (
    selectedDate: any,
    startDate: any,
    endDate: any
  ) => {
    await setDates({
      selected: selectedDate,
      start: startDate,
      end: endDate
    });
  };

  // function displayHabitDetails() {
  //   console.log(data.currentPillar);
  //   //TODO: This will be added on upcoming ticket - will be done through dispath()
  // }

  const setUserHabitMessage = (): ReactElement => {
    switch (isUserHabit) {
      case true:
        return (
          <div>
            <h1>
              <b>My habits</b>
            </h1>
            <hr />
          </div>
        );
      default:
        return <></>;
    }
  };

  const reactHabits: { [key: string]: HabitInterface[] } = {
    currentPillar: userHabits.map((userHabit) => {
      return {
        title: userHabit.Title,
        pillar: userHabit.Pillars,
        id: userHabit.ID
      };
    })
  };

  function individualHabit(habitTitle: string) {
    dispatch(setDataFieldWithID({ id: 'currentActivity', value: habitTitle }));
    navigate('/activity');
  }

  // function displayHabitDetails() {
  //   console.log(data.currentPillar);
  //   //TODO: This will be added on upcoming ticket - will be done through dispath()
  // }

  function moreIdeas() {
    navigate('/trackingIdeas');
  }

  return (
    <div id="trackingPillar" className="container mx-auto">
      <h1 className="pt-4 text-2xl mb-4 text-center font-bold">
        BrainFit
      </h1>
      <Calendar
        dayClass={platform === 'ios' ? 'w-10 h-10' : ''}
        onCalendarUpdate={onCalendarUpdate}
      />
      <br />
      <div>
        {reactHabits ? (
          Object.keys(reactHabits).map((habitKey) => {
            const habitsList = reactHabits[habitKey];
            return (
              <div key={habitKey} className="text-left">
                {setUserHabitMessage()}
                <div>
                  {habitsList.map((habit) => {
                    for (let i = 0; i < userHabits.length; i++) {
                      let titleString = userHabits[i].Title;
                      for (let j = 0; j < habits.length; j++) {
                        let titleString2 = habits[j].fields.title;
                        if (titleString === titleString2) {
                          habits.splice(j, 1);
                          break;
                        }
                      }
                    }
                    return (
                      <div>
                        <Habit
                          key={habit.title}
                          title={habit.title}
                          onClick={() => {
                            individualHabit(habit.title);
                          }}
                        />
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })
        ) : (
          <></>
        )}
      </div>

      <br />
      <div className="text-left ml-2">
        <h2>
          <b>Start new habits to optimize brain health</b>
        </h2>
      </div>

      <hr></hr>
      <div className="text-left">
        <ul>
          {habits
            .filter((entry: any) =>
              entry.fields.pillar.includes(data.currentPillar)
            )
            .splice(0, 3)
            .map((entry: any) => {
              return (
                <Habit
                  key={entry.fields.title}
                  title={entry.fields.title}
                  onClick={() => individualHabit(entry.fields.title)}
                />
              );
            })}
          <Habit bolded={true} title="More ideas" onClick={moreIdeas} />
        </ul>
      </div>
    </div>
  );
};
