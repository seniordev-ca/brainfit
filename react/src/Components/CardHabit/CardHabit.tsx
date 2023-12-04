import { Card } from 'Components/Card/Card';
import { ProgressIcon } from 'Components/ProgressIcon/ProgressIcon';
import { Typography } from 'Components/Typography/Typography';
import './CardHabit.scss';

import { habitIcon as utilHabitIcon } from 'helpers/utils';
import { HabitPillar } from 'types/types';
import { ReactComponent as Tut1Arrow } from '../../img/tut1Arrow.svg';
import { ReactComponent as Tut2Arrow } from '../../img/tut2Arrow.svg';

interface CardHabitProps {
  habitName?: string;
  habitStatus?: string;
  habitPillar?: HabitPillar | undefined;
  habitColour?:
    | 'default'
    | HabitPillar
    | 'purple'
    | 'pink'
    | 'red'
    | 'orange'
    | 'yellow'
    | 'teal'
    | 'green'
    | 'blue'
    | 'lightBlue'
    | 'brown'
    | 'grey'
    | 'black';
  habitIcon: string;
  habitProgress?: number;
  showTutorial?: boolean;
  onClickIcon?: () => void;
  onClickCard?: () => void;
  challenge?: string;
  cardScreen?: boolean;
  overlimit?: boolean;
  multiplePillars: boolean;
}

export const CardHabit = function ({
  habitName,
  habitStatus,
  habitPillar,
  habitColour,
  habitIcon,
  habitProgress,
  showTutorial,
  onClickIcon,
  onClickCard,
  challenge,
  cardScreen,
  overlimit = false,

  multiplePillars,
  ...props
}: CardHabitProps) {
  const onClickProgress = (e: any) => {
    e.stopPropagation();
    if (onClickIcon) {
      onClickIcon();
    }
  };

  return (
    <div
      className={[
        'cardHabit_tutorialOverlay',
        showTutorial ? 'active' : ''
      ].join(' ')}
    >
      <Card
        cardType="card-actionable"
        cardClass={['tut1']}
        cardScreen={cardScreen}
        onClick={onClickCard}
      >
        {/* Card tutorial */}
        <div className="tut1Content flex flex-col">
          <Tut1Arrow className="m-auto" />
          <Typography usage="headingSmall" typeClass={['text-center']}>
            Tap the card to see more details
          </Typography>
        </div>

        <div className="flex flex-rows tut2">
          <div className="progressIcon_container" onClick={onClickProgress}>
            <ProgressIcon
              context="onWhite"
              gradientClass={overlimit ? 'overlimit' : ''}
              progress={habitProgress}
              habitColour={habitColour}
              Icon={() =>
                utilHabitIcon(
                  habitColour || 'lightBlue',
                  [habitPillar || 'Exercise'],
                  habitIcon
                )
              }
            />
            {/* ProgressIcon Tutorial */}
            <div className="tut2Content flex flex-col">
              <Tut2Arrow className="ml-4" />
              <Typography usage="headingSmall" typeClass={['text-center']}>
                Tap the icon to update your progress
              </Typography>
            </div>
          </div>
          <div className="habitText_container">
            <Typography usage="headingSmall" typeClass={['line-clamp-2']} content={habitName} />
            <Typography
              usage="captionRegular"
              typeClass={[
                'habitStatus',
                overlimit
                  ? '!text-mom_lightMode_text-overMaximum !dark:text-mom_darkMode_text-overMaximum'
                  : ''
              ]}
              content={habitStatus}
            />
            <Typography
              usage="captionRegular"
              typeClass={['habitPillar']}
              content={`${multiplePillars ? 'Multiple Pillars' : habitPillar}${
                challenge ? ` • Challenge` : ''
              } `}
            />
          </div>
        </div>
      </Card>
    </div>
  );
};
