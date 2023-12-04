import { Card } from 'Components/Card/Card';
import { Typography } from 'Components/Typography/Typography';
import { HabitColour } from 'types/types';

import { ReactComponent as CompleetionIcon } from 'img/icon_stats_completion_nofill.svg';
import { ReactComponent as LongestIcon } from 'img/icon_stats_longest_nofill.svg';
import { ReactComponent as StreakIcon } from 'img/icon_stats_streak_nofill.svg';
import { ReactComponent as TotalIcon } from 'img/icon_stats_total_nofill.svg';
import { getClassForTextHabitColour } from 'helpers/utils';
import { Habit } from 'models/habit';

type StatsGroupProps = {
  habit: Pick<
    Habit,
    | 'icon'
    | 'pillars'
    | 'status'
    | 'title'
    | 'progress'
    | 'colour'
    | 'targetValue'
    | 'units'
  >;

  stats: {
    currentStreak: number;
    longestStreak: number;
    totalCompleted: number;
    averageCompletion: number;
  };

  className?: string;
};

type StatsDisplayProps = {
  Icon: any;
  stat: string;
  value: any;
  colour: HabitColour;
};

function StatsDisplay({ Icon, stat, value, colour }: StatsDisplayProps) {
  const className = getClassForTextHabitColour(colour);
  return (
    <Card cardType="card-notactionable" cardClass={['block text-left']}>
      <Icon
        width={24}
        height={24}
        className={`mr-1 fill-current  ${className}`}
      />
      <Typography
        typeClass={['mt-5']}
        usage="headingSmall"
        content={String(value)}
      />{' '}
      <Typography usage="captionRegular" content={stat} />{' '}
    </Card>
  );
}

export function StatsGroup({ habit, stats, className = '' }: StatsGroupProps) {
  return (
    <div className={`space-y-4 ${className}`}>
      <div className={'grid grid-cols-2 gap-4'}>
        <StatsDisplay
          Icon={StreakIcon}
          colour={habit.colour}
          stat={'Current streak'}
          value={`${stats.currentStreak} days`}
        />
        <StatsDisplay
          Icon={LongestIcon}
          colour={habit.colour}
          stat={'Longest streak'}
          value={`${stats.longestStreak} days`}
        />
        <StatsDisplay
          Icon={TotalIcon}
          colour={habit.colour}
          stat={'Done in total'}
          value={`${stats.totalCompleted} goals`}
        />
        <StatsDisplay
          Icon={CompleetionIcon}
          colour={habit.colour}
          stat={'Avg completion'}
          value={String(stats.averageCompletion.toFixed(0)).concat('%')}
        />
      </div>
    </div>
  );
}
