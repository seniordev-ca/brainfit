import { BottomSheetHeader } from "Components/BottomSheetHeader/BottomSheetHeader";
import { Button } from "Components/Button/Button";
import { Input } from "Components/Input/Input";
import { ListGroup } from "Components/ListGroup/ListGroup";
import { ListItem } from "Components/ListItem/ListItem";
import { Toast } from "Components/Toast/Toast";
import { Typography } from "Components/Typography/Typography";
import { validationSchemas } from "constants/validation";
import { ActionCodeSettings, getAuth, sendPasswordResetEmail } from "firebase/auth";
import { ReactElement, useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { setDataFieldWithID } from "slices/dataSlice";
import { ReactComponent as EmailIcon } from '../../img/icon_inputEmail.svg';
import './ResetPassword.scss';


export const ResetPassword = (props: any): ReactElement => {
  const [userEmail, setUserEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();
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

      var actionCodeSettings: ActionCodeSettings = {
        url: "http://localhost:3000/", //TODO: UPDATE THIS
        iOS: {
          bundleId: 'co.bitbakery.MindOverMatter'
        },
        android: {
          packageName: 'co.bitbakery.MindOverMatter',
          installApp: false
        },
        handleCodeInApp: true,
        // When multiple custom dynamic link domains are defined, specify which
        // one to use.
      };
      // let newToast = <Toast type="success" content="Password reset email sent if an account with that email exists." key={Date.now().toString()} fadeOut />
      // setErrorToasts([newToast]);
      try {
        await sendPasswordResetEmail(auth, userEmail, actionCodeSettings);
      }
      catch (event) {

      }
      setLoading(false);

      dispatch(setDataFieldWithID({ id: 'isToast', value: true }));
      dispatch(setDataFieldWithID({ id: 'toastValue', value: 'Password reset email sent if an account with that email exists.' }));
      navigate('/login');
    }
  }

  return (
    <div>
      <div className='mt-4'>
        <BottomSheetHeader title={''} leftSideActionLabel='Back' leftSideActionOnClick={() => navigate(-1)} />
      </div>
      <div className="max-w-md mx-auto">
        <Typography typeClass={['text-left max-w-md mx-auto mb-5']} usage={'headingMedium'} content={'Reset password'} />
        <Typography typeClass={['text-left max-w-md mx-auto mb-5']} usage='captionRegular' content="Enter the email address associated with your BrainFit account and we'll send you an email with a link to reset your password." />
        <ListGroup items={[
          <ListItem prefix={<EmailIcon />} label={<Input placeholder="Email" value={userEmail} type="email" id={""} onChange={(e: any) => { setUserEmail(e.target.value) }} />} />
        ]} />
        <br />
        <Button onClick={onSubmit} loading={loading} disabled={loading || userEmail.length === 0} label="Send reset link" />
      </div>
      <div className="bottom-toast-div">
        {errorToasts.map((error) => {
          return error;
        })}
      </div>
    </div>
  )
}