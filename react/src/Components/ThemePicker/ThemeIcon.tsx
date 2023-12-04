import "./ThemePicker.scss";
import React, { useEffect, useState } from 'react';

import addons from '@storybook/addons';
import { DARK_MODE_EVENT_NAME } from 'storybook-dark-mode';

import { Typography } from "Components/Typography/Typography";
// import { ReactComponent as IconLightMode } from '../../img/Theme/theme_lightMode_colour.svg';
import { ThemePickerLightIcon } from "./ThemePickerLightIcon";
import { ThemePickerDarkIcon } from "./ThemePickerDarkIcon";
import { useSelector } from "react-redux";
import { getData } from "slices/dataSlice";

export interface ThemeIconProps {
    Icon?: any;
    label?: string;
    selected?: boolean;
    colour?: "purple" | "pink" | "red" | "orange" | "yellow" | "teal" | "green" | "blue" | "lightBlue" | "brown" | "grey" | "black";
    IconClass?: string[];
}

const channel = addons.getChannel();

export const ThemeIcon = function ({
    Icon,
    label,
    selected,
    colour,
    IconClass = [],
    ...props
}: ThemeIconProps) {

    const [isDark, setDark] = useState(false)
    const { data } = useSelector(getData);
    const [theme, setTheme] = useState(window.matchMedia('(prefers-color-scheme: dark)').matches ? "dark" : "light");

    useEffect(() => {
        window.matchMedia('(prefers-color-scheme: dark)')
            .addEventListener('change', event => {
                const colorScheme = event.matches ? "dark" : "light";
                setTheme(colorScheme);
            });

        return window.matchMedia('(prefers-color-scheme: dark)')
            .removeEventListener('change', event => {
                const colorScheme = event.matches ? "dark" : "light";
                setTheme(colorScheme);
            })
    }, []);

    useEffect(() => {
        setDark(data.appearanceOption === "dark" || (data.appearanceOption === "system" && theme === "dark"))
    }, [theme, data.appearanceOption]);

    useEffect(() => {
        // listen to DARK_MODE event
        channel.on(DARK_MODE_EVENT_NAME, setDark);
        return () => channel.off(DARK_MODE_EVENT_NAME, setDark);
    }, [setDark]);

    (() => {
        if (selected) {
            IconClass = [...IconClass, 'selected'];
        }
    })();

    return (
        <div className="ThemeIcon_container">
            {(isDark) ?
                <ThemePickerDarkIcon colour={colour} selected={selected} ThemePickerClass={['ThemeIcon', ...IconClass]} />
                :
                <ThemePickerLightIcon colour={colour} selected={selected} ThemePickerClass={['ThemeIcon', ...IconClass]} />
            }
            <Typography usage="body" typeClass={['ThemeIcon_label']}>{label}</Typography>
        </div>
    );

}

