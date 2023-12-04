import "./Button.scss";
import React, { ButtonHTMLAttributes } from 'react';
import { ReactComponent as ToggleGlyph } from "../../img/icon_toggle_selected.svg";
import { ReactComponent as LoadingSpinner } from "../../img/loadingSpinner.svg";

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  buttonType?: 'btn-primary' | 'btn-primaryInvert' | 'btn-secondary' | 'btn-tertiary';
  buttonFormat?: 'standard' | 'toggle';
  toggleState?: boolean;
  toggleClass?: string[];
  loading?: boolean;
  label?: string;
  ariaLabel?: string;
  buttonClass?: string[];
  Icon?: any;
  iconOnly?: boolean;
  iconButtonSize?: "medium" | "large";
  onClick?: any;
  type?: 'submit' | 'button';
  disabledState?: boolean;
}

export const Button = function ({
  buttonType = 'btn-primary',
  buttonFormat = 'standard',
  toggleState,
  toggleClass = [],
  loading,
  label,
  ariaLabel = label,
  Icon,
  iconOnly = false,
  iconButtonSize,
  buttonClass = [],
  type = 'button',
  disabledState = false,
  ...props
}: ButtonProps) {
  const handleClick = (e: any) => {
    if (props.onClick) {
      e.preventDefault();
      props.onClick(e);
    }
  }

  (() => {
    if (iconOnly) {
      buttonClass = [...buttonClass, 'btn-icon'];
      if (iconButtonSize) {
        buttonClass = [...buttonClass, iconButtonSize];
      }
    } else {
      buttonClass = [...buttonClass, 'btn-text'];
    }
  })();

  (() => {
    if (toggleState) {
      toggleClass = [...toggleClass, 'toggle-on'];
    } else {
      toggleClass = [...toggleClass, 'toggle-off'];
    }
  })();

  (() => {
    if (loading) {
      buttonClass = [...buttonClass, 'p-loading'];
    }
  })();

  if (buttonFormat === 'standard') {
    return (
      <button
        name={label}
        type={type}
        className={['relative', buttonType, ...buttonClass].join(' ')}
        onClick={handleClick}
        disabled={disabledState}
        aria-label={ariaLabel}
        {...props}
      >
        {props.children ? props.children : (
          <>
            {Icon ? <Icon className="btn-icon_glyph" /> : ''}
            {loading ? '' : label}
            {loading && <LoadingSpinner className="loadingSpinner" />}
          </>
        )}
      </button>
    );
  } else {
    return (
      <button
        name={label}
        type={type}
        className={[buttonType, "btn-toggle", toggleClass, ...buttonClass].join(' ')}
        onClick={handleClick}
        disabled={disabledState}
        aria-label={ariaLabel}
        {...props}
      >
        <div className="grid grid-cols-2 place-content-between btn-icon h-24">
          <div className="justify-self-start">{Icon ? <Icon className="btn-icon_glyph" /> : ''}</div>
          <div className="justify-self-end">{toggleState ? <ToggleGlyph className="toggleGlyph" /> : ''}</div>
          <div className="justify-self-start col-span-2 text-left">{label}</div>
        </div>

      </button>
    );
  };

};