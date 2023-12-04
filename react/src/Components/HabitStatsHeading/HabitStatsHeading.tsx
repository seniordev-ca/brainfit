import { Icon } from '@iconify/react';
import { HabitIcon } from 'Components/HabitIcon/HabitIcon';
import { Typography } from 'Components/Typography/Typography';
import { getDefaultIconFromPillars, getProperHabitCss } from 'helpers/utils';
import { ReactElement } from 'react';
import { HabitPillar } from 'types/types';

interface HabitStatsHeadingProps {
  habitName: string;
  habitPillar: HabitPillar;
  habitColour:
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
  habitStatus: string;
  habitIcon: string;

  onClick?: () => void;
}

export const HabitStatsHeading = function ({
  habitName,
  habitPillar,
  habitColour,
  habitIcon,
  habitStatus,
  onClick
}: HabitStatsHeadingProps) {
  const CurrentIcon = (): ReactElement => {
    const emojiRegex = /\p{Emoji}/u;
    if (habitIcon !== '') {
      if (emojiRegex.test(habitIcon)) {
        return (
          <div
            className="display-icon"
            style={{
              fontSize: '20px'
            }}
            data-testid="progressIcon"
          >
            {habitIcon}
          </div>
        );
      } else {
        return (
          <div className="display-icon">
            <Icon
              icon={habitIcon}
              width="20"
              inline={false}
              data-testid="progressIcon"
              className={`text-${getProperHabitCss(habitColour)}`}
            />
          </div>
        );
      }
    } else {
      return (
        <div
          className={
            'display-default-icon flex justify-center items-center content-center relative left-1/4 right-1/4'
          }
        >
          {getDefaultIconFromPillars([habitPillar])}
        </div>
      );
    }
  };

  return (
    <div onClick={() => onClick && onClick()}>
      <div className="flex flex-rows tut2">
        <div className="progressIcon_container">
          <HabitIcon habitColour={habitColour} Icon={CurrentIcon} />
        </div>
        <div className="habitText_container">
          <Typography usage="headingSmall" content={habitName} />
          <Typography
            usage="captionRegular"
            content={`Goal: ${habitStatus}`}
          />
          <Typography
            usage="captionRegular"
            typeClass={['habitPillar']}
            content={habitPillar}
          />
        </div>
      </div>
    </div>
  );
};
