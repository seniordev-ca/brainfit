import React, { ReactNode, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { getData, setDataFieldWithID } from '../../slices/dataSlice';

export interface OptionProps {
  id?: string;
  label?: any;
  subLabel?: string;
  value: any;
  icon?: string;
  [key: string]: any
}

interface SelectProps extends React.HTMLAttributes<HTMLSelectElement> {
  size?: 'form_small' | 'form_medium' | 'form_large';
  label?: string;
  id: string;
  required?: boolean;
  errorText?: string;
  onChange?: any;
  wrapperClass?: Array<string> | string;
  labelClass?: Array<string>;
  data?: Array<OptionProps>;
  disableRedux?: boolean;
  value?: any;
  children?: any;
}

export const Select = function ({
  size = 'form_medium',
  id,
  errorText,
  required = false,
  wrapperClass = [],
  labelClass = [],
  disableRedux = false,
  data = [
    { label: 'True', value: true },
    { label: 'False', value: false }
  ],
  ...props
}: SelectProps) {
  const [value, setValue] = useState<any>(props.value || null);
  const policy = useSelector(getData);
  const policyData = policy.data;
  let currentValue = policyData[id] || '';
  const dispatch = useDispatch();
  let errorMSG: ReactNode;

  const handleChange = (e: any) => {
    if (props.onChange) {
      props.onChange(e);
    }
    if (!disableRedux) {
      dispatch(setDataFieldWithID({ id, value: e.target.value }));
    } else {
      setValue(e.target.value);
    }
  };

  (() => {
    if (errorText) {
      errorMSG = <div className="errorText">{errorText}</div>;
      wrapperClass = ['errorWrapper'];
    }
  })();

  return (
    <div className={Array.isArray(wrapperClass) ? wrapperClass.join(' ') : wrapperClass}>
      {
        props.label ? <label className={['form-label', ...labelClass].join(' ')} htmlFor={id}>
          {props.label}
        </label> : ''
      }
      <select
        id={id}
        className={['form-select min-w-5', size].join(' ')}
        value={(!disableRedux) ? currentValue: value}
        onChange={handleChange}
        required={required}
        {...props}
      >
        {props.children}
        {data.map((row) => (
          <option key={row.label} value={row.value}>
            {row.label}
          </option>
        ))}
      </select>
      {errorMSG}
    </div>
  );
};
