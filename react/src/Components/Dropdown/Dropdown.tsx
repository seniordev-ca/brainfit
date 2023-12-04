import { Button, ButtonProps } from 'Components/Button/Button';
import './Dropdown.scss';

interface DropdownProps {
  label?: string;
  Icon?: any;
  showDropdown: boolean;
  dropdownOnClick: () => void;
  dropdownItems: ButtonProps[];
  dropdownClass?: string;
  dropdownToggleClass?: string;
  dropdownMenuClass?: string;
}

export const Dropdown = function ({
  showDropdown,
  dropdownOnClick,
  dropdownItems = [],
  dropdownToggleClass = 'dropdown-toggle',
  label = '',
  Icon,
  ...props
}: DropdownProps) {
  return (
    <div className={["dropdown relative", props.dropdownClass].join(' ')}>
      <button
        className={dropdownToggleClass}
        type="button"
        onClick={(event) => {
          dropdownOnClick();
          event.stopPropagation();
        }}
      >
        {label}
        {Icon ? <Icon className="fill-red-600/70" /> : (
          <svg
            aria-hidden="true"
            focusable="false"
            data-prefix="fas"
            data-icon="caret-down"
            className="w-2 ml-2"
            role="img"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 320 512"
          >
            <path
              fill="currentColor"
              d="M31.3 192h257.3c17.8 0 26.7 21.5 14.1 34.1L174.1 354.8c-7.8 7.8-20.5 7.8-28.3 0L17.2 226.1C4.6 213.5 13.5 192 31.3 192z"
            ></path>
          </svg>
        )}
      </button>
      <ul
        className={["dropdown-menu", props.dropdownMenuClass, showDropdown ? 'show' : 'hidden'].join(' ')}
      >
        {dropdownItems.map((item: ButtonProps, i: number) => {
          return (
            <li key={`${label}-${i + 1}`}>
              <Button className="dropdown-item" {...item} />
            </li>
          );
        })}
      </ul>
    </div>
  );
};
