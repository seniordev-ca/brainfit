import "./CardStats.scss";
import React from 'react';
import { Card } from "Components/Card/Card";
import { Typography } from "Components/Typography/Typography";
import { HabitIcon } from "Components/HabitIcon/HabitIcon";
import { BarChartItem } from "Components/BarChartItem/BarChartItem";

// import { ReactComponent as StatCompletionSVG } from '../img/icon_stats_completion.svg';
// import { ReactComponent as StatLongestSVG } from '../img/icon_stats_longest.svg';
// import { ReactComponent as StatStreakSVG } from '../img/icon_stats_streak.svg';
// import StatStreakSVG from '../img/icon_stats_streak.svg';
// import { ReactComponent as StatTotalSVG } from '../img/icon_stats_total.svg';

interface CardStatsProps {
    Icon?: any,
    habitColour?: any,
    habitName?: any,
    habitPillar?: any,
    chartConfiguration?: CardChartConfiguration
}

export interface CardChartData {
    label: string
    percentComplete: number
}

export interface CardChartConfiguration {
    backgroundColourClass?: string
    data: CardChartData[]
}

export const CardStats = function ({
    Icon,
    habitColour,
    habitName,
    habitPillar,
    chartConfiguration,
    ...props
} : CardStatsProps) {

    return (
        <Card cardType="card-actionable">
            <div className="flex flex-row items-center mb-8">
                <div className="w-14">
                    <HabitIcon habitColour={habitColour} Icon={Icon} />
                </div>
                <div className="flex-grow pl-2">
                    <Typography usage="headingSmall" content={habitName} />
                    <Typography usage="body" typeClass={['opacity-50']} content={habitPillar} />
                </div>
            </div>
            <div className="grid grid-cols-7 h-32 w-full justify-between">
                { chartConfiguration && chartConfiguration.data.map((entry) => {
                    return (
                        <div key={entry.label}>
                            <BarChartItem 
                                horizontal={false} 
                                percentComplete={entry.percentComplete} 
                                showPercentageLabel={false} 
                                label={entry.label} 
                                foregroundColourClass={habitColour} 
                                backgroundColourClass={[habitColour, "!bg-opacity-25"].join(' ')}
                            />
                        </div>
                    )
                })}
            </div>
            {/* <div className="grid grid-cols-2 mt-6">
                <div>
                    <div className="flex flex-row items-center">
                        <div>
                            <img src={StatStreakSVG} />
                        </div>
                        <div>
                            <Typography usage="body" content="Streak:" typeClass={['inline']} /> <Typography usage="body" content="5" typeClass={['!font-bold inline']} />
                        </div> 
                    </div>
                </div>
                <div>b</div>
                <div>c</div>
                <div>d</div>
            </div> */}
        </Card>
    )

};