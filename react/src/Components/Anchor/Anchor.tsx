import './Anchor.scss';
import React, { ReactElement } from 'react';

interface AnchorProps {
  label?: string | ReactElement;
  id?: string;
  anchorClass?: Array<string>;
  imgClass?: Array<string>;
  href?: string;
  onClick?: any;
  target?: '_self' | '_blank';
  src?: any;
  alt?: string;
  children?: any;
}

/**
 * Primary UI component for generating anchor elements
 * @param type of AnchorProps
 * @returns
 */
export const Anchor = function ({
  label,
  target = '_self',
  anchorClass = [],
  imgClass = [],
  src,
  alt = '',
  ...props
}: AnchorProps) {
  const handleClick = (e: any) => {
    if (props.onClick) {
      e.preventDefault();
      props.onClick(e);
    }
  }

  return (
    <a target={target} className={['anchor', ...anchorClass].join(' ')} onClick={handleClick} {...props}>
      {' '}
      {label || (
        <img src={src} className={[...imgClass].join(' ')} onClick={handleClick} alt={alt} />
      )}{' '}
    </a>
  );
};
