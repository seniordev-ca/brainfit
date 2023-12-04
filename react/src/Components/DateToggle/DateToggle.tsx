import "./DateToggle.scss";
import React from 'react';
import { Typography } from "Components/Typography/Typography";

export interface DateToggleProps {
    selected?: boolean;
    label?: string;
    onClick?: Function;
}

export const DateToggle = function ({
    selected,
    label,
    ...props
} : DateToggleProps) {

    return (
        <div className="dateToggle_container" onClick={(e) => props.onClick && props.onClick(e)}>
            <div className={["dateToggle_circle", selected].join(' ')}></div>
            <div><Typography usage="historyRegular">{ label }</Typography></div>
        </div>
    );

};