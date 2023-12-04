import { BottomSheetHeader } from 'Components/BottomSheetHeader/BottomSheetHeader';
import { ListGroup } from 'Components/ListGroup/ListGroup';
import { ListItem } from 'Components/ListItem/ListItem';
import { PageWrapper } from 'Components/PageWrapper/PageWrapper';
import { Typography } from 'Components/Typography/Typography';
import localization from 'helpers/localizationHelper';
import { SyncHelper } from 'helpers/syncHelper';
import { BottomSheet } from 'react-spring-bottom-sheet';
import { Challenge, DialogProps } from 'types/types';

export function EndChallengeBottomSheet({
  open,
  setOpen,
  challenge,
  onEnded
}: DialogProps & {
  challenge: Challenge;
  onEnded: () => void;
}) {
  const endChallengeClicked = async (keep: boolean) => {
    await SyncHelper.endChallenge(challenge, keep);
    onEnded();
    setOpen(false);
  };

  const EndOptionsListItems = [
    <ListItem
      label={
        <span className={'font-semibold text-red-500'}> End and remove</span>
      }
      onClick={() => endChallengeClicked(false)}
    />,
    <ListItem label="End and keep" onClick={() => endChallengeClicked(true)} />,
    <ListItem label="Cancel" onClick={() => setOpen(false)} />
  ];

  return (
    <BottomSheet
      open={open}
      onDismiss={() => setOpen(false)}
      header={
        <BottomSheetHeader title="End Challenge" leftSideActionLabel="" />
      }
    >
      <PageWrapper sidesOnly>
        <div className={'py-4'}>
          <Typography
            usage="captionRegular"
            content={localization.getString('endChallengeExplainer')}
          />

          <ListGroup
            listGroupType="listGroup_primary"
            items={EndOptionsListItems}
          />
        </div>
      </PageWrapper>
    </BottomSheet>
  );
}
