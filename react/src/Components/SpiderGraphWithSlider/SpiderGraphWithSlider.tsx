import "./SpiderGraphWithSlider.scss";
import React from 'react';
import { SpiderGraph } from "Components/SpiderGraph/SpiderGraph";
import { Typography } from 'Components/Typography/Typography';
import { Slider } from 'Components/Slider/Slider';
import { Card } from "Components/Card/Card";

export interface SpiderGraphWithSliderProps {
  onValueChanged: (currentValue: number) => void
  value?: any;
  results: { [key: string]: number };
  dateLabel: string;
  length: number;
}

export const SpiderGraphWithSlider = function ({
  onValueChanged,
  value,
  results,
  dateLabel,
  length,
  ...props
}: SpiderGraphWithSliderProps) {
  return (
    <Card cardType="card-notactionable">
      <div className="SpiderGraphWithSlider_container">
        <SpiderGraph
          results={results}
        />
        {length > 1 && (
          <>
            <Typography usage="captionRegular" typeClass={['dateLabel']}>{dateLabel}</Typography>
            <div className="px-4">
              <Slider minimumValue={1} maximumValue={length} stepInterval={1} onValueChanged={onValueChanged} value={value} />
            </div>
          </>
        )}
      </div>
    </Card>
  )
}