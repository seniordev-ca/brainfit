import React, { ReactNode } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { getData, setDataFieldWithID } from 'slices/dataSlice'

import DatePicker from "@danielmackenzie8/react-widgets/DatePicker";

interface DatePickerProps {
    label?: string,
    errorText: string,
    labelClass?: Array<string>,
    wrapperClass?: Array<string>,
    id: string,
}

export const DatePickerInput = ({
    label,
    id,
    errorText,
    labelClass = [],
    wrapperClass = [],
    ...props
}: DatePickerProps) => {
    const policy = useSelector(getData);
    const policyData = policy.data;
    const currentValue = policyData[id] || '';
    const dispatch = useDispatch();
    let errorMSG: ReactNode

    (() => {
        if (errorText) {
            errorMSG = (<div className="errorText">{errorText}</div>)
            wrapperClass = ['errorWrapper']
        }
    })();

    function dateFromString(dateString: string): Date | undefined {
        return isNaN(new Date(dateString).getTime()) ? undefined : new Date(dateString)
    }


    return (
        <div className={wrapperClass.join(' ')}>
            <label className={['form-label mb-1', ...labelClass].join(' ')} htmlFor={id}>{label}</label>
            <DatePicker
                id={id}
                parse={str => dateFromString(str)}
                value={dateFromString(currentValue)}
                valueFormat={{ year: 'numeric', month: '2-digit', day: '2-digit' }}
                onChange={(value) => {
                    if (value && !isNaN(value.getTime())) {
                        dispatch(setDataFieldWithID({ id, value: value?.toUTCString() }))

                    }
                }}
                {...props}
            />
            {errorMSG}
        </div>
    );
};
