import './SignUp.scss';

import { Form } from 'Components/Form/Form';
import { InputProps } from 'Components/Input/Input';

import { Typography } from 'Components/Typography/Typography';
import { validationSchemas } from 'constants/validation';

import { createUserWithEmailAndPassword, getAuth } from 'firebase/auth';
import NetworkHelper from 'helpers/web/networkHelper';
import { ReactElement, useContext, useState } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { answerQuestion, setDataFieldWithID } from 'slices/dataSlice';
import { ReactComponent as InputEmailSVG } from '../../img/icon_inputEmail.svg';
import { ReactComponent as InputPasswordSVG } from '../../img/icon_inputPassword.svg';
import { ReactComponent as InputUserSVG } from '../../img/icon_inputUser.svg';
import './SignUp.scss';
import { Toast } from 'Components/Toast/Toast';
import { SignUpContext } from 'contexts/signup.context';
import { Anchor } from 'Components/Anchor/Anchor';
import { SyncHelper } from 'helpers/syncHelper';

export const SignUp = (props: any): ReactElement => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [errorToasts, setErrorToasts] = useState<ReactElement[]>([]);
  const [disabled, setDisabled] = useState(false);

  const { setInterfaceOpen } = useContext(SignUpContext);

  const resetErrorMessages = () => {
    setErrorToasts([]);
  };

  const onSubmit = async (formObj: any) => {
    setDisabled(true);
    resetErrorMessages();
    const validator = validationSchemas['signup'];
    const passwordValue = formObj['password'] || '';
    const emailValue = formObj['email'] || '';
    const nameValue = formObj['name'] || '';

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

        setErrorToasts(tempErrorToastArray);
      }
      setDisabled(false);
      return false; // prevent form submission
    } else {
      resetErrorMessages();
      signUpUser(emailValue, passwordValue, nameValue);
    }
  };

  const signUpUser = (
    email: string,
    passwordValue: string,
    nameValue: string
  ) => {
    const auth = getAuth();
    if (auth != null) {
      if (auth.currentUser != null) {
        const anonUID = auth.currentUser?.isAnonymous
          ? auth.currentUser.uid
          : null;

        createUserWithEmailAndPassword(auth, email, passwordValue)
          .then(async (creds) => {
            console.log('Auth signed up', creds);
            await NetworkHelper.registerUser(email);
            dispatch(setDataFieldWithID({ id: 'signedIn', value: true }));
            dispatch(setDataFieldWithID({ id: 'email', value: email }));
            dispatch(answerQuestion({ answerIndex: 0, value: nameValue }));

            if (anonUID) {
              await NetworkHelper.mergeUser(anonUID);
              await SyncHelper.refreshState();
            }

            const onboardingData = await NetworkHelper.getOnboardingData();
            if (onboardingData?.length > 0) {
              const { name, pillars } = onboardingData[0].Onboarding;
              dispatch(
                setDataFieldWithID({ id: 'onboardingDone', value: true })
              );
              dispatch(answerQuestion({ answerIndex: 0, value: name }));
              dispatch(answerQuestion({ answerIndex: 2, value: pillars }));
            } else {
              dispatch(
                setDataFieldWithID({ id: 'onboardingDone', value: false })
              );
            }

            console.log('Auth Anonymous account successfully upgraded');
            navigate('/');
          })
          .catch((error) => {
            console.log('Auth rejected create', error);
            console.log(error);
            let newToast = (
              <Toast
                type="error"
                content="An account already exists under that email"
                fadeOut
              />
            );
            setDisabled(false);
            setErrorToasts([newToast]);
          });

        // linkWithCredential(auth.currentUser, credential)
        //   .then(async () => {
        //     await NetworkHelper.registerUser(email);
        //     dispatch(setDataFieldWithID({ id: 'signedIn', value: true }));

        //     const curUid = getAuth().currentUser;

        //     console.log('user', curUid, anonUID);
        //     if (anonUID) {
        //       await NetworkHelper.mergeUser(anonUID);
        //       // await refresh();
        //     }

        //     console.log('Anonymous account successfully upgraded');
        //     navigate('/');
        //   })
        //   .catch((error) => {
        //     let newToast = (
        //       <Toast
        //         type="error"
        //         content="An account already exists under that email"
        //         fadeOut
        //       />
        //     );
        //     setErrorToasts([newToast]);
        //   });
      } else {
        console.log('Auth sign up has no user!', auth.currentUser);
      }
    }
  };

  const inputFields: InputProps[] = [
    {
      type: 'text',
      id: 'name',
      placeholder: 'Name',
      prefix: <InputUserSVG />,
      required: true
    },
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
    // {
    //   type: 'password',
    //   id: 'confirmPassword',
    //   placeholder: 'Confirm Password',
    //   required: true,
    //   prefix: <InputPasswordSVG />
    // }
  ];

  return (
    <>
      <div id="sign-up-page" className="h-screen relative">
        <div className="flex justify-between max-w-md mx-auto pt-4">
          <Anchor
            label={<Typography content="Back" usage="body" />}
            onClick={() => navigate(-1)}
          />
          <Anchor
            label={<Typography content="Sign in" usage="headingSmall" />}
            onClick={() => navigate('/login')}
          />
        </div>
        <Typography
          typeClass={['text-left max-w-md mx-auto my-4']}
          usage={'headingMedium'}
          content={'Create your account'}
        />
        <Typography
          typeClass={['text-left max-w-md mx-auto mb-4']}
          usage="captionRegular"
          content="Track your brain health habits across mobile devices and back up your data with a BrainFit account."
        />
        <Form
          hideCancel
          loading={disabled}
          inputFields={inputFields}
          submitLabel="Sign up"
          valuesOnSubmit
          onSubmit={onSubmit}
        ></Form>
        <div className="bottom-toast-div">
          {errorToasts.map((error) => {
            return error;
          })}
        </div>
        <div className="absolute bottom-10 left-0 right-0 mx-14">
          <Typography
            typeClass={['inline']}
            usage="captionMedium"
            content={'By signing up you agree to our'}
          />
          <Anchor
            onClick={() => setInterfaceOpen('termsScreenOpen', true)}
            label={
              <Typography
                typeClass={['inline']}
                content="Terms of Service and Privacy Policy"
                usage="captionMedium"
              />
            }
          />
        </div>
      </div>
    </>
  );
};
