import { Button } from "Components/Button/Button";
import { Input } from "Components/Input/Input";
import { ListGroup } from "Components/ListGroup/ListGroup";
import { ListItem } from "Components/ListItem/ListItem";
import { Toast } from "Components/Toast/Toast";
import { Typography } from "Components/Typography/Typography";
import { Anchor } from 'Components/Anchor/Anchor';
import { validationSchemas } from "constants/validation";
import { getAuth, signInWithEmailAndPassword, updateEmail } from "firebase/auth";
import { ReactElement, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { getData, setDataFieldWithID } from "slices/dataSlice";
import { ReactComponent as EmailIcon } from 'img/icon_inputEmail.svg';
import { Dialog } from '@capacitor/dialog';

import './ChangeEmail.scss';


export const ChangeEmail = (props: any): ReactElement => {
  const auth = getAuth();
  const [userEmail, setUserEmail] = useState(auth?.currentUser?.email ?? '');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { data } = useSelector(getData);
  const [errorToasts, setErrorToasts] = useState<ReactElement[]>([]);

  const onSubmit = async () => {
    setErrorToasts([]);
    setLoading(true);
    const validator = validationSchemas['reset'];

    const formObj = {
      email: userEmail
    }

    const { error } = validator.validate(formObj, {
      abortEarly: false
    });

    let tempErrorToasts: ReactElement[] = [];

    if (error) {
      for (const row of error.details) {
        let newToast = <Toast content={row.message} key={row.message + Date.now().toString()} type='error' fadeOut />
        tempErrorToasts.push(newToast);
      }
      setLoading(false);
      setErrorToasts(tempErrorToasts);
      return false;
    } else {
      const auth = getAuth();
      const { value } = await Dialog.prompt({
        title: 'Enter account password to verify this action',
        message: 'Sensitive account actions require password confirmation.',
        inputPlaceholder: 'Password'
      })

      if (value && data.email) {
        // var actionCodeSettings: ActionCodeSettings = {
        //   url: "dev.mindovermatterapp.org",
        //   iOS: {
        //     bundleId: 'co.bitbakery.MindOverMatter'
        //   },
        //   android: {
        //     packageName: 'co.bitbakery.MindOverMatter',
        //     installApp: false
        //   },
        //   handleCodeInApp: true,
        //   // When multiple custom dynamic link domains are defined, specify which
        //   // one to use.
        // };

        try {
          await signInWithEmailAndPassword(auth, auth.currentUser?.email ?? '', value).then(async (userCredential) => {
            await updateEmail(userCredential.user, userEmail);
            // await sendEmailVerification(userCredential.user, actionCodeSettings);
            dispatch(setDataFieldWithID({ id: 'email', value: userEmail }));
          });
          dispatch(setDataFieldWithID({ id: 'isToast', value: true }));
          dispatch(setDataFieldWithID({ id: 'toastValue', value: 'Email change confirmed.' }));
          navigate(-1);
        } catch (error) {
          console.log(error)
          let newToast = <Toast content={'Authentication unsuccessful. Please try again.'} key={'auth' + Date.now().toString()} type='error' fadeOut />
          tempErrorToasts.push(newToast);
          setErrorToasts(tempErrorToasts);
        }
      }
      setLoading(false);
    }
  }

  return (
    <div>
      <div id='changeEmailHeader' className='w-full inline-flex'>
        <div className='header-controls w-full grid grid-cols-5 pt-6 pb-8'>
          <div className='col-span-1 text-left'>
            <Anchor label="Back" onClick={() => navigate(-1)} />
          </div>
          <div className='col-span-3 flex justify-center items-center'>
            <Typography
              content='Change Email'
              usage='headingSmall' />
          </div>
        </div>
      </div>
      <div className="max-w-md mx-auto">
        <ListGroup items={[
          <ListItem
            prefix={<EmailIcon />}
            label={
              <Input
                placeholder="New email address"
                value={userEmail}
                type="email"
                id="email"
                onChange={(e: any) => { setUserEmail(e.target.value) }}
              />
            }
          />
        ]} />
        <br />
        <Button
          onClick={onSubmit}
          loading={loading}
          disabled={loading || userEmail.length === 0 || auth.currentUser?.email === userEmail}
          label="Send confirmation link"
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