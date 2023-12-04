import "./Stepper.scss";
import React from 'react';
import { ReactElement } from 'react';
import { ReactComponent as StepUp } from '../../img/icon_stepup.svg';
import { ReactComponent as StepDown } from '../../img/icon_stepdown.svg';

interface StepperProps {
    onStepClick?: Function;
}
export const Stepper = ({ ...props }: StepperProps): ReactElement => {

    const handleStep = (dir: 'up' | 'down') => {
        props.onStepClick && props.onStepClick(dir);
    }

    return (
        <div className="stepperContainer">
            <button onClick={() => handleStep('down')} className="stepper_stepdown"><StepDown /></button>
            <div className="stepper_separator"></div>
            <button onClick={() => handleStep('up')} className="stepper_stepup"><StepUp /></button>
        </div>
    );
};