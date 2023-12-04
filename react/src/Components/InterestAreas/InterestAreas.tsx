import { Typography } from "Components/Typography/Typography";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { answerQuestion } from "slices/dataSlice";
import { ReactComponent as PillarSleep } from 'img/Pillars/icon_pillar_sleep.svg';
import { ReactComponent as PillarExercise } from 'img/Pillars/icon_pillar_exercise.svg';
import { ReactComponent as PillarMental } from 'img/Pillars/icon_pillar_mental.svg';
import { ReactComponent as PillarNutrition } from 'img/Pillars/icon_pillar_nutrition.svg';
import { ReactComponent as PillarStress } from 'img/Pillars/icon_pillar_stress.svg';
import { ReactComponent as PillarSocial } from 'img/Pillars/icon_pillar_social.svg';
import { Button } from "../Button/Button";

export interface SelfAssessmentProps {
  answer?: any,
}

export const InterestAreas = function ({
  answer,
  ...props
}: SelfAssessmentProps) {
  const dispatch = useDispatch();
  const [assessmentValues, setAssessmentValues] = useState<any>(answer ?? {})

  function updateValue(pillar: string) {
    setAssessmentValues({ ...assessmentValues, [pillar]: !assessmentValues[pillar] })
  }

  useEffect(() => {
    dispatch(answerQuestion({ answerIndex: 2, value: assessmentValues }));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [assessmentValues])
  return (
    <div>
      <Typography usage="headingMedium" typeClass={['mb-4 text-left']}>Select the areas you most want to work on to keep your brain fit</Typography>
      <Typography usage="body" typeClass={['mb-4 text-left']}>These are also the pillars of brain health. Select as many as you like.</Typography>
      <div className="grid grid-cols-2 gap-4">
        <Button
          buttonType="btn-secondary"
          buttonFormat="toggle"
          toggleState={assessmentValues["Exercise"]}
          Icon={PillarExercise}
          label="Exercise"
          onClick={() => updateValue("Exercise")}
        />
        <Button
          buttonType="btn-secondary"
          buttonFormat="toggle"
          toggleState={assessmentValues["Nutrition"]}
          Icon={PillarNutrition}
          label="Nutrition"
          onClick={() => updateValue("Nutrition")}
        />
        <Button
          buttonType="btn-secondary"
          buttonFormat="toggle"
          toggleState={assessmentValues["Stress Management"]}
          Icon={PillarStress}
          label="Stress Management"
          onClick={() => updateValue("Stress Management")}
        />
        <Button
          buttonType="btn-secondary"
          buttonFormat="toggle"
          toggleState={assessmentValues["Social Activity"]}
          Icon={PillarSocial}
          label="Social Activity"
          onClick={() => updateValue("Social Activity")}
        />
        <Button
          buttonType="btn-secondary"
          buttonFormat="toggle"
          toggleState={assessmentValues["Sleep"]}
          Icon={PillarSleep}
          label="Sleep"
          onClick={() => updateValue("Sleep")}
        />
        <Button
          buttonType="btn-secondary"
          buttonFormat="toggle"
          toggleState={assessmentValues["Mental Stimulation"]}
          Icon={PillarMental}
          label="Mental Stimulation"
          onClick={() => updateValue("Mental Stimulation")}
        />
      </div>
    </div>
  )
}
