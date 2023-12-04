import "./ListItem.scss";
import React from 'react';
import { ReactComponent as ChevronRight } from '../../img/chevron-r.svg';

interface ListItemProps {
  listType?: 'list-primary' | 'list-secondary';
  prefix?: any;
  label?: any;
  labelClass?: string;
  sublabel?: any;
  suffix?: any;
  chevron?: boolean;
  notificationDot?: boolean;
  onClick?: any;
  className?: string;
  tabIndex?: number;
}

export const ListItem = function ({
  listType = "list-primary",
  prefix,
  label = "label",
  sublabel,
  suffix,
  chevron,
  notificationDot,
  tabIndex,
  ...props
}: ListItemProps) {
  const handleClick = (e: any) => {
    if (props.onClick) {
      e.preventDefault();
      props.onClick(e);
    }
  }

  var labelSlotClass;
  var sublabelSlotClass;
  (() => {
    if (sublabel) {
      labelSlotClass = 'headingSmall';
      sublabelSlotClass = 'captionRegular !text-opacity-75';
    }
  })();

  // default padding
  let padding = 'py-3'
  // padding for when Switch used in the Suffix Slot
  if (suffix?.type?.name === 'Switch') {
    padding = 'py-[10.5px]'
    // padding for when Stepper used in the Suffix Slot
  } else if (suffix?.type?.name === 'Stepper') {
    padding = 'py-[6px]'
  }

  return (
    <div className={[props.className, listType, 'listItem_container'].join(' ')} onClick={handleClick} tabIndex={tabIndex}>
      <div className={["listItem relative", padding].join(' ')}>
        {notificationDot && <div className="listItem_notificationDot"></div>}
        {prefix && <div className="listItem_prefixSlot">{prefix}</div>}
        <div className="labelContainer">
          <div className={['listItem_labelSlot', labelSlotClass, props.labelClass].join(' ')}>{label}</div>
          {sublabel && <div className={['listItem_sublabelSlot', sublabelSlotClass].join(' ')}>{sublabel}</div>}
        </div>
        {suffix && <div className="listItem_suffixSlot">{suffix}</div>}
        {chevron && <div className="listItem_chevronSlot"><ChevronRight className="chevron" /></div>}
      </div>
    </div>
  );
};