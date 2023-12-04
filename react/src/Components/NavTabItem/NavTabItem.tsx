import "./NavTabItem.scss";
import React from 'react';
import { Typography } from '../Typography/Typography';

export interface NavTabItemProps {
  IconActive?: any;
  IconInactive?: any;
  label?: string;
  iconState?: boolean;
  onClick?: any;
}

export const NavTabItem = function ({
  IconActive,
  IconInactive,
  label,
  iconState = false,
  ...props
}: NavTabItemProps) {
  return (
    <div className="NavTabItem_Container" { ...props.onClick ? { onClick: props.onClick } : {} } >
      <div className="NavTabItem_Image">{iconState ? <IconActive /> : <IconInactive />}</div>
      <Typography usage="tabBar" typeClass={['NavTabItem_Label']} content={label} />
    </div>
  );
};
