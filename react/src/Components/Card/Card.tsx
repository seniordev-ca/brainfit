import './Card.scss';
import React from 'react';
// import { Button } from "Components/Button/Button";
// import { ReactComponent as ShareSVG } from '../../img/share.svg';
export interface CardProps {
  cardClass?: string[];
  cardType?: 'card-actionable' | 'card-notactionable';
  imgSrc?: string;
  imgCaption?: string;
  children?: any;
  onClick?: Function;
  cardScreen?: boolean;
}
export const Card = function ({
  cardClass = [],
  cardType,
  children,
  imgSrc,
  imgCaption,
  cardScreen,
  ...props
}: CardProps) {
  const handleClick = (e: any) => {
    if (props.onClick) {
      e.preventDefault();
      props.onClick(e);
    }
  };

  if (cardScreen) {
    cardClass = [...cardClass, 'cardScreen'];
  }

  var bgImage = { backgroundImage: `url(${imgSrc})` };
  return (
    <div
      data-testid="card"
      onClick={handleClick}
      className={[cardType, ...cardClass].join(' ')}
    >
      {imgSrc && (
        <div className="imgContainer" style={bgImage}>
          {imgCaption && <div className="imgCaption">{imgCaption}</div>}
        </div>
      )}

      {children ? children : <></>}
    </div>
  );
};
