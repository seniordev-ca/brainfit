import { Card } from 'Components/Card/Card';
import { HabitStatsHeading } from 'Components/HabitStatsHeading/HabitStatsHeading';
import { StatsChart } from 'Components/StatsChart/StatsChart';
import { Typography } from 'Components/Typography/Typography';
import { CompletionStats, HabitColour } from 'types/types';

import { displayStatusString, getClassForTextHabitColour } from 'helpers/utils';
import { ReactComponent as CompleetionIcon } from 'img/icon_stats_completion_nofill.svg';
import { ReactComponent as LongestIcon } from 'img/icon_stats_longest_nofill.svg';
import { ReactComponent as StreakIcon } from 'img/icon_stats_streak_nofill.svg';
import { ReactComponent as TotalIcon } from 'img/icon_stats_total_nofill.svg';
import { Habit } from 'models/habit';

type CardHabitStatsProps = {
  habit: Habit;

  graph: {
    labels: string[];
    values: number[];
  };

  stats: CompletionStats;

  onHeaderClick?: () => void;
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
    <div className={'flex space-x-1 items-center'}>
      <Icon
        width={24}
        height={24}
        className={`mr-1 fill-current ${className}`}
      />
      <Typography usage="captionRegular" content={stat.concat(':')} />{' '}
      <Typography usage="captionMedium" content={String(value)} />{' '}
    </div>
  );
}

export function CardHabitStats({
  habit,
  graph,
  stats,
  onHeaderClick
}: CardHabitStatsProps) {
  return (
    <>
      <span
        className={
          'hidden text-mom_lightMode_icon-black text-mom_lightMode_icon-pink text-mom_lightMode_icon-purple text-mom_lightMode_icon-red text-mom_lightMode_icon-orange text-mom_lightMode_icon-yellow text-mom_lightMode_icon-teal text-mom_lightMode_icon-green text-mom_lightMode_icon-blue text-mom_lightMode_icon-lightBlue text-mom_lightMode_icon-brown text-mom_lightMode_icon-grey text-mom_lightMode_icon-default text-mom_lightMode_icon-exercise text-mom_lightMode_icon-nutrition text-mom_lightMode_icon-stress text-mom_lightMode_icon-sleep text-mom_lightMode_icon-mental text-mom_lightMode_icon-social '
        }
      />
      {/*  */}
      <Card cardType="card-actionable">
        <div className={'space-y-4'}>
          <HabitStatsHeading
            habitColour={habit.colour}
            habitIcon={habit.icon}
            habitName={habit.title}
            habitPillar={habit.pillars[0]}
            habitStatus={displayStatusString(habit)}
            onClick={() => onHeaderClick && onHeaderClick()}
          />
          <StatsChart
            labels={graph.labels}
            values={graph.values}
            color={habit.colour}
          ></StatsChart>
          <div className={'grid grid-cols-2 gap-y-4'}>
            <StatsDisplay
              Icon={StreakIcon}
              colour={habit.colour}
              stat={'Streak'}
              value={stats.currentStreak}
            />
            <StatsDisplay
              Icon={LongestIcon}
              colour={habit.colour}
              stat={'Longest'}
              value={stats.longestStreak}
            />
            <StatsDisplay
              Icon={TotalIcon}
              colour={habit.colour}
              stat={'Total'}
              value={stats.totalCompleted}
            />
            <StatsDisplay
              Icon={CompleetionIcon}
              colour={habit.colour}
              stat={'Avg'}
              value={String(stats.averageCompletion.toFixed(0)).concat('%')}
            />
          </div>
        </div>
      </Card>
    </>
  );
}
