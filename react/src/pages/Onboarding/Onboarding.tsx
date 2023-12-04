import './Onboarding.scss';
import { ReactElement, useContext } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { getData } from 'slices/dataSlice';
import { SignUpContext } from "contexts/signup.context";
import { Button } from 'Components/Button/Button';
import { Anchor } from 'Components/Anchor/Anchor';
import { Typography } from 'Components/Typography/Typography';
import homeLogo from "img/home_logo.svg";

/**
 * Onboarding page
 *
 * @returns
 */
export const Onboarding = (): ReactElement => {
  const navigate = useNavigate();
  const { data } = useSelector(getData);

  const { setInterfaceOpen } =
    useContext(SignUpContext);

  function onContinue() {
    // dispatch(setDataFieldWithID({ id: 'onboardingDone', value: false }));
    navigate('/questionnaire');
  }

  return (
    <div id="onboarding" className='onboarding'>
      <div className='onboarding-header'>
        {!data.signedIn && 
          <Anchor
          onClick={() => navigate('/login')}
          label={<Typography content='Sign in' usage='headingSmall' />}
        />}
      </div>
      <div className='onboarding-body'>
        <div className='flex flex-col h-full'>
          <div className='mt-8'>
            <Typography 
              content='BrainFit'
              usage='headingLarge'
            />
            <Typography 
              content='Form simple habits with the six pillars of brain health'
              usage='headingMedium'
            />
          </div>
          <div className='flex-1 relative mx-4'>
            <div className='absolute flex justify-center items-center p-2 w-full h-full'>
              <img src={homeLogo} alt="home logo" />
            </div>
          </div>
          <div className='mb-10 mx-6'>
            <Button
              buttonClass={['mt-10 block']}
              label="Start now"
              onClick={onContinue}
            />
          </div>
        </div>
      </div>
      <div className='onboarding-footer'>
        <Typography 
          content='By tapping ‘Start now’ you agree to our' 
          usage='captionRegular'
        />
        <Anchor
          onClick={() => setInterfaceOpen('termsScreenOpen', true)}
          label={
            <Typography 
              content='Terms of service and privacy policy' 
              usage='captionRegular'
            />
          }
        />
      </div>
    </div>
  );
};
