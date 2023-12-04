import { ReactNode } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Combobox } from '@danielmackenzie8/react-widgets';
import { ComboboxProps } from '@danielmackenzie8/react-widgets/cjs/Combobox';
import { ChangeHandler } from '@danielmackenzie8/react-widgets/esm/shared';
import { getData, setDataFieldWithID } from '../../slices/dataSlice';

interface ComboProps extends ComboboxProps {
  defaultValue?: string;
  label?: string;
  errorText?: string;
  labelClass?: Array<string>;
  wrapperClass?: Array<string> | string;
  id: string;
}

export const Combo = function ({
  label,
  id,
  errorText,
  labelClass = [],
  wrapperClass = [],
  onChange,
  ...props
}: ComboProps) {
  const policy = useSelector(getData);
  const currentValue = policy.data[id] || '';
  const dispatch = useDispatch();
  let errorMSG: ReactNode;

  let changeFunction : ChangeHandler<string> = (value: string) => dispatch(setDataFieldWithID({ id, value }));

  if (onChange) {
    changeFunction = onChange
  }

  (() => {
    if (errorText) {
      errorMSG = <div className="errorText">{errorText}</div>;
      wrapperClass = ['errorWrapper'];
    }
  })();
  

  return (
    <div className={Array.isArray(wrapperClass) ? wrapperClass.join(' ') : wrapperClass}>
      <label
        className={['form-label mb-1', ...labelClass].join(' ')}
        htmlFor={id}
      >
        {label}
      </label>
      <Combobox
        {...props}
        value={currentValue}
        filter='contains'
        onChange={changeFunction}
      />
      {errorMSG}
    </div>
  );
};
