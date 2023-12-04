import { getProperHabitCss } from 'helpers/utils';
import { HabitPillar } from 'types/types';
import './ProgressIcon.scss';
import {
  CircularProgressbarWithChildren,
  buildStyles
} from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';

interface ProgressIconProps {
  context?: 'onWhite' | 'inList';
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
  colour?: string;
  progressClass?: string;
  progress?: number;
  textClass?: string;
  hideLabel?: boolean;
  gradientClass?: string;
  pathID?: string;
  Icon?: any;
  stroke?: string;
}

export const ProgressIcon = ({
  context,
  habitColour = 'default',
  colour = 'bg-mom_lightMode_icon-orange',
  progress = 25,
  gradientClass = '',
  pathID = 'circle-path',
  Icon,
  ...props
}: ProgressIconProps) => {
  let backgroundColour = 'bg-white';
  if (context === 'inList') {
    backgroundColour =
      'rounded-full bg-mom_lightMode_surface-dimmed dark:bg-mom_darkMode_surface-dimmed';
  } else {
    backgroundColour =
      'rounded-full bg-white dark:bg-mom_darkMode_surface-backgroundRaised ';
  }

  return (
    <>
      <div className={`progress-icon ${props.progressClass}`}>
        <span className={'stroke-[#EDBB32]'} />
        <CircularProgressbarWithChildren
          value={progress}
          classes={{
            path: `CircularProgressbar-path ${gradientClass
              ? gradientClass
              : `stroke-${getProperHabitCss(habitColour)}`
              }`,
            trail: `CircularProgressbar-trail ${gradientClass
              ? gradientClass
              : `stroke-${getProperHabitCss(habitColour)}`
              }`,

            root: `CircularProgressbar ${backgroundColour}`,
            text: 'CircularProgressbar-text',
            background: `CircularProgressbar-background`
          }}
          styles={buildStyles({
            rotation: 0.5
          })}
        >
          {!props.hideLabel ? (
            <div
              className="progressIcon_glyph absolute flex justify-center items-center top-0 w-full h-full"
            >
              {Icon ? (
                <Icon
                  data-testid="progressIcon"
                  className={`w-1/3 h-1/3 fill-${getProperHabitCss(
                    habitColour
                  )}`}
                />
              ) : (
                <span className={props.textClass}>{Math.round(progress)}%</span>
              )}
            </div>
          ) : (
            <></>
          )}
        </CircularProgressbarWithChildren>
      </div>
      {/* Some gradient code.. */}
      {/* <svg style={{ height: 0 }}>
        <defs>
          <linearGradient
            id={id}
            gradientTransform={`rotate(${Math.round(progress / 100) * 360})`}
          >
            <stop offset="0%" stopColor={'rgb(225, 177, 46)'} />
            <stop offset="30%" stopColor={'rgb(230, 120, 49)'} />
            <stop offset="100%" stopColor={'#FF3A33'} />
          </linearGradient>
        </defs>
      </svg> */}
    </>
  );
};
