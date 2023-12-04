import { ReactElement, useEffect, useState } from 'react';
import * as contentful from 'contentful';
import { useDispatch, useSelector } from 'react-redux';
import { getData, setDataFieldWithID } from 'slices/dataSlice';
import { Habit } from 'Components/Habit/Habit';
import { getAuth } from 'firebase/auth';
import NetworkHelper from 'helpers/web/networkHelper';
import { useNavigate } from 'react-router-dom';
import { HabitContent, ScheduledHabit } from 'types/types';
import { useContentful } from 'helpers/contentfulHelper';

export const TrackingIdeas = (props: any): ReactElement => {
  const { data } = useSelector(getData);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { client } = useContentful();

  const [habits, setHabits] = useState<contentful.Entry<HabitContent>[]>([]);
  const [userHabits, setUserHabits] = useState<ScheduledHabit[]>([]);

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
      let tempHabitArray: ScheduledHabit[] = data;
      setUserHabits(tempHabitArray);
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // function moreIdeasHabitClicked() {
  //   //TODO: This will be added on upcoming ticket - will be done through dispath()
  // }

  function createCustomClicked() {
    navigate('/customHabit');
  }

  function individualHabit(habitTitle: string) {
    dispatch(setDataFieldWithID({ id: 'currentActivity', value: habitTitle }));
    navigate('/activity');
  }

  // const reactHabits: { [key: string]: HabitInterface[] } = {
  //   currentPillar: userHabits.map((userHabit) => {
  //     return { title: userHabit.Title, pillar: userHabit.Pillars, id: userHabit.ID }
  //   })
  // }

  return (
    <div className="px-4">
      <h1 className="pt-4 text-2xl mb-4 text-center font-bold">More ideas</h1>
      <div className="text-left">
        <p>
          Exercise is an important part of optimizing brain health. Here's some
          ideas to get started andelit. Pellentesque vestibulum, augue in
          eleifend venenatis, ipsum magna molestie odio, quis eleifend nunc dui
          in metus. Maecenas eu massa ullamcorper eros dictum ultricies. In
          fringilla non massa eget elementum. Cras suscipit tellus vitae dictum
          venenatis. Donec interdum mi quis maximus elementum.
        </p>
      </div>

      <div className="text-left">
        <h2>
          <b>Start new habits to optimize brain health</b>
        </h2>
      </div>

      {userHabits.map((habit) => {
        for (let i = 0; i < userHabits.length; i++) {
          let titleString = userHabits[i].Title;
          for (let j = 0; j < habits.length; j++) {
            let titleString2 = habits[j].fields.title;
            if (titleString === titleString2) {
              console.log(titleString);
              habits.splice(j, 1);
              break;
            }
          }
        }
        return <hr />;
      })}

      <ul className="text-left">
        <div>
          {habits
            .filter((entry: any) =>
              entry.fields.pillar.includes(data.currentPillar)
            )
            .map((entry: any) => {
              return (
                <Habit
                  key={entry.fields.title}
                  title={entry.fields.title}
                  onClick={() => individualHabit(entry.fields.title)}
                />
              );
            })}
        </div>

        <Habit
          bolded={true}
          title="Create Custom"
          onClick={createCustomClicked}
        />
      </ul>
    </div>
  );
};
