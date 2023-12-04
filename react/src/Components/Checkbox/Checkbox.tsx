import { ReactNode } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  getData,
  setDataFieldWithID,
  toggleCollection
} from '../../slices/dataSlice';

export interface CheckboxProps {
  size?: 'small' | 'medium' | 'large';
  message?: string;
  id?: string;
  onCheckboxChecked?: Function;
  required?: boolean;
  initialValue?: any;
  addToCollection?: string;
  errorText?: string;
  wrapperClass?: string | Array<string>;
  messageClass?: Array<string>;
  [key: string]: any
}

export const Checkbox = function ({
  size = 'medium',
  message,
  id,
  errorText,
  required = false,
  addToCollection,
  wrapperClass = [],
  messageClass = [],
  ...props
}: CheckboxProps) {
  const policy = useSelector(getData);
  const policyData = policy.data;
  const currentValue = (policyData && id) ? policyData[id] : '';
  const dispatch = useDispatch();
  let errorMSG: ReactNode;

  (() => {
    if (errorText) {
      errorMSG = <div className="errorText">{errorText}</div>;
      wrapperClass = ['errorWrapper'];
    }
  })();

  return (
    <div
      className={
        Array.isArray(wrapperClass) ? wrapperClass.join(' ') : wrapperClass
      }
    >
      <input
        id={id}
        type="checkbox"
        className={['form-checkbox', size].join(' ')}
        required={required}
        {...props.onCheckboxChecked ? { defaultChecked: props.initialValue } : { defaultChecked: currentValue }}
        onChange={(e) => {
          if (props.onCheckboxChecked) {
            props.onCheckboxChecked(e);
          } else {
            if (addToCollection) {
              dispatch(
                toggleCollection({ collectionID: addToCollection, fieldID: id })
              );
            }
            dispatch(setDataFieldWithID({ id, value: e.target.checked }));
          }
        }}
        {...props}
      />{' '}
      <span className={messageClass.join(' ')}> {message} </span>
      {errorMSG}
    </div>
  );
};
