import { NameCapture } from "../NameCapture/NameCapture";
import { InterestAreas } from "../InterestAreas/InterestAreas";
import { OnboardingEnd } from "../OnboardingEnd/OnboardingEnd";
import { SatisfactionSurvey } from "../SatisfactionSurvey/SatisfactionSurvey";

export interface QuestionProps {
  index: number;
  answer?: string | object
}

export const Question = function ({
  index,
  answer,
  ...props
}: QuestionProps) {

  const interestsAnswer = {
    "Exercise": false,
    "Nutrition": false,
    "Stress Management": false,
    "Social Activity": false,
    "Sleep": false,
    "Mental Stimulation": false
  };

  return (
    index === 0 ? <NameCapture answer={answer?.toString()} /> :
      index === 1 ? <SatisfactionSurvey answer={answer} /> :
        index === 2 ? <InterestAreas answer={answer ? answer : interestsAnswer} /> :
          <OnboardingEnd />
  );
};
