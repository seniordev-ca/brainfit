import { Button } from "Components/Button/Button";
import { Typography } from "Components/Typography/Typography";
import { Dialog } from '@capacitor/dialog';
import { getAuth, deleteUser, signInWithEmailAndPassword } from "firebase/auth";
import { ReactElement, useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { Anchor } from 'Components/Anchor/Anchor';
import './DeleteAccount.scss';
import { setDataFieldWithID, clearData } from "slices/dataSlice";
import { clearData as clearUserData } from 'slices/userSlice';
import { Toast } from "Components/Toast/Toast";

export const DeleteAccount = (props: any): ReactElement => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [errorToasts, setErrorToasts] = useState<ReactElement[]>([]);
  const [loading, setLoading] = useState(false);

  const onSubmit = async () => {
    const auth = getAuth();
    let tempErrorToasts: ReactElement[] = [];

    const { value } = await Dialog.prompt({
      title: 'Enter account password to verify this action',
      message: 'Sensitive account actions require password confirmation.',
      inputPlaceholder: 'Password'
    })

    if (value) {
      setLoading(true);
      try {
        await signInWithEmailAndPassword(auth, auth.currentUser?.email ?? '', value).then(async (userCredential) => {
          await deleteUser(userCredential.user);
          // await sendEmailVerification(userCredential.user, actionCodeSettings);
        });
        
        dispatch(clearUserData());
        dispatch(clearData());
        dispatch(setDataFieldWithID({ id: 'storeLoaded', value: true }));
        navigate('/');
      } catch (error) {
        console.log(error)
        let newToast = <Toast content={'Authentication unsuccessful. Please try again.'} key={'auth' + Date.now().toString()} type='error' fadeOut />
        tempErrorToasts.push(newToast);
        setErrorToasts(tempErrorToasts);
      } finally {
        setLoading(false)
      }
    }
  }

  return (
    <div>
      <div id='deleteAccountHeader' className='w-full inline-flex'>
        <div className='header-controls w-full grid grid-cols-5 pt-6 pb-8'>
          <div className='col-span-1 text-left'>
            <Anchor label="Back" onClick={() => navigate(-1)} />
          </div>
          <div className='col-span-3 flex justify-center items-center'>
            <Typography
              content='Delete your account'
              usage='headingSmall' />
          </div>
        </div>
      </div>
      <div className="max-w-md mx-auto">
        <Typography typeClass={['text-left max-w-md mx-auto mb-5']} usage='body'>
          Deleting your account will keep all of your data locally on your device. Your data will no longer sync across devices until you create another account.
        </Typography>
        <Typography typeClass={['text-left max-w-md mx-auto mb-5']} usage='body'>
          If you prefer to reset your habits data but keep your account, navigate to <span className="font-bold">Reset your data</span> in <span className="font-bold">Settings</span>.
        </Typography>
        <Button 
          onClick={onSubmit} 
          label="Delete account"
          loading={loading}
          disabledState={loading}
        />
      </div>
      <div className="bottom-toast-div">
        {errorToasts.map((error) => {
          return error;
        })}
      </div>
    </div>
  )
}