import React,{ReactNode} from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { getData, setDataFieldWithID } from 'slices/dataSlice'

import TimeInput from "@danielmackenzie8/react-widgets/TimeInput";

interface TimeInputProps {
    label?: string,
    errorText: string,
    labelClass?: Array<string>,
    wrapperClass?: Array<string>,
    id: string,
}

export const TimePicker = ({
    label,
    id,
    errorText,
    labelClass = [],
    wrapperClass = [],
    ...props
}: TimeInputProps) => {
    const policy = useSelector(getData)
    const currentValue = policy[id] || ""
    const dispatch = useDispatch()
    let errorMSG : ReactNode

    (() => {
        if (errorText) {
            errorMSG = (<div className="errorText">{errorText}</div>)
            wrapperClass = ['errorWrapper']
        } 
    })();

    return (
        <div className={wrapperClass.join(' ')}>
            <label className={['form-label mb-1', ...labelClass].join(' ')} htmlFor={id}>{label}</label>
            <TimeInput 
                id={id}
                value={currentValue === '' ? undefined : new Date(currentValue)}
                defaultValue={new Date()}
                use12HourClock
                onChange={(value) =>
                    dispatch(setDataFieldWithID({ id, value: value?.toUTCString() }))
                  }
                {...props}
            />
            {errorMSG}
        </div>
    );
};
