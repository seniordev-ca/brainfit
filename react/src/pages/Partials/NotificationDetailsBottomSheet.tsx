import { Button } from 'Components/Button/Button';
import { PageWrapper } from 'Components/PageWrapper/PageWrapper';
import { Typography } from 'Components/Typography/Typography';
import { ReactComponent as CompleteIcon } from 'img/icon_challenge_complete.svg';
import { BottomSheet } from 'react-spring-bottom-sheet';
import { DialogProps, NotificationItem } from 'types/types';

interface NotificationDetailBottomSheetProps extends DialogProps {
  notification: NotificationItem;
  onShareClick?: Function;
  onDismissClick?: Function;
}

export function NotificationDetailBottomSheet({
  open,
  setOpen,
  notification,
  ...props
}: NotificationDetailBottomSheetProps) {
  return (
    <>
      <BottomSheet open={open} onDismiss={() => setOpen(false)}>
        <PageWrapper sidesOnly>
          <div
            className={
              'flex flex-col items-center content-center space-y-4 text-center'
            }
          >
            <CompleteIcon width={120} height={120} />
            <Typography
              usage="headingMedium"
              content={notification.title}
            />
            <Typography
              usage="captionRegular"
              content={`${notification.subtitle}`}
            />
            <Button buttonType="btn-primary" onClick={() => props.onShareClick && props.onShareClick(notification)}>
              Share
            </Button>
            <Button buttonType="btn-tertiary" onClick={() => {
              console.log('clicked')
              props.onDismissClick && props.onDismissClick(notification.id)
            }}>
              Dismiss
            </Button>
          </div>
        </PageWrapper>
      </BottomSheet>
    </>
  );
}
