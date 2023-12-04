import { Dialog } from '@capacitor/dialog';
import { Anchor } from 'Components/Anchor/Anchor';
import { Button } from 'Components/Button/Button';
import { Toast } from 'Components/Toast/Toast';
import { Typography } from 'Components/Typography/Typography';
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth';
import { useUserHabits } from 'helpers/stateHelper';
import { SyncHelper } from 'helpers/syncHelper';
import NetworkHelper from 'helpers/web/networkHelper';
import { ReactElement, useState } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { clearData, setDataFieldWithID } from 'slices/dataSlice';
import { clearData as clearHabit } from 'slices/habitSlice';
import { clearData as clearUser } from 'slices/userSlice';
import './ResetData.scss';

export const ResetData = (props: any): ReactElement => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const auth = getAuth();
  const [loading, setLoading] = useState(false);
  const [errorToasts, setErrorToasts] = useState<ReactElement[]>([]);
  const { habits } = useUserHabits();

  const onDelete = async () => {
    let tempErrorToasts: ReactElement[] = [];
    setLoading(true);
    if (auth) {
      const user = auth.currentUser;
      if (user && !user.isAnonymous) {
        const { value } = await Dialog.prompt({
          title: 'Enter account password to verify this action',
          message: 'Sensitive account actions require password confirmation.',
          inputPlaceholder: 'Password'
        });
        if (!value) {
          setLoading(false);
          return;
        }
        try {
          await signInWithEmailAndPassword(
            auth,
            auth.currentUser?.email ?? '',
            value
          );
        } catch (error) {
          console.log(error);
          let newToast = (
            <Toast
              content={'Authentication unsuccessful. Please try again.'}
              key={'auth' + Date.now().toString()}
              type="error"
              fadeOut
            />
          );
          tempErrorToasts.push(newToast);
          setErrorToasts(tempErrorToasts);
          setLoading(false);
          return;
        }
      }
    }

    // await Promise.all(habits?.map((habit) => SyncHelper.removeHabit(habit)));
    // await Promise.all(
    //   satisfactions?.map((item) => networkHelper.deleteSatisfactions(item.id))
    // );
    // Gotta remove all those pending notifications
    await SyncHelper.removeNotifications(habits);

    await NetworkHelper.clearData();
    await SyncHelper.clearState();

    dispatch(clearData);
    dispatch(clearHabit);
    dispatch(clearUser);
    dispatch(setDataFieldWithID({ id: 'onboardingDone', value: false }));

    await SyncHelper.refreshState();

    setLoading(false);
    navigate('/');
  };

  return (
    <div id="followUs" className="container h-100 mx-auto text-left">
      <div id="followUsHeader" className="w-full inline-flex">
        <div className="header-controls w-full grid grid-cols-5 pt-6 pb-6">
          <div className="col-span-1 text-left">
            <Anchor label="Back" onClick={() => navigate(-1)} />
          </div>
          <div className="col-span-3 flex justify-center items-center">
            <Typography content="Reset your data" usage="headingSmall" />
          </div>
        </div>
      </div>

      <Typography usage="body">
        Resetting your data will remove all of your habit data including your
        progress and will prompt you to start over. Alternatively, you can
        archive individual habits under the habit’s Status if you want to keep a
        record of your progress.
      </Typography>

      <div className="w-3/4 mx-auto pt-6">
        <Button
          onClick={onDelete}
          loading={loading}
          disabled={loading}
          label="Reset data"
        />
      </div>

      <div className="bottom-toast-div">
        {errorToasts.map((error) => {
          return error;
        })}
      </div>
    </div>
  );
};
