/* eslint-disable no-restricted-globals */
import { Button } from 'Components/Button/Button';
import { getAuth } from 'firebase/auth';
//import NetworkHelper from "helpers/web/networkHelper";
import { ReactElement, useState } from 'react';
//import { useSelector } from "react-redux";
import { useNavigate } from 'react-router-dom';
//import { getData } from "slices/dataSlice";

import './CustomHabit.scss';

export const CustomHabit = (props: any): ReactElement => {
  let scheduleStr: string = '';
  let timeStr: string = '';
  let nameStr: string = '';
  const navigate = useNavigate();
  //const { data } = useSelector(getData);
  const [error, setError] = useState('');

  let sundaySelected: boolean = false;
  let mondaySelected: boolean = false;
  let tuesdaySelected: boolean = false;
  let wednesdaySelected: boolean = false;
  let thursdaySelected: boolean = false;
  let fridaySelected: boolean = false;
  let saturdaySelected: boolean = false;

  const switchSelected = (value: boolean): boolean => {
    console.log(value);
    return !value;
  };

  const onNameChanged = (event: any) => {
    nameStr = event.target.value;
  };

  const onTimeChange = (e: any) => {
    timeStr = e.target.value;
    console.log(timeStr);
  };

  const onSubmit = () => {
    setError('');
    const auth = getAuth();

    if (auth.currentUser !== null) {
      // const userID = auth.currentUser.uid;
      // const habitTitle = nameStr;
      // const habitPillar = data.currentPillar;

      if (timeStr === '') {
        setError('Please enter time value');
      } else if (nameStr === '') {
        setError('Please enter habit name');
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

        console.log(scheduleStr);
        //const result = NetworkHelper.scheduleHabit(userID, habitTitle, habitPillar.toLowerCase(), scheduleStr, false, 1);
        //console.log(result);
        navigate('/trackingPillar');
      }
    }
  };

  return (
    <div>
      <h1 className="pt-4 text-2xl mb-4 text-center font-bold">
        Create Custom
      </h1>
      <br />
      <div className="text-center">
        <p>
          Create reminders for yourself of exercise activities that we haven't
          highlighted using the tool below.
        </p>
      </div>
      <br />
      <div className="text-left px-4">
        <h1>Label</h1>
      </div>
      <div>
        <input
          data-testid="name"
          className="box-width"
          type={'text'}
          onChange={() => onNameChanged(event)}
        />
      </div>
      <br />
      <p className="text-left">Reminder days of the week</p>
      <div className="flex flex-row">
        <div className="flex-1">
          <Button
            label="S"
            buttonClass={['rounded-full']}
            onClick={() => (sundaySelected = switchSelected(sundaySelected))}
          />
        </div>
        <div className="flex-1">
          <Button
            label="M"
            buttonClass={['rounded-full']}
            onClick={() => (mondaySelected = switchSelected(mondaySelected))}
          />
        </div>
        <div className="flex-1">
          <Button
            label="T"
            buttonClass={['rounded-full']}
            onClick={() => (tuesdaySelected = switchSelected(tuesdaySelected))}
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
            onClick={() => (fridaySelected = switchSelected(fridaySelected))}
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
          data-testid="time"
          id="time"
          type={'time'}
          required
          onChange={() => onTimeChange(event)}
        />
      </div>
      <div className="text-center">
        <Button label="Create habit" onClick={onSubmit} />
      </div>
      <br />
      <br />
      <div className="text-center">{error}</div>
    </div>
  );
};
