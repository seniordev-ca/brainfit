import { Button } from "Components/Button/Button";
import { Input } from "Components/Input/Input";
import { ListGroup } from "Components/ListGroup/ListGroup";
import { ListItem } from "Components/ListItem/ListItem";
import { Toast } from "Components/Toast/Toast";
import { Typography } from "Components/Typography/Typography";
import { validationSchemas } from "constants/validation";
import { confirmPasswordReset, getAuth, verifyPasswordResetCode } from "firebase/auth";
import { ReactElement, useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { setDataFieldWithID } from "slices/dataSlice";
import { ReactComponent as PasswordIcon } from '../../img/icon_inputPassword.svg';
import './ResetPasswordContinue.scss';


export const ResetPasswordContinue = (props: any): ReactElement => {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const navigate = useNavigate();
  const [errorToasts, setErrorToasts] = useState<ReactElement[]>([]);
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);


  const onSubmit = async () => {
    setErrorToasts([]);
    setLoading(true);
    const validator = validationSchemas['newPass'];

    const formObj = {
      password: password,
      confirmPassword: confirmPassword
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
      setErrorToasts(tempErrorToasts);
      setLoading(false);
      return;
    } else {
      const auth = getAuth();
      const urlParams = new URLSearchParams(window.location.search)
      const oobCode = urlParams.get('oobCode');

      if (oobCode === null) {
        setLoading(false);
        return;
      }
      console.log("here")
      try {
        await verifyPasswordResetCode(auth, oobCode);
      } catch (error) {
        let newToast = <Toast content="Expired reset code. Please send a new reset password email." type="error" fadeOut key={Date.now().toString()} />;
        setLoading(false);
        setErrorToasts([newToast]);
        return;
      }

      let newToast = <Toast content="Successfully changed password!" type="success" key={Date.now().toString()} fadeOut />;
      setErrorToasts([newToast]);

      await confirmPasswordReset(auth, oobCode, password);
      dispatch(setDataFieldWithID({ id: 'isToast', value: true }));
      dispatch(setDataFieldWithID({ id: 'toastValue', value: 'Successfully changed password!' }));

      navigate('/login');
      setLoading(false);
    }
  }

  return (
    <div>
      <div className='clear-both h-20'>
        <div className='float-left inline'>
          <Button buttonType='btn-tertiary' label='Cancel' onClick={() => navigate(-1)} />
        </div>
      </div>
      <div className="max-w-md mx-auto">
        <Typography typeClass={['text-left max-w-md mx-auto mb-5']} usage={'headingMedium'} content={'Create new password'} />
        <Typography typeClass={['text-left max-w-md mx-auto mb-5']} usage='captionRegular' content="Please add a password that is at least 8 characters and includes at least 1 number, 1 uppercase letter, and 1 special character." />
        <ListGroup items={[
          <ListItem prefix={<PasswordIcon />} label={<Input placeholder="New password" disableState={true} value={password} type="password" id="newPassword" onChange={(e: any) => { setPassword(e.target.value) }} />} />,
          <ListItem prefix={<PasswordIcon />} label={<Input placeholder="Confirm new password" disableState={true} value={confirmPassword} id="confirmPassword" type="password" onChange={(e: any) => { setConfirmPassword(e.target.value) }} />} />
        ]} />
        <br />
        <Button onClick={onSubmit} loading={loading} disabled={loading || password.length === 0 || confirmPassword.length === 0} label="Create password" />
      </div>
      <div className="bottom-toast-div">
        {errorToasts.map((error) => {
          return error;
        })}
      </div>
    </div>
  );
}