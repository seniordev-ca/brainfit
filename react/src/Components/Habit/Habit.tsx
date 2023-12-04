import React from 'react';
import chevronRight from '../../img/chevron-right.svg';

interface HabitProps {
  title: string;
  onClick: () => void;
  bolded?: boolean;
}

export const Habit = function ({
  title,
  onClick,
  bolded,
  ...props
}: HabitProps) {
  const titleClasses = ['inline-block', 'align-middle'];

  if (bolded) {
    titleClasses.push('font-bold');
  }
  return (
    <li
      className="m-2 p-4 bg-mom_purple-medium rounded list-none"
      onClick={onClick}
    >
      <div>
        <span className={titleClasses.join(' ')}> {title}</span>
        <img
          className="inline-block align-middle float-right w-4"
          alt="Habit"
          src={chevronRight}
        />
      </div>
    </li>
  );
};
