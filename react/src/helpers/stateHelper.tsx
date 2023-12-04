import { StateHelperContext } from 'contexts/stateHelper.context';

import { useContext } from 'react';

export function useChallenges() {
  const { challenges } = useContext(StateHelperContext);
  return challenges;
  // return _useChallenges();
}

export function useStats() {
  const { stats } = useContext(StateHelperContext);
  return stats;
}

export function useUserHabits() {
  // return _useUserHabits();
  const { userHabits } = useContext(StateHelperContext);

  return userHabits;
}

export function useSatisfactions() {
  const { satisfactions } = useContext(StateHelperContext);

  return satisfactions;
}

export function useDates() {
  const { dates } = useContext(StateHelperContext);

  return dates;
}

export function useAwards() {
  const { awards } = useContext(StateHelperContext);
  return awards;
}
