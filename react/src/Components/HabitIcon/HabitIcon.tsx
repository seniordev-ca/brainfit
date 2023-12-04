import './HabitIcon.scss';
import React from 'react';
import { HabitPillar } from 'types/types';
import { getProperHabitCss } from 'helpers/utils';

interface HabitIconProps {
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
  Icon?: any;
  className?: string;
}

export const HabitIcon = function ({
  habitColour = 'default',
  Icon,
  className = '',
  ...props
}: HabitIconProps) {
  return (
    <div className={['habitIcon_container', className].join(' ')}>
      <div
        className={[
          'habitIcon_circle bg-opacity',
          getProperHabitCss(habitColour)
        ].join(' ')}
      >
        <div className="habitGlyph_container">
          {Icon ? <Icon className="habitGlyph" /> : ''}
        </div>
      </div>
    </div>
  );
};
