import { Capacitor } from '@capacitor/core';
import { BottomSheetHeader } from 'Components/BottomSheetHeader/BottomSheetHeader';
import { IconFrame } from 'Components/IconFrame/IconFrame';
import { ListGroup } from 'Components/ListGroup/ListGroup';
import { ListItem } from 'Components/ListItem/ListItem';
import { PageWrapper } from 'Components/PageWrapper/PageWrapper';
import { ProgressBrain } from 'Components/ProgressBrain/ProgressBrain';
import { Typography } from 'Components/Typography/Typography';
import { getAuth } from 'firebase/auth';
import NotificationHelper from 'helpers/notificationHelper';
import { useEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { BottomSheet } from 'react-spring-bottom-sheet';
import {
  getData,
  loadNotifications,
  setDataFieldWithID
} from 'slices/dataSlice';
import store from 'store/store';
import { DialogProps, NotificationItem } from 'types/types';
import { ReactComponent as NotificationSVG } from '../../img/notifications.svg';
import { NotificationDetailBottomSheet } from './NotificationDetailsBottomSheet';

export const NotificationBottomSheet = ({ open, setOpen }: DialogProps) => {
  const platform = Capacitor.getPlatform();
  const navigate = useNavigate();
  const auth = getAuth();
  const { data } = useSelector(getData);
  const { notifications } = data;
  const dispatch = useDispatch();
  const [showRequestPushNotification, setShowRequestPushNotification] =
    useState(false);
  const [showCreateAccount, setShowCreateAccount] = useState(false);
  const [notificationDetailOpen, setNotificationDetailOpen] = useState(false);
  const [notification, setNotifcation] = useState<NotificationItem>();

  useEffect(() => {
    const checkPermissions = async () => {
      const permissions = await NotificationHelper.getNotificationPermissions();
      console.log('permissions', permissions);
      if (permissions === 'prompt' || permissions === 'denied') {
        setShowRequestPushNotification(true);
      }
    };

    const checkAccount = () => {
      const user = auth.currentUser;
      if (user && !user.isAnonymous) {
        setShowCreateAccount(false);
      } else {
        setShowCreateAccount(true);
      }
    };

    if (platform !== 'web') {
      checkPermissions();
    }
    checkAccount();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  const handleCreateAccount = async () => {
    setOpen(false);
    navigate('/signup');
    dispatch(setDataFieldWithID({ id: 'signupClicked', value: true }));
  };

  const itemsArray = useMemo(() => {
    const items = [];

    if (showCreateAccount) {
      items.push(
        <ListItem
          label="Create your account"
          sublabel="Backup and sync your BrainFit data"
          prefix={<IconFrame Icon={() => <ProgressBrain id='createAccount' progress={100} />} smallIcon />}
          chevron={true}
          notificationDot={!data.signupClicked}
          onClick={handleCreateAccount}
        />
      );
    }

    if (showRequestPushNotification) {
      items.push(
        <ListItem
          label="Enable notifications"
          sublabel="Receive reminders for your scheduled habits"
          prefix={<IconFrame Icon={NotificationSVG} smallIcon />}
          chevron={true}
          notificationDot={!data.enableNotificationClicked}
          onClick={async () => {
            dispatch(
              setDataFieldWithID({
                id: 'enableNotificationClicked',
                value: true
              })
            );
            await NotificationHelper.registerNotifications();
            let permissions =
              await NotificationHelper.getNotificationPermissions();
            if (permissions === 'granted') {
              await NotificationHelper.addListeners();
              setShowRequestPushNotification(false);
            }
          }}
        />
      );
    }

    //TODO: Add this when functionality is ready
    // items.push(<ListItem label="Daily Digest" sublabel="View a summary of your goals for today" prefix={<IconFrame Icon={NotificationSVG} />} chevron={true} notificationDot={!data.dailyDigestClicked} onClick={() => {
    //   dispatch(setDataFieldWithID({ id: 'dailyDigestClicked', value: true }));
    // }}
    // />)

    if (notifications && notifications.length > 0) {
      notifications.forEach((notification: NotificationItem, index: number) => {
        items.push(
          <ListItem
            label={notification.title}
            sublabel={notification.subtitle || ''}
            prefix={<IconFrame Icon={NotificationSVG} />}
            chevron={true}
            onClick={() => {
              setNotifcation({ ...notification });
              setNotificationDetailOpen(true);
            }}
            notificationDot={!notification.read}
          />
        );
      });
    }

    return items;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [notifications, showRequestPushNotification, showCreateAccount]);

  const dismissNotification = (id: any) => {
    console.log('dismiss notification');
    const temp = [
      ...notifications.filter((item: NotificationItem) => item.id !== id)
    ];
    store.dispatch(loadNotifications(temp));
    setNotificationDetailOpen(false);
  };

  return (
    <>
      {notification && (
        <NotificationDetailBottomSheet
          open={notificationDetailOpen}
          setOpen={setNotificationDetailOpen}
          onDismissClick={dismissNotification}
          notification={notification}
        />
      )}
      <BottomSheet
        id="notificationBottomSheet"
        className="z-50 pb-10 h-screen"
        open={open}
        defaultSnap={({ maxHeight }) => maxHeight * 0.94}
        snapPoints={({ maxHeight }) => [
          maxHeight * 0.94
        ]}
        header={
          <BottomSheetHeader title='Notifications' leftSideActionLabel='Done' leftSideActionOnClick={() => setOpen(false)} />
        }
      >
        <PageWrapper sidesOnly>
          <div id="notificationContent" className="w-full block mt-4">
            {
              itemsArray && itemsArray.length > 0 ? (
                <ListGroup items={itemsArray} />
              ) : (
                <Typography typeClass={['text-center mt-10']} usage='captionRegular' content='No Notifications' />
              )
            }
          </div>
        </PageWrapper>
      </BottomSheet>
    </>
  );
};
