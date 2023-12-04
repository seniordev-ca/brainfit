import {
  BarChartData,
  BarChartItem
} from 'Components/BarChartItem/BarChartItem';
import { Button } from 'Components/Button/Button';
import { SpiderGraph } from 'Components/SpiderGraph/SpiderGraph';
import * as contentful from 'contentful';
import { getAuth } from 'firebase/auth';
import { useContentful } from 'helpers/contentfulHelper';
import { SyncHelper } from 'helpers/syncHelper';
import { contentfulPillarsToSavedPillars } from 'helpers/utils';
import { Habit } from 'models/habit';
import moment from 'moment';
import { ReactElement, useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { getData } from 'slices/dataSlice';
import { HabitContent } from 'types/types';

export const QuestionnaireResults = function ({
  results,
  highestPillar,
  lowestPillar,
  skipped,
  resumeQuestionnaire
}: {
  results: { [key: string]: number };
  highestPillar: string;
  lowestPillar: string;
  skipped: boolean;
  resumeQuestionnaire: () => void;
}): ReactElement {
  const navigate = useNavigate();
  const userData = useSelector(getData).data;
  const { client } = useContentful();

  const resultKeys = [
    'Exercise',
    'Nutrition',
    'Mental Stimulation',
    'Stress Reduction',
    'Sleep',
    'Socialize'
  ];
  const barChartData: BarChartData[] = Object.values(results).map(
    (result, index) => {
      return {
        percentage: result,
        bgClass: 'bg-mom_purple-dark',
        color: 'red',
        label: resultKeys[index],
        width: '1rem'
      };
    }
  );

  const [habits, setHabits] = useState<contentful.Entry<HabitContent>[]>([]);
  const [selectedHabits, setSelectedHabits] = useState<string[]>([]);

  // function toggleSelectedHabit(habitID: string) {
  //   const index = selectedHabits.indexOf(habitID)

  //   if (index >= 0) {
  //     let newHabits = [...selectedHabits]
  //     newHabits.splice(index, 1)
  //     setSelectedHabits(newHabits)
  //   }
  //   else {
  //     setSelectedHabits([...selectedHabits, habitID])
  //   }
  // }

  async function continuePressed() {
    const auth = getAuth();

    if (auth.currentUser !== null) {
      for (const habit of habits) {
        if (selectedHabits.includes(habit.sys.id)) {
          await SyncHelper.putHabit(
            Habit.create({
              title: habit.fields.title,
              pillars: contentfulPillarsToSavedPillars(
                habit.fields.pillar.toLowerCase()
              ),
              cmsLink: habit.sys.id,

              frequencyUnit: 'day',
              frequencyDays: [0, 1, 2, 3, 4, 5, 6],
              frequencyUnitQuantity: 1,

              frequencySpecificDay: -1,
              frequencySpecificDate: -1,

              startDate: moment().startOf('day').valueOf(),
              endDate: moment().startOf('day').add(1, 'day').valueOf(),

              units: 'cm',
              targetValue: 1,
              dailyDigest: false,
              reminders: [],
              icon: '',
              breakHabit: false,
              description: String(habit.fields.content),
              status: 'Active',
              colour: 'red',
              id: '',
              activities: []
            })
          );
        }
      }
      if (userData.onboardingDone) {
        navigate('/');
      } else {
        navigate('/signup');
      }
    }
  }

  useEffect(() => {
    client
      .getEntries<HabitContent>({
        content_type: 'habit'
      })
      .then((data: any) => {
        console.log('Results');
        if (data.items) {
          console.log(data.items);
          const filteredHabits = data.items
            .filter(
              (entry: any) => entry.fields.pillar.toLowerCase() === lowestPillar
            )
            .splice(0, 3);
          setHabits(filteredHabits);
          setSelectedHabits(
            filteredHabits.map(
              (habit: contentful.Entry<HabitContent>) => habit.sys.id
            )
          );
          console.log(filteredHabits);
        }
      });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return (
    <div>
      <div className="text-left">
        <h1>
          <b>Your current brain health</b>
        </h1>
        <p>
          The BrainFit App uses your answers and plots them on a graph across
          the six pillars of brain health.
        </p>
        <p>
          <b>Here's how you scored:</b>
        </p>
      </div>
      <SpiderGraph results={results} />
      <br />
      <div>
        {barChartData.map((item) => {
          return (
            <BarChartItem
              key={item.label}
              horizontal={true}
              percentComplete={item.percentage}
              label={item.label}
              showPercentageLabel={true}
            />
          );
        })}
      </div>
      <br />
      <br />
      {skipped ? (
        <div className="text-left">
          <h1>
            <b>What's next?</b>
          </h1>
          <p>
            We are unable to recommend a full list of brain healthy habits as
            the questionnaire was incomplete.
            <br />
            <br />
            You can continue the questionnaire below or we can show you a
            smaller set of recommendations. You can always retake or the
            questionnaire later in Settings.
          </p>
          <Button
            buttonType="btn-primary"
            label="Complete Questionnaire"
            onClick={resumeQuestionnaire}
          />
          <br />
        </div>
      ) : (
        <div className="text-left">
          <h1>
            <b>What's next?</b>
          </h1>
          <p>
            We’ve put together a list of brain healthy habits based on how you
            scored to boost your cognitive vitality and control your brain
            health destiny.
          </p>
        </div>
      )}
      {/* 
      <div>
        <p><b>Your Suggested Habits</b></p>
        {habits.map((entry: any) => {
          return (
            <div key={entry.sys.id} className="mb-2">
              <Button buttonType={selectedHabits.includes(entry.sys.id) ? 'btn-primary' : 'btn-secondary'} label={entry.fields.title} onClick={() => toggleSelectedHabit(entry.sys.id)} />
            </div>
          )
        })}
      </div> */}
      <Button
        buttonType={skipped ? 'btn-tertiary' : 'btn-primary'}
        label="Show me my habits"
        onClick={() => continuePressed()}
      />
    </div>
  );
};
