import { Typography } from 'Components/Typography/Typography';
import React from 'react';
import './BottomSheetHeader.scss'

export interface BottomSheetHeaderProps {
  title: string;
  leftSideActionLabel?: string;
  leftSideActionOnClick?: () => void;
  rightSideActionLabel?: string;
  rightSideActionOnClick?: () => void;
}

export const BottomSheetHeader = function ({
  title,
  leftSideActionLabel,
  leftSideActionOnClick,
  rightSideActionLabel,
  rightSideActionOnClick
}: BottomSheetHeaderProps) {
  return (
    <div className="inline-flex justify-between w-full mb-4">
      <Typography
        typeClass={['left_action_header_primary']}
        usage="body"
        content={leftSideActionLabel}
        onClick={leftSideActionOnClick}
      />
      <Typography
        typeClass={[
          'title_header_neutral absolute left-1/2 -translate-x-1/2'
        ]}
        usage="headingSmall"
        content={title}
      />
      <Typography
        typeClass={['right_action_header_primary']}
        usage="headingSmall"
        content={rightSideActionLabel}
        onClick={rightSideActionOnClick}
      />
    </div>
  );
};
