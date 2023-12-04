import './CardAward.scss';
import React from 'react';
import { Card } from 'Components/Card/Card';
import { Typography } from 'Components/Typography/Typography';

import { ReactComponent as AwardRibbon } from '../../img/icon_awardRibbon.svg';
import { ReactComponent as Share } from '../../img/icon_share.svg';

interface CardAwardProps {
    awardEarned?: boolean;
    awardTitle?: string;
    awardDescription?: string;
}

export const CardAward = function ({
    awardEarned,
    awardTitle,
    awardDescription,
    ...props
}: CardAwardProps) {

    var cardOpacity;
    if (awardEarned) {
        cardOpacity = "opacity-100"
    } else {
        cardOpacity = "opacity-50"
    }

    return (
        <Card cardType='card-notactionable' cardClass={[cardOpacity]}>
            <div className="flex flex-row items-center">
                <div className="flex-shrink"><AwardRibbon className="w-9 mr-4" /></div>
                <div className="flex-grow py-2">
                    <div><Typography usage='headingSmall'>{awardTitle}</Typography></div>
                    <div><Typography usage='body'>{awardDescription}</Typography></div>
                </div>
                {awardEarned && 
                    <div className="flex-shrink ml-4">
                        <Share />
                    </div>
                }
            </div>
        </Card>
    );

};