import "./SpiderGraph.scss";
import React, { useEffect, useState } from 'react';
import {
    Chart as ChartJS,
    RadialLinearScale,
    PointElement,
    LineElement,
    Filler,
    Tooltip,
    Legend
} from 'chart.js';
import { ResponsiveRadar } from "@nivo/radar";
import { SpiderGraphBackground } from "./SpiderGraphBackground";

import addons from '@storybook/addons';
import { DARK_MODE_EVENT_NAME } from 'storybook-dark-mode';
import { useSelector } from "react-redux";
import { getData } from "slices/dataSlice";

ChartJS.register(
    RadialLinearScale,
    PointElement,
    LineElement,
    Filler,
    Tooltip,
    Legend
);

const channel = addons.getChannel();

export const SpiderGraph = function ({ results }: {
    results: { [key: string]: number }
}) {
    const [isDark, setDark] = useState(false)
    const { data } = useSelector(getData);
    const { appearanceOption } = data

    useEffect(() => {
        // Add listener to update styles
        window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', e => setDark(e.matches));

        // Setup dark/light mode for the first time
        setDark((appearanceOption === 'dark' || (appearanceOption === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches)))

        // Remove listener
        return () => {
            window.matchMedia('(prefers-color-scheme: dark)').removeEventListener('change', () => {
            });
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useEffect(() => {
        // listen to DARK_MODE event
        channel.on(DARK_MODE_EVENT_NAME, setDark);
        return () => channel.off(DARK_MODE_EVENT_NAME, setDark);
    }, [setDark]);

    const chartData: { [key: string]: any }[] = [];

    const resultMapping = [0, 7, 20, 33, 46, 58]

    Object.keys(results).forEach((key) => {
        chartData.push({ key, value: resultMapping[results[key]] })
    })

    return (
        <div className="spiderGraph_container">
            <SpiderGraphBackground />
            <div className='SpiderGraphCanvas' role="img">
                <ResponsiveRadar
                    data={chartData}
                    keys={["value"]}
                    indexBy="taste"
                    maxValue={100}
                    margin={{
                        top: 0,
                        right: 0,
                        bottom: 0,
                        left: 0
                    }}
                    curve="cardinalClosed"
                    borderWidth={2}
                    borderColor={isDark ? '#F0C8AF' : '#815889'}
                    gridLevels={5}
                    gridShape="circular"
                    gridLabelOffset={36}
                    enableDots={false}
                    fillOpacity={0.25}
                    isInteractive={false}
                    colors={isDark ? '#F0C8AF' : '#815889'}
                    theme={{
                        grid: {
                            line: {
                                strokeWidth: 0
                            }
                        }
                    }}
                />
            </div>

        </div>
    )
};
