import "./SliderSelfAssessment.scss"
import { Slider } from "Components/Slider/Slider";
import { Typography } from "Components/Typography/Typography";
import { Anchor } from "../Anchor/Anchor";
import { useContext } from "react";
import { CommonContext } from "contexts/common.context";

export interface SliderSelfAssessmentProps {
  Icon?: any
  label?: string
  value?: any
  prefix?: string,
  onValueChanged: (currentValue: number) => void,
}

export const SliderSelfAssessment = function ({
  Icon,
  label,
  value,
  onValueChanged,
  prefix,
  ...props
}: SliderSelfAssessmentProps) {

  const { setInterfaceOpen } =
    useContext(CommonContext);

  return (
    <div className="flex flex-col px-4">
      <div className="flex flex-row items-center mb-1">
        {Icon ? <Icon className="w-4 h-auto mr-2" /> : ''}
        <Anchor
          label={
            <>
              <Typography usage="body" typeClass={['inline-block pr-1']}>{label}</Typography>
              <Typography usage="headingSmall" typeClass={['inline-block']}>{Math.round(value)}</Typography>
            </>
          }
          onClick={() => setInterfaceOpen('pillarDescriptionOpen', true)}
        />
      </div>
      <div>
        <Slider minimumValue={1} maximumValue={5} onValueChanged={onValueChanged} value={value} />
      </div>
    </div>
  );
};
