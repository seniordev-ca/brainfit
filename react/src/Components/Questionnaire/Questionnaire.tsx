import './Questionnaire.scss';
import { Button } from 'Components/Button/Button';
import { Question } from 'Components/Question/Question';
import { useContext, useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { getData, setDataFieldWithID } from 'slices/dataSlice';
import { useNavigate } from 'react-router-dom';
import { CSSTransition } from 'react-transition-group';
import { ReactComponent as ChevronPrev } from 'img/icon_chevronPrev.svg';
import { ReactComponent as ChevronNext } from 'img/icon_chevronNext.svg';
import { ReactComponent as PlusSVG } from 'img/icon_plus.svg';
import { CustomHabitContext } from "contexts/customhabit.context";
import { useSatisfactions } from 'helpers/stateHelper';
import NetworkHelper from 'helpers/web/networkHelper';
import { Keyboard } from '@capacitor/keyboard';
import { Capacitor } from '@capacitor/core';

export const Questionnaire = function () {
  const { data } = useSelector(getData);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const answers = data.questionnaireAnswers || [];
  const [index, setIndex] = useState(0);
  const [animate, setAnimate] = useState(true);

  const { mutate } = useSatisfactions();


  const { setInterfaceOpen } =
    useContext(CustomHabitContext);

  function nextQuestion() {
    setAnimate(false);
    setTimeout(() => {
      setIndex(index + 1);
      setAnimate(true);
    }, 500);
  }

  function previousQuestion() {
    if (index > 0) {
      setAnimate(false);
      setTimeout(() => {
        setIndex(index - 1);
        setAnimate(true);
      }, 500);
    } else {
      navigate(-1);
    }
  }

  async function finishQuestionnaire() {
    setInterfaceOpen('newHabitOpen', true)
    const satisfactions = answers[1]
      ? answers[1]
      : {};
    NetworkHelper.addSatisfactions(satisfactions);
    NetworkHelper.submitOnboardingData(answers[0], answers[2]);
    mutate();
    dispatch(setDataFieldWithID({ id: 'onboardingDone', value: true }));
    // Delay allows bottom sheet to present before navigating the user -- avoids a UI jitter
    await new Promise(r => setTimeout(r, 1500));
    navigate('/');
  }

  const [height, setHeight] = useState(0);
  useEffect(() => {
    if (Capacitor.getPlatform() !== 'web') {
      Keyboard.addListener('keyboardWillShow', info => {
        setHeight(info.keyboardHeight)
      });
      Keyboard.addListener('keyboardWillHide', () => {
        setHeight(0)
      });
    }
  }, [])


  return (
    <div className="questionnaire">
      <div className="question-container">
        <CSSTransition in={animate} timeout={500} classNames="question">
          <Question
            index={index}
            answer={answers[index]}
          />
        </CSSTransition>
      </div>
      <div className='bottom-nav' style={{ bottom: `${height}px` }}>
        <div className="flex flex-row justify-between pt-3 pb-4 px-4">
          <Button
            id="previousButton"
            onClick={previousQuestion}
            Icon={ChevronPrev}
            buttonType="btn-primaryInvert"
            iconButtonSize='large'
            iconOnly
            data-testid="previous"
          />
          <Button
            id="nextButton"
            onClick={index < 3 ? nextQuestion : finishQuestionnaire}
            Icon={index < 3 ? ChevronNext : PlusSVG}
            buttonType="btn-primary"
            iconButtonSize='large'
            iconOnly
            data-testid="next"
          />
        </div>
      </div>
    </div>
  );
};
