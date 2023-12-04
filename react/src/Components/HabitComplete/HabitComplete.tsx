import { ListItem } from 'Components/ListItem/ListItem';
import { ProgressIcon } from 'Components/ProgressIcon/ProgressIcon';
import { habitIcon } from 'helpers/utils';
import { ReactComponent as InfoSVG } from 'img/iconInfoCircle.svg';
import { Habit } from 'models/habit';
import { HabitPillar } from 'types/types';
import './HabitComplete.scss';

interface HabitProps {
  title: string;
  skipped?: boolean;
  progress: number;
  Icon?: any;
  paused?: boolean;
  sublabel?: string;
  onClick?: Function;
  habit: Habit;
  colour?:
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
}

export const HabitComplete = function ({
  title,
  progress,
  skipped,
  paused,
  Icon,
  habit,
  colour = 'default',
  ...props
}: HabitProps) {
  const disabled = skipped || paused;

  return (
    <ListItem
      label={title}
      listType="list-primary"
      prefix={
        <div className="progressIcon_container"><ProgressIcon
          progressClass={`${disabled ? 'progress-prefix-disabled' : ''}`}
          Icon={() => habitIcon(habit.colour, habit.pillars, habit.icon)}
          context="inList"
          habitColour={colour}
          progress={progress}
        /></div>
      }
      suffix={<InfoSVG />}
      {...props}
    />
  );
};
