import './Switch.scss';
import React, { Dispatch, SetStateAction, useEffect, useState } from 'react';

interface SwitchProps {
  label?: string;
  id: string;
  initialValue?: boolean;
  controlled?: boolean;
  onSwitchToggle?: (
    checked: boolean,
    setChecked: Dispatch<SetStateAction<boolean>>
  ) => void;
}

export const Switch = function ({
  initialValue = false,
  controlled = false,
  ...props
}: SwitchProps) {
  const [checked, setChecked] = useState<boolean>(initialValue);
  const handleToggleState = (e: any) => {
    e.preventDefault();
    setChecked(!checked);
    if (props.onSwitchToggle) {
      props.onSwitchToggle(!checked, setChecked);
    }
  };

  useEffect(() => {
    if (controlled) {
      setChecked(initialValue);
    }
  }, [initialValue, controlled]);

  return (
    <label className="flex items-center cursor-pointer">
      {props.label ? (
        <div className="px-2 dark:text-mom_darkMode_text-neutral">
          {props.label}
        </div>
      ) : (
        ''
      )}
      <div
        data-testid="switch"
        className="relative"
        onClick={(e: any) => handleToggleState(e)}
      >
        <input
          type="checkbox"
          className="hidden"
          id={props.id}
          checked={checked}
          readOnly
        />
        <div className="toggle-path"></div>
        <div className="toggle-circle"></div>
      </div>
    </label>
  );
};
