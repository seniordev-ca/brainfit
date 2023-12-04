import "./Toast.scss";
import React, { useState } from 'react';

import { Typography } from "Components/Typography/Typography";
import IconSuccess from "../../img/icon_toast_success.svg"
import IconError from "../../img/icon_toast_error.svg"

interface ToastProps {
    type?: "success" | "error";
    content?: string;
    toastIcon?: string;
    fadeOut?: boolean;
}

export const Toast = function ({
    type,
    content,
    toastIcon,
    fadeOut,
    ...props
} : ToastProps) {
    let fadeInClass = "";
    const [fadeOutState, setFadeOutState] = useState(false);
    const [pointerEvent, setPointerEvent] = useState('');


    (() => {
        if (type === "success") {
            toastIcon = IconSuccess;
        } else {
            toastIcon = IconError;
        }

        if (fadeOut === undefined){
            fadeOut = true;
        }

        if (fadeOut === true){
            fadeInClass =  `${fadeOutState ? 'opacity-0' : 'opacity-100'} transition-opacity duration-500 ${pointerEvent}`;
            setTimeout(() => {
                setFadeOutState(true);
                setTimeout(() => {
                    setPointerEvent('hidden');
                }, 1000)
            }, 5000)
        }
    })();

    return (
        <div className={["toast_container", type, fadeInClass].join(' ')}>
            <div className="flex flex-row items-center">
                <div className="toastIcon_container">
                    <img src={toastIcon} className="toastIcon" alt=" " />
                </div>
                <div className="toastContents">
                    <Typography usage="captionMedium" content={content} />
                </div>
            </div>
        </div>
    );

};