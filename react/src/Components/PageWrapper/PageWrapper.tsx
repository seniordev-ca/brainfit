import "./PageWrapper.scss";
import React, { useEffect, useState } from 'react';
import { Keyboard } from '@capacitor/keyboard';

export const PageWrapper = function ({ children, sidesOnly = false, modal = false, keyboardPadding = false }: { children?: React.ReactNode, sidesOnly?: boolean, modal?: boolean, keyboardPadding?: boolean }) {

    const [height, setHeight] = useState(0);
    useEffect(() => {
        if (keyboardPadding) {
            Keyboard.addListener('keyboardWillShow', info => {
                setHeight(info.keyboardHeight)
            });
            Keyboard.addListener('keyboardWillHide', () => {
                setHeight(0)
            });
        }
    }, [keyboardPadding])

    return (
        <div className={`${modal ? ' modalState' : 'modalClosed'}`}>
            <div data-body-scroll-lock-ignore="true" className={`pageWrapper${sidesOnly ? ' sidesOnly' : ''} ${modal ? ' modal' : ''}`}>
                {children}
                <div style={{ paddingBottom: `${height}px` }}>

                </div>
            </div>
        </div>
    )
}