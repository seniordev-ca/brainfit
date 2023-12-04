import "./ThemePicker.scss";
import React from 'react';

import { Typography } from "Components/Typography/Typography";
import { ListItem } from "Components/ListItem/ListItem";
import { ListGroup } from "Components/ListGroup/ListGroup";
import { ThemeIcon } from "./ThemeIcon";
import { ColourPicker } from "Components/ColourPicker/ColourPicker";
import { getData } from 'slices/dataSlice';
import { ReactComponent as IconCheck } from '../../img/icon_check.svg';
import { useDispatch, useSelector } from "react-redux";
import { setDataFieldWithID } from "slices/dataSlice";

export interface ThemePickerProps {
    mono?: boolean
    colour?: any
    setColour?: any
}

export const ThemePicker = function ({
    mono,
    colour,
    setColour,
    ...props
}: ThemePickerProps) {
    const { data } = useSelector(getData);
    const appearanceList = [
        {
            selected: true,
            text: 'System'
        },
        {
            selected: false,
            text: 'Light'
        },
        {
            selected: false,
            text: 'Dark'
        }
    ];

    const dispatch = useDispatch();

    const listType = () =>
        appearanceList.map((option, _idx) => (
            <ListItem
                label={option.text}
                chevron={false}
                onClick={() => {
                    individualOption(option.text.toLowerCase());
                }}
                suffix={
                    (data.appearanceOption && option.text.toLowerCase() === data.appearanceOption.toLowerCase()) || (!data.appearanceOption && option.text === 'System') ? (
                        <IconCheck />
                    ) : (
                        <></>
                    )
                }
            />
        ));

    function individualOption(option: string) {
        dispatch(setDataFieldWithID({ id: 'appearanceOption', value: option }));
    }

    function monoChromaticOption(option: boolean) {
        dispatch(setDataFieldWithID({ id: 'monoOption', value: option }));
    }

    function setSelectedColourFunction(colour: string) {
        setColour(colour);
        dispatch(setDataFieldWithID({ id: 'colourOption', value: colour }));
    }

    return (
        <div className="ThemePicker">
            <Typography usage="headingSmall" typeClass={['ThemePicker_heading']}>Theme</Typography>
            <div className="mb-8">
                <ListGroup listGroupType="listGroup_primary"
                    items={listType()}
                />
            </div>
            <Typography usage="headingSmall" typeClass={['ThemePicker_heading mb-2']}>Colours</Typography>
            <div className="ThemePicker_container">
                <div onClick={() => monoChromaticOption(false)}>
                    <ThemeIcon label="Default" selected={!data.monoOption} />
                </div>
                <div onClick={() => monoChromaticOption(true)}>
                    <ThemeIcon label="Mono" colour={colour} selected={data.monoOption} />
                </div>
            </div>
            {data.monoOption ?
                <div>
                    <ColourPicker selectedColour={colour} setSelectedColour={setSelectedColourFunction} />
                </div>
                :
                ''
            }
        </div>
    );

}