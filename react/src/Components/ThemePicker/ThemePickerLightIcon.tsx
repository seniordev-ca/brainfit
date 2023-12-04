import "./ThemePicker.scss";
import React, { ReactElement } from 'react';

export interface ThemePickerLightIconProps {
    colour?: "purple" | "pink" | "red" | "orange" | "yellow" | "teal" | "green" | "blue" | "lightBlue" | "brown" | "grey" | "black";
    stroke?: boolean;
    selected?: boolean;
    ThemePickerClass?: string[];
}

export const ThemePickerLightIcon = ({
    colour,
    stroke,
    selected,
    ThemePickerClass = [],
    ...props
}: ThemePickerLightIconProps): 
ReactElement => {

    let strokeColour = "white"
    if (selected && colour) {
        strokeColour = colour;
    } else if (selected) {
        strokeColour = "primary"
    }

    return (
        <svg width="98" height="112" viewBox="0 0 98 112" fill="none" xmlns="http://www.w3.org/2000/svg" className={ThemePickerClass.join(' ')}>
            <rect x="4" y="1" width="90" height="110" rx="7" fill="white" stroke="white" stroke-width="2" className={`selectedStroke stroke-${strokeColour}`} />
            <g filter="url(#filter0_dd_607_12752)">
                <rect x="11" y="44" width="76" height="24" rx="4" fill="white"/>
            </g>
            <circle opacity="0.25" cx="20.7769" cy="56.0001" r="6.22222" fill="#4E7FAD" className={`miniIcon2 fill-${colour}`} />
            <g clip-path="url(#clip0_607_12752)">
                <circle cx="20.7688" cy="55.9935" r="2.22" fill="#4E7FAD" className={`miniIcon2 fill-${colour}`}/>
            </g>
            <rect x="30.5547" y="51" width="39.4445" height="3.25688" rx="1.62844" fill="#E1E1E1"/>
            <rect x="30.5547" y="58.2569" width="30.6667" height="3" rx="1.5" fill="#E1E1E1"/>
            <g filter="url(#filter1_dd_607_12752)">
                <rect x="11" y="16" width="76" height="24" rx="4" fill="white"/>
            </g>
            <circle opacity="0.25" cx="20.7769" cy="28.0001" r="6.22222" fill="#46304B" className={`miniIcon1 fill-${colour}`}/>
            <g clip-path="url(#clip1_607_12752)">
                <rect x="18.5488" y="25.7735" width="4.44" height="4.44" fill="#46304B" className={`miniIcon1 fill-${colour}`}/>
            </g>
            <rect x="30.5547" y="23" width="39.4445" height="3.25688" rx="1.62844" fill="#E1E1E1"/>
            <rect x="30.5547" y="30.2569" width="30.6667" height="3" rx="1.5" fill="#E1E1E1"/>
            <g filter="url(#filter2_dd_607_12752)">
                <rect x="11" y="72" width="76" height="24" rx="4" fill="white"/>
            </g>
            <circle opacity="0.25" cx="20.7769" cy="84.0001" r="6.22222" fill="#BA5050" className={`miniIcon3 fill-${colour}`}/>
            <g clip-path="url(#clip2_607_12752)">
                <path d="M20.7761 85.606L22.6402 86.7311L22.1455 84.6106L23.7925 83.1838L21.6237 82.9968L20.7761 81L19.9285 82.9968L17.7598 83.1838L19.4037 84.6106L18.912 86.7311L20.7761 85.606Z" fill="#BA5050" className={`miniIcon3 fill-${colour}`}/>
            </g>
            <rect x="30.5547" y="79" width="39.4445" height="3.25688" rx="1.62844" fill="#E1E1E1"/>
            <rect x="30.5547" y="86.2569" width="30.6667" height="3" rx="1.5" fill="#E1E1E1"/>
            <defs>
            <filter id="filter0_dd_607_12752" x="0.333333" y="35.1111" width="97.3333" height="45.3333" filterUnits="userSpaceOnUse" color-interpolation-filters="sRGB">
                <feFlood flood-opacity="0" result="BackgroundImageFix"/>
                <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha"/>
                <feOffset dy="1.77778"/>
                <feGaussianBlur stdDeviation="5.33333"/>
                <feComposite in2="hardAlpha" operator="out"/>
                <feColorMatrix type="matrix" values="0 0 0 0 0.933333 0 0 0 0 0.933333 0 0 0 0 0.933333 0 0 0 1 0"/>
                <feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow_607_12752"/>
                <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha"/>
                <feOffset dy="0.888889"/>
                <feGaussianBlur stdDeviation="0.888889"/>
                <feComposite in2="hardAlpha" operator="out"/>
                <feColorMatrix type="matrix" values="0 0 0 0 0.258824 0 0 0 0 0.278431 0 0 0 0 0.298039 0 0 0 0.06 0"/>
                <feBlend mode="normal" in2="effect1_dropShadow_607_12752" result="effect2_dropShadow_607_12752"/>
                <feBlend mode="normal" in="SourceGraphic" in2="effect2_dropShadow_607_12752" result="shape"/>
            </filter>
            <filter id="filter1_dd_607_12752" x="0.333333" y="7.11111" width="97.3333" height="45.3333" filterUnits="userSpaceOnUse" color-interpolation-filters="sRGB">
                <feFlood flood-opacity="0" result="BackgroundImageFix"/>
                <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha"/>
                <feOffset dy="1.77778"/>
                <feGaussianBlur stdDeviation="5.33333"/>
                <feComposite in2="hardAlpha" operator="out"/>
                <feColorMatrix type="matrix" values="0 0 0 0 0.933333 0 0 0 0 0.933333 0 0 0 0 0.933333 0 0 0 1 0"/>
                <feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow_607_12752"/>
                <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha"/>
                <feOffset dy="0.888889"/>
                <feGaussianBlur stdDeviation="0.888889"/>
                <feComposite in2="hardAlpha" operator="out"/>
                <feColorMatrix type="matrix" values="0 0 0 0 0.258824 0 0 0 0 0.278431 0 0 0 0 0.298039 0 0 0 0.06 0"/>
                <feBlend mode="normal" in2="effect1_dropShadow_607_12752" result="effect2_dropShadow_607_12752"/>
                <feBlend mode="normal" in="SourceGraphic" in2="effect2_dropShadow_607_12752" result="shape"/>
            </filter>
            <filter id="filter2_dd_607_12752" x="0.333333" y="63.1111" width="97.3333" height="45.3333" filterUnits="userSpaceOnUse" color-interpolation-filters="sRGB">
                <feFlood flood-opacity="0" result="BackgroundImageFix"/>
                <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha"/>
                <feOffset dy="1.77778"/>
                <feGaussianBlur stdDeviation="5.33333"/>
                <feComposite in2="hardAlpha" operator="out"/>
                <feColorMatrix type="matrix" values="0 0 0 0 0.933333 0 0 0 0 0.933333 0 0 0 0 0.933333 0 0 0 1 0"/>
                <feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow_607_12752"/>
                <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha"/>
                <feOffset dy="0.888889"/>
                <feGaussianBlur stdDeviation="0.888889"/>
                <feComposite in2="hardAlpha" operator="out"/>
                <feColorMatrix type="matrix" values="0 0 0 0 0.258824 0 0 0 0 0.278431 0 0 0 0 0.298039 0 0 0 0.06 0"/>
                <feBlend mode="normal" in2="effect1_dropShadow_607_12752" result="effect2_dropShadow_607_12752"/>
                <feBlend mode="normal" in="SourceGraphic" in2="effect2_dropShadow_607_12752" result="shape"/>
            </filter>
            <clipPath id="clip0_607_12752">
                <rect width="5.33333" height="5.33333" fill="white" transform="translate(18.1094 53.3335)"/>
            </clipPath>
            <clipPath id="clip1_607_12752">
                <rect width="5.33333" height="5.33333" fill="white" transform="translate(18.1094 25.3335)"/>
            </clipPath>
            <clipPath id="clip2_607_12752">
                <rect width="6.44792" height="6.44792" fill="white" transform="translate(17.5527 80.7762)"/>    
            </clipPath>
            </defs>
        </svg>
        
    );
}