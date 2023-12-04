import "./FilterPill.scss";
import React from 'react';

interface FilterPillProps {
    label?: any;
    selected?: boolean;
}

export const FilterPill = function ({
    label,
    selected,
    ...props
}: FilterPillProps) {

    return (
        <div className={['filterPill', selected].join(' ')}>
            {label}
        </div>
    );

};