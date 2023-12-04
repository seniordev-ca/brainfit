import "./ColourDot.scss";
import React from 'react';
import { getProperHabitCss } from "helpers/utils";

export interface ColourDotProps {
  dotColour?: string;
  selected?: boolean;
  borderless?: boolean;
}

export const ColourDot = function ({
  dotColour,
  selected = false,
  borderless,
  ...props
}: ColourDotProps) {

  if (!borderless) {
    return (
      <div className={["colourDot_container", selected ? 'selected' : ''].join(' ')}>
        <div className={['colourDot', getProperHabitCss(dotColour)].join(' ')} data-testid={dotColour}></div>
      </div>
    );
  } else {
    return (
      <div className="relative w-10">
        <div className={['colourDot', getProperHabitCss(dotColour, true)].join(' ')} data-testid={dotColour}></div>
      </div>
    )
  }
};
