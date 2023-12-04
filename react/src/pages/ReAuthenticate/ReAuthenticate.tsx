import { Button } from "Components/Button/Button";
import { Input } from "Components/Input/Input";
import { Toast } from "Components/Toast/Toast";
import { Typography } from "Components/Typography/Typography";
import { validationSchemas } from "constants/validation";
import { deleteUser, EmailAuthProvider, getAuth, reauthenticateWithCredential } from "firebase/auth";
import { ReactElement, useState } from "react"
import { useNavigate } from "react-router-dom";
import EmailIcon from '../../img/icon_inputEmail.svg';
import PasswordIcon from '../../img/icon_inputPassword.svg';



export const Reauthenticate = (props: any): ReactElement => {
  const navigate = useNavigate();
  const [userEmail, setUserEmail] = useState("");
  const [password, setPassword] = useState("");
  const [formError, setFormError] = useState("");
  const [isFormError, setIsFormError] = useState(false);

  const onSubmit = async () => {
    setIsFormError(false);
    setFormError("");
    const validator = validationSchemas['signin'];

    const formObj = {
      email: userEmail,
      password: password
    }

    const { error } = validator.validate(formObj, {
      abortEarly: false
    });

    if (error) {
      for (const row of error.details) {
        if (row.path[0] === 'email') {
          console.log("Here");
          if (userEmail.length === 0) {
            setFormError('Please enter username.');
            setIsFormError(true);
            return;
          } else {
            setFormError(row.message);
            setIsFormError(true);
            return;
          }
        } else if (row.path[0] === 'password') {
          if (password.length === 0) {
            setFormError('Please enter password.');
            setIsFormError(true);
          } else {
            setFormError(row.message);
            setIsFormError(true);
          }
        }
      }
      return;
    } else {
      const auth = getAuth();
      const user = auth.currentUser;

      const credential = EmailAuthProvider.credential(userEmail, password);
      if (user) {
        try {
          await reauthenticateWithCredential(user, credential);
          await deleteUser(user);
          navigate('/onboarding');
        } catch (error) {
          setIsFormError(true);
          setFormError("Invalid credentials. Please check username and password are correct.");
          return;
        }
      }
    }
  }

  const errorUi = () => {
    if (isFormError) {
      return (
        <Toast type="error" content={formError} />
      )
    } else {
      return (<></>)
    }
  }



  return (
    <div>
      <div className="text-left">
        <span onClick={() => { navigate('/settings') }}>Cancel</span>
      </div>
      <div>
        <h1>Enter sign in information</h1>
      </div>
      <div>
        <Typography content="Please enter your email and password. Account deletion requires a recent sign-in as a security measure." />
      </div>
      <br />
      <div>
        <Input placeholder="Email" Icon={EmailIcon} value={userEmail} type="email" id={""} onChange={(e: any) => { setUserEmail(e.target.value) }} />
      </div>
      <br />
      <div>
        <Input disableState placeholder="Password" Icon={PasswordIcon} value={password} type="password" id={""} onChange={(e: any) => { setPassword(e.target.value) }} />
      </div>
      <br />
      <div>
        <Button label="Re sign-in" onClick={onSubmit} />
      </div>
      <br />
      <div>
        {errorUi()}
      </div>
    </div>
  )
}