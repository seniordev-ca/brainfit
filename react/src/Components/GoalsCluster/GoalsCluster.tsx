import { StatTile } from 'Components/StatTile/StatTile';

import { ReactComponent as LongestIcon } from '../../img/icon_stats_longest.svg';
import { ReactComponent as CompletionIcon } from '../../img/icon_stats_completion.svg';
import {ReactComponent as StreakIcon} from '../../img/icon_stats_streak.svg';
import {ReactComponent as TotalIcon} from '../../img/icon_stats_total.svg';

type GoalsClusterProps = {
  longestStreak: number;
  streak: number;
  average: number;
  total: number;
};

export function GoalsCluster({
  longestStreak,
  streak,
  average,
  total
}: GoalsClusterProps) {
  return (
    <div className={'grid grid-cols-2 gap-4 mb-6 text-left'}>
      <StatTile
        Icon={<StreakIcon/>}
        stat={'Current Streak'}
        value={`${streak} days`}
      />
      <StatTile
        Icon={<LongestIcon/>}
        stat={'Longest Streak'}
        value={`${longestStreak} days`}
      />
      <StatTile
        Icon={<TotalIcon/>}
        stat={'Done in total'}
        value={`${total} goals`}
      />
      <StatTile
        Icon={<CompletionIcon/>}
        stat={`Avg completion`}
        value={`${average.toFixed(0)} %`}
      />
    </div>
  );
}
