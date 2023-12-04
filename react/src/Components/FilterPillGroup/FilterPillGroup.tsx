import "./FilterPillGroup.scss";
import React, { ReactElement } from 'react';

interface FilterPillGroupProps {
    items?: ReactElement[];
}

export const FilterPillGroup = function ({
    items = [],
    ...props
}: FilterPillGroupProps) {

    return (
        <div className="filterPillGroup_container">
            { items.map((item) => {
                return (
                    <div className="filterPill_container">{item}</div>
                )
            })}
        </div>
    );

};