import './SamplePage.scss';
import { ReactElement } from 'react';
import { Button } from 'Components/Button/Button';
import storageHelper from 'helpers/storageHelper';
import { Capacitor } from '@capacitor/core';
import { useDispatch, useSelector } from 'react-redux';
import { clearData, getData, setDataFieldWithID } from 'slices/dataSlice';
import { PushNotifications } from '@capacitor/push-notifications';
/**
 * SamplePage page
 * 
 * @returns
 */
export const SamplePage = (props: any): ReactElement => {
  const { data } = useSelector(getData);
  const dispatch = useDispatch();
  const platform = Capacitor.getPlatform();

  const registerNotifications = async () => {
    let permStatus = await PushNotifications.checkPermissions();

    if (permStatus.receive === 'prompt') {
      permStatus = await PushNotifications.requestPermissions();
    }

    if (permStatus.receive !== 'granted') {
      throw new Error('User denied permissions!');
    }

    await PushNotifications.register();
  }

  // const getStepCount = async () => {
  //   try {
  //     console.log('getting step count');
  //     const platformHelper: any = await PlatformHelper.init();
  //     const result = await platformHelper.getSteps();
  //     await dispatch(setDataFieldWithID({ id: 'steps', value: result }));
  //   } catch (err) {
  //     console.error(err);
  //   }
  // }

  const addSteps = async () => {
    try {
      const steps = data.steps || 0;
      dispatch(setDataFieldWithID({ id: 'steps', value: steps + 500 }));
    } catch (err) {
      console.error(err);
    }
  }

  const clearStoredData = async () => {
    try {
      await storageHelper.removeAll();
      dispatch(clearData);
    } catch (err) {
      console.error(err);
    }
  }

  const addProp = async () => {
    try {
      if (platform !== 'web') {
        registerNotifications();
      }

    } catch (err) {
      console.error(err);
    }
  }

  const signUpMethod = () => {
    clearData(); // clear data slice data
    //navigate('/signup')
  }

  return (
    <div id="samplePage" className="text-left">
      <h1 className="pt-4 text-2xl mb-4 text-center font-bold">
        Sample Page ({platform})
      </h1><br />
      <Button buttonClass={['mb-5']} buttonType="btn-primary" onClick={signUpMethod} label="Refresh step count" /><br />
      <Button buttonClass={['mb-5']} buttonType="btn-primary" onClick={addSteps} label="steps + 500" /><br />
      <Button buttonClass={['mb-5']} buttonType="btn-primary" onClick={addProp} label="Add prop" /><br />
      <Button buttonClass={['mb-5']} buttonType="btn-primary" onClick={clearStoredData} label="Clear allstorage" /><br />
      <Button buttonClass={['mb-5']} buttonType="btn-primary" onClick={() => { storageHelper.remove('steps'); dispatch(setDataFieldWithID({ id: 'steps', value: 0 })); }} label="Remove steps" /><br />
      steps: {data?.steps}<br />
      {props.children}
    </div>
  )
};
