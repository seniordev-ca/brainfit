import './PillarFilter.scss';

import { useState } from 'react';

import { ListGroup } from 'Components/ListGroup/ListGroup';
import { ListItem } from 'Components/ListItem/ListItem';
import { Typography } from 'Components/Typography/Typography';
import { ReactComponent as IconSystems } from 'img/icon_systems.svg';
import { ReactComponent as AllIcon } from 'img/Pillars/icon_pillar_all.svg';
import { ReactComponent as ExerciseIcon } from 'img/Pillars/icon_pillar_exercise.svg';
import { ReactComponent as MentalIcon } from 'img/Pillars/icon_pillar_mental.svg';
import { ReactComponent as NutritionIcon } from 'img/Pillars/icon_pillar_nutrition.svg';
import { ReactComponent as SleepIcon } from 'img/Pillars/icon_pillar_sleep.svg';
import { ReactComponent as SocialIcon } from 'img/Pillars/icon_pillar_social.svg';
import { ReactComponent as StressIcon } from 'img/Pillars/icon_pillar_stress.svg';
import { BottomSheet } from 'react-spring-bottom-sheet';
import { HabitPillarFilter } from 'types/types';

import { habitPillars } from 'helpers/utils';
import { ReactComponent as ArchiveIcon } from 'img/icon_archive.svg';

import { ReactComponent as CheckmarkIcon } from 'img/icon_check.svg';

type Props = {
  onPillarChanged?: (pillar: HabitPillarFilter) => void;
  hideArchive?: boolean;
};

export const PillarFilter = function ({ onPillarChanged, hideArchive }: Props) {
  const [pillarFilter, setPillarFilter] = useState<HabitPillarFilter>('all');
  const [pillarSheetOpen, setPillarSheetOpen] = useState(false);

  const PillarIcon = (pillar?: HabitPillarFilter) => {
    if (pillar === 'Exercise') {
      return <ExerciseIcon className={'w-6 h-6'} />;
    } else if (pillar === 'Mental Stimulation') {
      return <MentalIcon />;
    } else if (pillar === 'Nutrition') {
      return <NutritionIcon />;
    } else if (pillar === 'Sleep') {
      return <SleepIcon />;
    } else if (pillar === 'Social Activity') {
      return <SocialIcon />;
    } else if (pillar === 'Stress Management') {
      return <StressIcon />;
    } else if (pillar === 'archived') {
      return <ArchiveIcon />;
    } else {
      return <AllIcon className={'all-pillars'} />;
    }
  };

  const PillarLabel = (filter: HabitPillarFilter) => (
    <Typography
      typeClass={[
        'text-mom_lightMode_text-primary',
        'dark:text-mom_darkMode_text-primary'
      ]}
    >
      {filter === 'all' ? 'All pillars' : <></>}
      {filter === 'archived' ? 'Archived' : <></>}
      {filter !== 'all' && filter !== 'archived' ? filter : <></>}
    </Typography>
  );

  const SettingsButton = (
    <div className="icon_systems">
      <button onClick={() => setPillarSheetOpen(true)}>
        <IconSystems />
      </button>
    </div>
  );

  const PillarItems = [
    <ListItem
      prefix={PillarIcon(undefined)}
      label={'All Pillars'}
      onClick={() => selectPillar('all')}
      suffix={pillarFilter === 'all' ? <CheckmarkIcon /> : <></>}
    />,
    ...habitPillars.map((p) => (
      <ListItem
        prefix={PillarIcon(p)}
        key={`PI-${p}`}
        label={p}
        onClick={() => selectPillar(p)}
        suffix={pillarFilter === p ? <CheckmarkIcon /> : <></>}
      />
    ))
  ].concat(
    hideArchive
      ? []
      : [
        <ListItem
          className='dark:fill-mom_darkMode_icon-neutral'
          prefix={<ArchiveIcon />}
          label={'Archived'}
          onClick={() => {
            selectPillar('archived');
            if (onPillarChanged) {
              onPillarChanged('archived');
            }
          }}
          suffix={pillarFilter === 'archived' ? <CheckmarkIcon /> : <></>}
        />
      ]
  );

  const selectPillar = (p: HabitPillarFilter) => {
    setPillarFilter(p);
    setPillarSheetOpen(false);

    if (onPillarChanged) {
      onPillarChanged(p);
    }
  };

  return (
    <>
      <div id="pillarFilter" className={'text-left'}>
        <ListItem
          className="dark:fill-mom_darkMode_icon-neutral"
          prefix={PillarIcon(pillarFilter)}
          suffix={SettingsButton}
          label={PillarLabel(pillarFilter)}
          onClick={() => setPillarSheetOpen(true)}
        />
      </div>
      <BottomSheet
        open={pillarSheetOpen}
        onDismiss={() => setPillarSheetOpen(false)}
      >
        <div className={'px-6 py-4'}>
          <Typography usage="captionMedium" content="Filter by pillar" />
          <ListGroup
            items={PillarItems}
            listGroupType={'listGroup_primary'}
          />
        </div>
      </BottomSheet>
    </>
  );
};
