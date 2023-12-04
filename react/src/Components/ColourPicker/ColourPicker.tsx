import React, { ReactElement } from 'react';
import { getProperHabitCss } from "helpers/utils";
import { ColourDot } from 'Components/ColourDot/ColourDot'

export interface ColourPickerProps {
    selectedColour?: any;
    setSelectedColour?: any;
}

export const ColourPicker = function ({
    selectedColour,
    setSelectedColour,
    ...props
}: ColourPickerProps): ReactElement {

    const colourList = [
        "purple,mental",
        "pink",
        "red,exercise",
        "orange,social",
        "yellow,sleep",
        "teal",
        "green,nutrition",
        "blue,stress",
        "lightBlue",
        "brown",
        "grey",
        "black"
    ];


    const isSelectedColour = (currentColour: string): boolean => {
        if (currentColour.split(',').includes(getProperHabitCss(selectedColour) ?? '')) {
            console.log(selectedColour);
            return true
        }
        else {
            return false
        }
    }

    return (
        <div>
            <div className="grid grid-cols-6 gap-5 justify-items-center" data-testid="colourPickerGrid">
                {colourList.map((colour) => (
                    <div onClick={() => setSelectedColour(colour.split(',')[0])}>
                        <ColourDot dotColour={colour.split(',')[0]} selected={isSelectedColour(colour)} />
                    </div>
                ))}
            </div>
        </div>
    );
};
