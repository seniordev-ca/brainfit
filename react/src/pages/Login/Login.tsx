import './Login.scss';

import { Form } from 'Components/Form/Form';
import { InputProps } from 'Components/Input/Input';
import { Typography } from 'Components/Typography/Typography';
import { validationSchemas } from 'constants/validation';
import { ReactElement, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getData, setDataFieldWithID, answerQuestion } from 'slices/dataSlice';
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';
import { ReactComponent as InputEmailSVG } from '../../img/icon_inputEmail.svg';
import { ReactComponent as InputPasswordSVG } from '../../img/icon_inputPassword.svg';
import { Toast } from 'Components/Toast/Toast';
import NetworkHelper from 'helpers/web/networkHelper';
import { SyncHelper } from 'helpers/syncHelper';
import { BottomSheetHeader } from 'Components/BottomSheetHeader/BottomSheetHeader';

export const Login = (props: any): ReactElement => {
  const { data } = useSelector(getData);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [errorToasts, setErrorToasts] = useState<ReactElement[]>([]);
  const [disabled, setDisabled] = useState(false);

  const resetErrorMessages = () => {
    setErrorToasts([]);
  };

  if (data.isToast) {
    let newToast = (
      <Toast
        content={data.toastValue}
        type="success"
        fadeOut
        key={Date.now().toString()}
      />
    );
    setErrorToasts([newToast]);
    dispatch(setDataFieldWithID({ id: 'isToast', value: false }));
  }

  const onSubmit = async (formObj: any) => {
    setDisabled(true);
    const validator = validationSchemas['signin'];

    resetErrorMessages();

    const { error } = validator.validate(formObj, {
      abortEarly: false
    });
    let tempErrorArray: string[] = [];

    if (error) {
      for (const row of error.details) {
        let tempError = row.message;

        //Check to make sure new error is not already in error array
        if (!tempErrorArray.includes(tempError)) {
          console.log(row.message);
          tempErrorArray.push(row.message);
        }

        //this key is necessary for re-renders. without, only displays toasts once
        const tempDate = Date.now().toString();
        const tempDateStore = tempDate + '';

        let tempErrorToastArray: ReactElement[] = tempErrorArray.map((e) => {
          return (
            <Toast key={e + tempDateStore} type="error" content={e} fadeOut />
          );
        });
        setDisabled(false);
        setErrorToasts(tempErrorToastArray);
      }
      return false; // prevent form submission
    } else {
      try {
        await signInUser(formObj['email'], formObj['password']);
        navigate('/');
      } catch (error) {
        console.log(error);
        setDisabled(false);
        let newToast = (
          <Toast
            content="Email or password not recognized in our system. Please try another email or password."
            key={Date.now()}
            type="error"
            fadeOut
          />
        );
        setErrorToasts([newToast]);
      }
    }
  };

  const signInUser = async (email: string, password: string) => {
    const auth = getAuth();

    if (auth != null) {
      const anonUID = auth.currentUser?.isAnonymous
        ? auth.currentUser.uid
        : null;

      await signInWithEmailAndPassword(auth, email, password)
      if (anonUID) {
        await NetworkHelper.mergeUser(anonUID);
        await SyncHelper.refreshState();
      }
      const onboardingData = await NetworkHelper.getOnboardingData();

      if (onboardingData?.length > 0) {
        const { name, pillars } = onboardingData[0].Onboarding
        dispatch(setDataFieldWithID({ id: 'onboardingDone', value: true }));
        dispatch(answerQuestion({ answerIndex: 0, value: name }));
        dispatch(answerQuestion({ answerIndex: 2, value: pillars }));
      } else {
        dispatch(setDataFieldWithID({ id: 'onboardingDone', value: false }));
      }
      dispatch(setDataFieldWithID({ id: 'email', value: email }));
      dispatch(setDataFieldWithID({ id: 'signedIn', value: true }));
    }
    return;
  };

  const inputFields: InputProps[] = [
    {
      type: 'email',
      id: 'email',
      placeholder: 'Email',
      required: true,
      //errorText: emailError,
      prefix: <InputEmailSVG />
    },
    {
      type: 'password',
      id: 'password',
      placeholder: 'Password',
      required: true,
      prefix: <InputPasswordSVG />
    }
  ];

  return (
    <div id="sign-in-page">
      <div className='mt-4'>
        <BottomSheetHeader title={''} leftSideActionLabel='Back' leftSideActionOnClick={() => navigate(-1)} rightSideActionLabel="Reset Password" rightSideActionOnClick={() => navigate('/reset')} />
      </div>

      <Typography
        typeClass={['text-left max-w-md mx-auto mb-5']}
        usage={'headingMedium'}
        content={'Sign in'}
      />

      <Form
        hideCancel
        inputFields={inputFields}
        valuesOnSubmit
        onSubmit={onSubmit}
        submitLabel="Sign in"
        loading={disabled}
      ></Form>
      <div className="absolute bottom-10 left-0 right-0 mx-14">
        <Typography
          typeClass={['inline']}
          usage="captionRegular"
          content={"Don't have an account?"}
        />
        &nbsp;
        <span
          onClick={() => navigate('/signup')}
          className="font-bold text-mom_lightMode_text-primary dark:text-mom_darkMode_text-primary"
        >
          Sign up
        </span>
      </div>
      <div className="bottom-toast-div">
        {errorToasts.map((error) => {
          return error;
        })}
      </div>
    </div>
  );
};
