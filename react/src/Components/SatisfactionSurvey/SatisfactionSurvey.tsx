import {useDispatch, useSelector} from 'react-redux';
import {answerQuestion, getData} from 'slices/dataSlice';
import { Typography } from 'Components/Typography/Typography';
import React from "react";
import {SelfAssessment} from "../SelfAssessment/SelfAssessment";

export interface SatisfactionSurveyProps {
  answer?: string | object,
}

export const SatisfactionSurvey = function ({
  answer,
  ...props
}: SatisfactionSurveyProps) {
  const dispatch = useDispatch();
  const { data } = useSelector(getData);
  const answers = data.questionnaireAnswers || [];
  const name = answers[0] ? answers[0] : "Hi there";

  function onValueChanged(value: object) {
    dispatch(answerQuestion({ answerIndex: 1, value: value }));
  }

  return (
    <div>
      <Typography usage="headingMedium" typeClass={['mb-4 text-left']}>{name}, from 1 to 5, how satisfied are you with these areas of your health?</Typography>
      <SelfAssessment answer={answer} onValueChanged={onValueChanged} />
    </div>
  );
};
