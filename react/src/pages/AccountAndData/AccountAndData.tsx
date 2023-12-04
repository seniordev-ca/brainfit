import { ReactElement, useEffect, useState, useContext } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { getAuth, signInAnonymously, signOut } from 'firebase/auth';
import { SignUpContext } from 'contexts/signup.context';
import localization from 'helpers/localizationHelper';
import { getData, setDataFieldWithID, clearData } from 'slices/dataSlice';
import { clearData as clearUserData } from 'slices/userSlice';
import { Typography } from 'Components/Typography/Typography';
import { ListItem } from 'Components/ListItem/ListItem';
import { ListGroup } from 'Components/ListGroup/ListGroup';
import { Anchor } from 'Components/Anchor/Anchor';
import { Toast } from 'Components/Toast/Toast';
import { Button } from 'Components/Button/Button';
import { SyncHelper } from 'helpers/syncHelper';

export const AccountAndData = (props: any): ReactElement => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { data } = useSelector(getData);
  const [isSignedIn, setIsSignedIn] = useState(false);
  const [errorToasts, setErrorToasts] = useState<ReactElement[]>([]);
  const auth = getAuth();
  const { setInterfaceOpen } = useContext(SignUpContext);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (auth != null) {
      const user = auth.currentUser;
      if (user && !user.isAnonymous) {
        setIsSignedIn(true);
      } else {
        setIsSignedIn(false);
      }
    }
  }, [auth]);

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

  const changeEmail = async () => {
    navigate('/changeEmail');
  };

  const logout = async () => {
    const user = auth.currentUser;
    if (user) {
      setLoading(true);
      signOut(auth)
        .then(async () => {
          dispatch(setDataFieldWithID({ id: 'email', value: null }));
          dispatch(setDataFieldWithID({ id: 'signedIn', value: null }));

          // We automatically sign in as auth when we see the state changed.
          await signInAnonymously(auth);
          await SyncHelper.clearState();

          dispatch(clearUserData());
          dispatch(clearData());
          dispatch(setDataFieldWithID({ id: 'storeLoaded', value: true }));

          setIsSignedIn(false);

          navigate('/', { replace: true });
        })
        .finally(() => {
          setLoading(false);
        });
    }
  };

  const reset = async () => {
    navigate('/reset');
  };

  function accountUI(): ReactElement[] {
    const items = [];
    if (isSignedIn) {
      items.push(
        <ListItem
          label="Change email address"
          chevron
          listType="list-primary"
          onClick={changeEmail}
        />
      );
      items.push(
        <ListItem
          label="Reset password"
          chevron
          listType="list-primary"
          onClick={reset}
        />
      );
      items.push(
        <ListItem
          label="Delete your account"
          chevron
          onClick={() => navigate('/deleteAccount')}
        />
      );
    } else {
      items.push(
        <ListItem
          label={localization.getString('createYourAccountString')}
          chevron
          onClick={() => navigate('/signup')}
        />
      );
    }
    return items;
  }

  function backupUI(): ReactElement[] {
    const items = [];
    if (isSignedIn) {
      items.push(<ListItem label="Backup and sync" chevron />);
    }
    return items;
  }

  return (
    <div id="accountAndData" className="container h-100 mx-auto text-left">
      <div id="notificationHeader" className="w-full inline-flex">
        <div className="header-controls w-full grid grid-cols-5 pt-6 pb-8">
          <div className="col-span-1 text-left">
            <Anchor label="Back" onClick={() => navigate(-1)} />
          </div>
          <div className="col-span-3 flex justify-center items-center">
            <Typography
              content={localization.getString('accountAndDataString')}
              usage="headingSmall"
            />
          </div>
        </div>
      </div>

      <div className={['flexmx-auto border-0 flex-col'].join(' ')}>
        <ListGroup
          heading={localization.getString('accountString')}
          items={[...accountUI()]}
        />
      </div>

      <div className={['flexmx-auto border-0 flex-col'].join(' ')}>
        <ListGroup
          heading={localization.getString('dataString')}
          items={[
            ...backupUI(),
            <ListItem
              label={localization.getString('resetString')}
              chevron
              listType="list-primary"
              onClick={() => navigate('/resetData')}
            />,
            <ListItem
              label="Terms and Privacy Policy"
              chevron
              listType="list-primary"
              onClick={() => setInterfaceOpen('termsScreenOpen', true)}
            />
          ]}
        />
      </div>
      {isSignedIn && (
        <Button
          type="submit"
          label="Log out of BrainFit"
          loading={loading}
          disabledState={loading}
          onClick={logout}
          buttonType="btn-tertiary"
          buttonClass={['base-form-button', 'font-bold', 'mt-2']}
        />
      )}
      {props.children}
      <div className="bottom-toast-div">
        {errorToasts.map((error) => {
          return error;
        })}
      </div>
    </div>
  );
};
