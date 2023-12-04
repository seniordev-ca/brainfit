import "./CardChallenge.scss";
import React from 'react';
import { Card } from 'Components/Card/Card';
import { Typography } from 'Components/Typography/Typography';
import { BarSegment } from 'Components/BarSegment/BarSegment';

interface CardChallengeProps {
    cardType?: 'card-actionable' | 'card-notactionable';
    challengeName?: string;
    totalDuration: number;
    completedDuration: number;
    timeUnit?: any;
    Icon?: any;
    onClick?: () => void;
}

export const CardChallenge = function ({
    cardType = "card-actionable",
    challengeName,
    totalDuration,
    completedDuration,
    timeUnit,
    Icon,
    onClick,
    ...props
}: CardChallengeProps) {

    let percentComplete = completedDuration / totalDuration * 100;

    return (
        <div className="CardChallenge" onClick={onClick}>
            <Card cardType={cardType}>
                <div className="flex flex-row items-center w-full">
                    {Icon ?
                        <div className="icon_container">
                            <div className="self-center">
                                <Icon />
                            </div>
                        </div>
                        : ''}
                    <div className="flex flex-col flex-grow">
                        <Typography usage="headingSmall" >{challengeName}</Typography>
                        <Typography usage="captionRegular" typeClass={['opacity-75 mb-2']}>{completedDuration} of {totalDuration} {timeUnit} completed</Typography>
                        <BarSegment horizontal percentComplete={percentComplete} />
                    </div>
                </div>
            </Card>
        </div>
    );

}