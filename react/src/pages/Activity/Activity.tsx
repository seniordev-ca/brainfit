/* eslint-disable no-restricted-globals */
import { ReactElement } from 'react';
import * as contentful from 'contentful';
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { getData } from 'slices/dataSlice';
import { Button } from 'Components/Button/Button';
import { useNavigate } from 'react-router-dom';
import parse from 'html-react-parser';
import { documentToHtmlString } from '@contentful/rich-text-html-renderer';

import './Activity.scss';
import { getAuth } from 'firebase/auth';
import { HabitContent } from 'types/types';
import { useContentful } from 'helpers/contentfulHelper';
//import NetworkHelper from "helpers/web/networkHelper";

export const Activity = (props: any): ReactElement => {
  const { data } = useSelector(getData);
  const { client } = useContentful();
  const navigate = useNavigate();

  let scheduleStr: string = '';
  let timeStr: string = '';

  let sundaySelected = false;
  let mondaySelected = false;
  let tuesdaySelected = false;
  let wednesdaySelected = false;
  let thursdaySelected = false;
  let fridaySelected = false;
  let saturdaySelected = false;

  const switchSelected = (value: boolean): boolean => {
    console.log(value);
    return !value;
  };

  const onTimeChange = (e: any) => {
    timeStr = e.target.value;
    console.log(timeStr);
  };

  const onSubmit = () => {
    const auth = getAuth();

    if (auth.currentUser !== null) {
      const habitTitle = data.currentActivity;
      //let habitPillar = "";

      for (let i = 0; i < habits.length; i++) {
        if (habitTitle === habits[i].fields.title) {
          //habitPillar = habits[i].fields.pillar;
        }
      }

      if (timeStr === '') {
        return; //TODO: WRITE OUT ERROR
      } else {
        if (sundaySelected) {
          scheduleStr = scheduleStr.concat('Su');
        }

        if (mondaySelected) {
          scheduleStr = scheduleStr.concat('Mo');
        }

        if (tuesdaySelected) {
          scheduleStr = scheduleStr.concat('Tu');
        }

        if (wednesdaySelected) {
          scheduleStr = scheduleStr.concat('We');
        }

        if (thursdaySelected) {
          scheduleStr = scheduleStr.concat('Th');
        }

        if (fridaySelected) {
          scheduleStr = scheduleStr.concat('Fr');
        }

        if (saturdaySelected) {
          scheduleStr = scheduleStr.concat('Sa');
        }

        scheduleStr = scheduleStr.concat(' ' + timeStr);

        //let habitLink = "";

        for (let i = 0; i < habits.length; i++) {
          if (habits[i].fields.title === habitTitle) {
            //habitLink = habits[i].sys.id;
            break;
          }
        }

        console.log(scheduleStr);
        //const result = NetworkHelper.scheduleHabit(habitTitle, habitPillar.toLowerCase(), scheduleStr, habitLink, false, 1);
        //console.log(result);
        navigate('/trackingPillar');
      }
    }
  };

  const [habits, setHabits] = useState<contentful.Entry<HabitContent>[]>([]);

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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div>
      {habits
        .filter((entry: any) => entry.fields.title === data.currentActivity)
        .map((entry: any) => {
          return (
            <div>
              <h1 className="pt-4 text-2xl mb-4 text-center font-bold">
                {entry.fields.title}
              </h1>
              <div className="text-left">
                <p className="inline1">
                  {parse(documentToHtmlString(entry.fields.content))}
                </p>
                {/* <img className="inline1 image" alt="img" src={img1} /> */}
              </div>
              <br />
              <p>
                <b>Get in the habit by creating a reminder</b>
              </p>
              <p>
                New habits can be difficult to create naecenas eu massa
                ullamcorper eros dictum ultricies. In fringilla non massa eget
                elementum. Cras suscipit tellus vitae dictum venenatis.
              </p>
              <br />
              <p className="text-left">Reminder days of the week</p>
              <div className="flex flex-row">
                <div className="flex-1">
                  <Button
                    label="S"
                    buttonClass={['rounded-full']}
                    onClick={() =>
                      (sundaySelected = switchSelected(sundaySelected))
                    }
                  />
                </div>
                <div className="flex-1">
                  <Button
                    label="M"
                    buttonClass={['rounded-full']}
                    onClick={() =>
                      (mondaySelected = switchSelected(mondaySelected))
                    }
                  />
                </div>
                <div className="flex-1">
                  <Button
                    label="T"
                    buttonClass={['rounded-full']}
                    onClick={() =>
                      (tuesdaySelected = switchSelected(tuesdaySelected))
                    }
                  />
                </div>
                <div className="flex-1">
                  <Button
                    label="W"
                    buttonClass={['rounded-full']}
                    onClick={() =>
                      (wednesdaySelected = switchSelected(wednesdaySelected))
                    }
                  />
                </div>
                <div className="flex-1">
                  <Button
                    label="T"
                    buttonClass={['rounded-full']}
                    onClick={() =>
                      (thursdaySelected = switchSelected(thursdaySelected))
                    }
                  />
                </div>
                <div className="flex-1">
                  <Button
                    label="F"
                    buttonClass={['rounded-full']}
                    onClick={() =>
                      (fridaySelected = switchSelected(fridaySelected))
                    }
                  />
                </div>
                <div className="flex-1">
                  <Button
                    label="S"
                    buttonClass={['rounded-full']}
                    onClick={() =>
                      (saturdaySelected = switchSelected(saturdaySelected))
                    }
                  />
                </div>
              </div>
              <br />
              <div className="flexline">
                <p>Reminder time of day</p>
                <input
                  type={'time'}
                  required
                  onChange={() => onTimeChange(event)}
                />
              </div>
              <br />
              <Button label="Create habit" onClick={onSubmit} />
            </div>
          );
        })}
    </div>
  );
};
