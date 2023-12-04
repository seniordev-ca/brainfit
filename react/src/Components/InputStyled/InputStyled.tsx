import "./InputStyled.scss";
import React, { ReactNode, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { getData, setDataFieldWithID } from '../../slices/dataSlice';

export interface InputStyledProps extends React.HTMLAttributes<HTMLInputElement> {
  label?: string;
  type?: 'text' | 'email' | 'number' | 'date' | 'datetime-local' | 'checkbox' | 'password' | 'phone';
  name?: string;
  Icon?: any;
  id: string;
  errorText?: string;
  required?: boolean;
  placeholder?: string;
  onKeyUp?: () => void;
  wrapperClass?: Array<string>;
  labelClass?: Array<string>;
  inputClass?: string;
  readOnly?: boolean;
  hint?: string;
  value?: string;
  maxLength?: number;
  disableState?: boolean;
  onValueChanged?: any;
}

export const InputStyled = function ({
  label,
  type = 'text',
  errorText,
  Icon,
  id,
  required = false,
  wrapperClass = [],
  labelClass = [],
  hint,
  readOnly,
  maxLength,
  children,
  onValueChanged,
  inputClass,
  disableState = false,
  ...props
}: InputStyledProps) {
  const [value, setValue] = useState(props.defaultValue || props.value || '');
  const policy = useSelector(getData);
  const policyData = policy.data;
  const currentValue = policyData[id] || '';
  const dispatch = useDispatch();
  let errorMSG: ReactNode;
  let hintMSG: ReactNode;
  let glyphClass: ReactNode;
  var glyphSRC;


  (() => {
    if (errorText) {
      errorMSG = <div className="errorText">{errorText}</div>;
      wrapperClass = ['errorWrapper'];
    }
    if (hint) {
      hintMSG = <div className="hintText">{hint}</div>
    }
    if (Icon) {
      glyphClass = ['form-glyph'];
      glyphSRC = { WebkitMaskImage: `url(${Icon})`, maskImage: `url(${Icon})` };
    }
  })();

  return (
    <div className="inputStyled_container">
      <div className={wrapperClass.join(' ')}>
        {label ? (
          <label className={['form-label', ...labelClass].join(' ')} htmlFor={id}>
            {label}
          </label>
        ) : <></>}
        {children}
        <div className="inputWrapper">
          {Icon ? <div className="inputGlyph" style={glyphSRC}></div> : ''}
          <input
            id={id}
            name={props.name || id}
            type={type}
            className={['form-input', glyphClass, inputClass].join(' ')}
            required={required}
            value={(!disableState) ? currentValue : value}
            disabled={readOnly}
            maxLength={maxLength}
            onChange={(e) => {
              if (!disableState) {
                dispatch(setDataFieldWithID({ id, value: e.target.value }))
              } else {
                setValue(e.target.value);
                if (onValueChanged) {
                  onValueChanged(e.target.value);
                }
              }
            }}
            {...props}
          />
        </div>
        {hintMSG}
        {errorMSG}
      </div>
    </div>
  );
};
