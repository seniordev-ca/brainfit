import React from 'react';
import './ListGroup.scss';

interface ListGroupProps {
  listGroupType?: 'listGroup_primary' | 'listGroup_secondary';
  heading?: string;
  items?: React.ReactNode[];
}

export const ListGroup = function ({
  listGroupType = 'listGroup_primary',
  heading,
  items = [],
  ...props
}: ListGroupProps) {
  return (
    <div className={listGroupType}>
      <div className="listGroup_container">
        <div className="listGroup_heading">{heading}</div>
        <div className="listGroup_items_container">
          {items.map((item, i) => {
            return (
              <div className="listGroup_items" key={`lgI-${i}`}>
                {item}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
