import './StartQuestionnaire.scss';
import { ReactElement, useState } from 'react';
import { Button } from 'Components/Button/Button';
import { Questionnaire } from 'Components/Questionnaire/Questionnaire';
import { useSelector } from 'react-redux';
import { getData } from 'slices/dataSlice';
import { useNavigate } from 'react-router-dom';
import localization from 'helpers/localizationHelper';
import questionnaireImage from '../../img/image.png'

/**
 * Questionnaire Start page
 *
 * @returns
 */
export const StartQuestionnaire = (props: any): ReactElement => {
  const [start, setStart] = useState(true);
  const { data } = useSelector(getData);
  const navigate = useNavigate();

  const onSkip = function () {
    if (!data.onboardingDone) {
      navigate('/signup');
    } else {
      navigate('/');
    }
  }

  return (
    <>
      <div className='w-full pt-8 pb-24'>
        {
          start ?
            <Questionnaire></Questionnaire> :
            <div className='text-left'>
              <img alt='' className='w-9/12 mx-auto mt-12 mb-12 max-w-md' src={questionnaireImage} />
              <h1>{localization.getString("questionTitleString")}</h1>
              <p>{localization.getString("questionnaireDescription1")}</p>
              <br /><br />

              <br /><br />
            </div>
        }

      </div>
      {
        !start && (
          <div className="w-full fixed bottom-0 bg-white z-30 p-6">
            <Button label={localization.getString("startButton")} onClick={() => {
              setStart(true)
            }} />
            <br /><br />
            <Button label={localization.getString("skipButton")} onClick={onSkip}></Button>
          </div>
        )
      }
    </>
  )
};
