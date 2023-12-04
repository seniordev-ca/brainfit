import { Typography } from 'Components/Typography/Typography';
import { getClassForTextHabitColour } from 'helpers/utils';
import { ReactComponent as TrendDownard } from 'img/trend_downward.svg';
import { ReactComponent as TrendNeutral } from 'img/trend_neutral.svg';
import { ReactComponent as TrendUpward } from 'img/trend_upward.svg';
import { HabitPillar } from 'types/types';

type DirectionTrendProps = {
  pillar: HabitPillar;
  direction: 'better' | 'worse';
  change: number;
  incomplete?: boolean;
  notApplicable?: boolean;
};

type NeutralTrendProps = {
  pillar: HabitPillar;
  direction: 'neutral';
  change?: number;
  incomplete?: boolean;
  notApplicable?: boolean;
};

export type TrendProps = DirectionTrendProps | NeutralTrendProps;

const ComponentForChange = {
  better: TrendUpward,
  worse: TrendDownard,
  neutral: TrendNeutral
};

export function Trend({
  pillar,
  direction,
  incomplete,
  change,
  notApplicable
}: TrendProps) {
  const Image = incomplete
    ? ComponentForChange['neutral']
    : ComponentForChange[direction];
  const className = getClassForTextHabitColour(pillar);

  let text = `${change}% ${direction} than last week`;

  if (direction === 'neutral') {
    text = `Add habits to this pilla to see trends`;
  }

  if (incomplete) {
    text = `Needs more data`;
  }

  if (notApplicable) {
    text = `You have no applicable habits for this pillar`;
  }

  return (
    <>
      {/* It looks like it doesn't want to load the dynamic class so I will first load them so that the tailwind config can pick up on it */}
      <span
        className={
          'hidden text-mom_pillar-exercise text-mom_pillar-nutrition text-mom_pillar-mental text-mom_pillar-stress text-mom_pillar-sleep text-mom_pillar-social'
        }
      />
      <div className={'flex'}>
        <div className={'mr-2'}>
          <Image
            width={32}
            height={32}
            className={`inline fill-current ${className}`}
          />
        </div>
        <div>
          <Typography
            usage="headingSmall"
            typeClass={['text-mom_lightMode_text-neutral']}
          >
            {pillar}
          </Typography>
          <Typography
            usage="captionRegular"
            typeClass={['text-mom_lightMode_text-neutral opacity-70']}
          >
            {text}
            {/* {change && direction !== 'neutral'
              ? `${change}% ${direction} than last week`
              : (incomplete as any)
              ? `Needs more data`
              : `Add habits to this pillar to see trends`} */}
          </Typography>
        </div>
      </div>
    </>
  );
}
