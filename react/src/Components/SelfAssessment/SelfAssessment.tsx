import { SliderSelfAssessment } from "Components/SliderSelfAssessment/SliderSelfAssessment";
import { useEffect, useState } from "react";
import { ReactComponent as IconExercise } from '../../img/Pillars/icon_pillar_exercise.svg';
import { ReactComponent as IconNutrition } from '../../img/Pillars/icon_pillar_nutrition.svg';
import { ReactComponent as IconStress } from '../../img/Pillars/icon_pillar_stress.svg';
import { ReactComponent as IconSocial } from '../../img/Pillars/icon_pillar_social.svg';
import { ReactComponent as IconSleep } from '../../img/Pillars/icon_pillar_sleep.svg';
import { ReactComponent as IconMental } from '../../img/Pillars/icon_pillar_mental.svg';


export interface SelfAssessmentProps {
  answer?: any,
  onValueChanged?: (value: object) => void;
}

export const SelfAssessment = function ({
  answer,
  onValueChanged,
  ...props
}: SelfAssessmentProps) {
  const defaultValue = {
    "exercise": 3,
    "nutrition": 3,
    "stress-management": 3,
    "social": 3,
    "sleep": 3,
    "mental-stimulation": 3
  };
  const [assessmentValues, setAssessmentValues] = useState<any>(!answer || Object.keys(answer).length === 0 ? defaultValue : answer)

  function updateValue(value: number, pillar: string) {
    setAssessmentValues({ ...assessmentValues, [pillar]: value })
  }

  useEffect(() => {
    if (onValueChanged) onValueChanged(assessmentValues)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [assessmentValues])
  return (
    <div>
      <div className="grid grid-row gap-5">
        <SliderSelfAssessment Icon={IconExercise} label="Exercise" value={assessmentValues["exercise"]} onValueChanged={(currentValue) => updateValue(currentValue, "exercise")} />
        <SliderSelfAssessment Icon={IconNutrition} label="Nutrition" value={assessmentValues["nutrition"]} onValueChanged={(currentValue) => updateValue(currentValue, "nutrition")} />
        <SliderSelfAssessment Icon={IconStress} label="Stress Management" value={assessmentValues["stress-management"]} onValueChanged={(currentValue) => updateValue(currentValue, "stress-management")} />
        <SliderSelfAssessment Icon={IconSocial} label="Social Activity" value={assessmentValues["social"]} onValueChanged={(currentValue) => updateValue(currentValue, "social")} />
        <SliderSelfAssessment Icon={IconSleep} label="Sleep" value={assessmentValues["sleep"]} onValueChanged={(currentValue) => updateValue(currentValue, "sleep")} />
        <SliderSelfAssessment Icon={IconMental} label="Mental Stimulation" value={assessmentValues["mental-stimulation"]} onValueChanged={(currentValue) => updateValue(currentValue, "mental-stimulation")} />
      </div>
    </div>
  )
}
