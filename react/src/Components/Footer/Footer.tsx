import React from 'react';

import { Anchor } from '../Anchor/Anchor';
import { Social } from '../Social/Social';

export const Footer = () => {
    return (
        <footer className="text-white text-left">
            <div className="bg-gray-600">
                <div className="container mx-auto py-8 px-8 md:px-2">
                    <div className="w-11/12">
                        <div className="grid grid-rows-1 grid-flow-row md:grid-flow-col gap-4">
                            <div>
                                COMPANY LOGO
                            </div>
                            <div>
                                <div className="footer_header">SUPPORT</div>
                                <ul>
                                    <li>
                                        <Anchor
                                            anchorClass={[
                                                'footer_anchor'
                                            ]}
                                            href="tel:1-888-123-4567"
                                            id="footerAnchorID"
                                            label="About"
                                            target="_self"
                                        />
                                    </li>
                                    <li>
                                        <Anchor
                                            anchorClass={[
                                                'footer_anchor'
                                            ]}
                                            href="mailto:#"
                                            id="footerAnchorID"
                                            label="Email Us"
                                            target="_self"
                                        />
                                    </li>
                                    <li>
                                        <Anchor
                                            anchorClass={[
                                                'footer_anchor'
                                            ]}
                                            href="#"
                                            id="footerAnchorID"
                                            label="Chat"
                                            target="_self"
                                        /></li>
                                </ul>
                            </div>
                            <div>
                                <div className="footer_header">COMPANY</div>
                                <ul>
                                    <li>
                                        <Anchor
                                            anchorClass={[
                                                'footer_anchor'
                                            ]}
                                            href="#"
                                            id="footerAnchorID"
                                            label="About"
                                            target="_self"
                                        />
                                    </li>
                                    <li>
                                        <Anchor
                                            anchorClass={[
                                                'footer_anchor'
                                            ]}
                                            href="#"
                                            id="footerAnchorID"
                                            label="Blog"
                                            target="_self"
                                        />
                                    </li>
                                    <li>
                                        <Anchor
                                            anchorClass={[
                                                'footer_anchor'
                                            ]}
                                            href="#"
                                            id="footerAnchorID"
                                            label="Careers"
                                            target="_self"
                                        />
                                    </li>
                                    <li>
                                        <Anchor
                                            anchorClass={[
                                                'footer_anchor'
                                            ]}
                                            href="#"
                                            id="footerAnchorID"
                                            label="Press"
                                            target="_self"
                                        />
                                    </li>
                                    <li><Anchor
                                        anchorClass={[
                                            'footer_anchor'
                                        ]}
                                        href="#"
                                        id="footerAnchorID"
                                        label="Partners"
                                        target="_self"
                                    /></li>
                                </ul>
                            </div>
                            <div>
                                <div className="footer_header">LEGAL</div>
                                <ul>
                                    <li><Anchor
                                        anchorClass={[
                                            'footer_anchor'
                                        ]}
                                        href="#"
                                        id="footerAnchorID"
                                        label="Privacy"
                                        target="_self"
                                    /></li>
                                    <li><Anchor
                                        anchorClass={[
                                            'footer_anchor'
                                        ]}
                                        href="#"
                                        id="footerAnchorID"
                                        label="Terms"
                                        target="_self"
                                    /></li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div className="bg-gray-800">
                <div className="container mx-auto py-4 px-2">
                    <div className="flex flex-row justify-between">
                        <div>
                            © 2021 Company
                        </div>
                        <div>
                            <Social />
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    )
}

