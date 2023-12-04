import { Dialog } from '@capacitor/dialog';
import { Button } from 'Components/Button/Button';
import { PageWrapper } from 'Components/PageWrapper/PageWrapper';
import { Typography } from 'Components/Typography/Typography';
import { useChallenges } from 'helpers/stateHelper';
import { SyncHelper } from 'helpers/syncHelper';
import { ReactComponent as CompleteIcon } from 'img/icon_challenge_complete.svg';
import { ReactComponent as FailIcon } from 'img/icon_challenge_fail.svg';
import moment from 'moment';
import { useState } from 'react';
import { BottomSheet } from 'react-spring-bottom-sheet';
import { Challenge, DialogProps } from 'types/types';
import { ChallengeDetailsSheet } from './ChallengeDetailsSheet';

function FailureSheet({
  challenge,
  onRestartClick,
  onSelectClick
}: {
  challenge: Challenge;
  onRestartClick: () => void;
  onSelectClick: () => void;
}) {
  return (
    <>
      <FailIcon width={94} height={94} />
      <Typography
        usage="headingMedium"
        content={'Oops! You missed this challenge'}
      />
      <Typography usage="captionRegular">
        <p>
          We still believe in you, though. You can restart the{' '}
          <strong>{challenge.title}</strong> challenge again, or you can choose
          a different one.
        </p>
      </Typography>
      <Button buttonType="btn-primary" onClick={onRestartClick}>
        Restart
      </Button>
      <Button buttonType="btn-tertiary" onClick={onSelectClick}>
        Choose a different one
      </Button>
    </>
  );
}
function CompleteSheet({
  challenge,
  onShareClick,
  onDismissClick
}: {
  challenge: Challenge;
  onShareClick: () => void;
  onDismissClick: () => void;
}) {
  return (
    <>
      <CompleteIcon width={120} height={120} />
      <Typography
        usage="headingMedium"
        content={'You completed a challenge!'}
      />
      <Typography
        usage="captionRegular"
        content={`You received this award for completing the ${challenge.title} challenge`}
      />
      <Button buttonType="btn-primary" onClick={onShareClick}>
        Share
      </Button>
      <Button buttonType="btn-tertiary" onClick={onDismissClick}>
        Dismiss
      </Button>
    </>
  );
}

export function ChallengeEndedBottomSheet({
  open,
  setOpen,
  challenge,
  success
}: DialogProps & {
  challenge: Challenge;
  success: boolean;
}) {
  const { acknowledgeFailed, acknowledgeCompleted } = useChallenges();

  const [detailOpen, setDetailOpen] = useState(false);

  async function dismiss() {
    const { value } = await Dialog.confirm({
      message: 'Would you like to preserve the habits from this challenge?'
    });

    SyncHelper.endChallenge(challenge, value);
    if (success) {
      acknowledgeCompleted(challenge.id);
    } else {
      acknowledgeFailed(challenge.id);
    }

    setOpen(false);
  }

  async function restart() {
    if (!challenge.challengeHabits.length) {
      return;
    }
    // const habits = [...challenge.challengeHabits];

    // Invalidate our habits
    // habits.forEach((c) => {
    //   c.challengeID = '';
    //   c.status = 'Archived';
    // });

    // // This will go ahead and make those challenges marked as archived.
    // SyncHelper.putManyHabits(habits);

    SyncHelper.endChallenge(challenge, false);

    const newStart = moment().startOf('day').valueOf();
    const newEnd = moment(newStart)
      .add(challenge.duration, challenge.frequency)
      .endOf('day')
      .valueOf();

    // Remove the ids so they get added as a fresh challenge.
    challenge.challengeHabits.forEach((c) => {
      c.id = '';
      c.challengeID = challenge.id;
      c.startDate = newStart;
      c.endDate = newEnd;
      // I changed it earlier.
      c.status = 'Active';
    });

    // // Change the start and end on our challenge
    challenge.startDate = newStart;
    challenge.endDate = newEnd;
    // // We're active again it's a "new" challenge.
    challenge.active = true;

    SyncHelper.takeChallenge(challenge);

    // Acknowledge our weakness.
    acknowledgeFailed(challenge.id);

    setOpen(false);
  }

  return (
    <>
      <BottomSheet open={open}>
        <PageWrapper sidesOnly>
          <div
            className={
              'flex flex-col items-center content-center space-y-4 text-center'
            }
          >
            {success ? (
              <CompleteSheet
                challenge={challenge}
                onDismissClick={dismiss}
                onShareClick={() => {}}
              />
            ) : (
              <></>
            )}
            {!success ? (
              <FailureSheet
                challenge={challenge}
                onRestartClick={restart}
                onSelectClick={dismiss}
              />
            ) : (
              <></>
            )}
          </div>
        </PageWrapper>
      </BottomSheet>
      <ChallengeDetailsSheet
        challenge={challenge}
        open={detailOpen}
        setOpen={setDetailOpen}
      />
    </>
  );
}
