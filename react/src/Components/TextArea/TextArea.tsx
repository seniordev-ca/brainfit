import "./TextArea.scss";
import React, { TextareaHTMLAttributes, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getData, setDataFieldWithID } from 'slices/dataSlice';

export interface TextAreaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  placeholder?: string;
  textareaClass?: string[];
  rows?: number;
  onInput?: any;
  disableState?: boolean;
  value?: string;
  id: string;
}

export const TextArea = function ({ 
  label, 
  placeholder, 
  textareaClass = [], 
  rows,
  disableState = false,
  id,
  ...props
}: TextAreaProps) {
  const handleInput = (e: any) => {
    if (props.onInput) {
      e.preventDefault();
      props.onInput(e);
    }
  }

  const dispatch = useDispatch();
  const policy = useSelector(getData);
  const policyData = policy.data;
  const currentValue = policyData[id] || '';
  const [value, setValue] = useState(props.value || '');
  
  return <textarea
    name={label}
    placeholder={placeholder}
    className={['form-textarea', ...textareaClass].join(' ')}
    rows={rows}
    onInput={(e: any) => {
      if (!disableState) {
        dispatch(setDataFieldWithID({ id, value: e.target.value }))
      } else {
        setValue(e.target.value);
        if (props.onInput){
          handleInput(e);
        }
      }
    }}
    value={(!disableState) ? currentValue : value}
    onChange={(e) => {
      if (!disableState) {
        dispatch(setDataFieldWithID({ id, value: e.target.value }))
      } else {
        setValue(e.target.value);
      }
    }}
  >

  </textarea>
}