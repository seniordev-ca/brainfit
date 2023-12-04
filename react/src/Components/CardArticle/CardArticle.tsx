import './CardArticle.scss';
import React from 'react';
import { Card } from 'Components/Card/Card';
import { Typography } from 'Components/Typography/Typography';
import { HabitPillar } from 'types/types';

export interface CardArticleProps {
  articleTitle?: string;
  articlePillar?: HabitPillar;
  articleHabits?: string;
  articleDate?: string;
  articleImg?: string;
  onClick?: Function;
}

export const CardArticle = function ({
  articleTitle,
  articlePillar,
  articleHabits,
  articleDate,
  articleImg,
  ...props
}: CardArticleProps) {
  const handleClick = (e: any) => {
    if (props.onClick) {
      e.preventDefault();
      props.onClick(e);
    }
  };

  return (
    <Card
      cardType="card-actionable"
      imgSrc={articleImg}
      onClick={handleClick}
    >
      <div className="flex flex-col">
        <div
          style={{
            display: 'flex',
            justifyContent: 'left'
          }}
        >
          <Typography
            usage="headingSmall"
            typeClass={['articleTitle']}
            content={articleTitle}
          />
        </div>
        <div
          style={{
            display: 'flex',
            justifyContent: 'left'
          }}
        >
          <Typography
            usage="body"
            typeClass={['articlePillar']}
            content={articlePillar}
          />
        </div>
        <Typography
          usage="body"
          typeClass={['articleHabits']}
          content={articleHabits}
        />
      </div>
    </Card>
  );
};
