import React from 'react';
import facebookLogo from '../../img/facebook-square.svg';
import linkedInLogo from '../../img/linkedin-square.svg';
import instagramLogo from '../../img/instagram-square.svg';
import twitterLogo from '../../img/twitter-square.svg';

import { Anchor } from '../Anchor/Anchor';

export const Social = function () {
  return (
    <div className="social">
        <span className='text-blue-darkest'>{process.env.REACT_APP_ENVIRONMENT_LABEL}</span>

        <Anchor
            href='https://www.instagram.com'
            src={instagramLogo}
            anchorClass={['socialLink']}
            imgClass={['socialGlyph']}
        />
        <Anchor 
            href='https://www.facebook.com'
            src={facebookLogo}
            anchorClass={['socialLink']}
            imgClass={['socialGlyph']}
        />
        <Anchor
            href='https://www.twitter.com'
            src={twitterLogo}
            anchorClass={['socialLink']}
            imgClass={['socialGlyph']}
        />
        <Anchor 
            href='https://www.linkedin.com'
            src={linkedInLogo}
            anchorClass={['socialLink']}
            imgClass={['socialGlyph']}
        />

    </div>
  );
};
