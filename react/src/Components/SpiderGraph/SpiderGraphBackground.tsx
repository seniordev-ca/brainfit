import "./SpiderGraph.scss";
import React, { ReactElement } from 'react';

export interface SpiderGraphBackgroundProps {
    
}

export const SpiderGraphBackground = ({

    ...props
}: SpiderGraphBackgroundProps): 
ReactElement => {

    return (
        <div className="spiderGraph">
            <svg viewBox="0 0 330 330" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M162.5,154.4c1.5-0.9,3.5-0.9,5,0l5.4,3.1c1.5,0.9,2.5,2.5,2.5,4.3v6.2c0,1.8-1,3.4-2.5,4.3l-5.4,3.1 c-1.5,0.9-3.5,0.9-5,0l-5.4-3.1c-1.5-0.9-2.5-2.5-2.5-4.3v-6.2c0-1.8,1-3.4,2.5-4.3L162.5,154.4z" stroke="#E1E1E1" stroke-width="2" className="grid" />
                <path d="M160,133.9c3.1-1.8,6.9-1.8,10,0l19.4,11.2c3.1,1.8,5,5.1,5,8.7v22.5c0,3.6-1.9,6.9-5,8.7L170,196.1 c-3.1,1.8-6.9,1.8-10,0l-19.4-11.2c-3.1-1.8-5-5.1-5-8.7v-22.5c0-3.6,1.9-6.9,5-8.7L160,133.9z" stroke="#E1E1E1" stroke-width="2" className="grid" />
                <path d="M157.5,113.3c4.6-2.7,10.4-2.7,15,0l33.5,19.3c4.6,2.7,7.5,7.6,7.5,13v38.7c0,5.4-2.9,10.3-7.5,13l-33.5,19.3 c-4.6,2.7-10.4,2.7-15,0L124,197.3c-4.6-2.7-7.5-7.6-7.5-13v-38.7c0-5.4,2.9-10.3,7.5-13L157.5,113.3z" stroke="#E1E1E1" stroke-width="2" className="grid" />
                <path d="M155,92.8c6.2-3.6,13.8-3.6,20,0l47.6,27.5c6.2,3.6,10,10.2,10,17.3v54.9c0,7.1-3.8,13.7-10,17.3L175,237.2 c-6.2,3.6-13.8,3.6-20,0l-47.6-27.5c-6.2-3.6-10-10.2-10-17.3v-54.9c0-7.1,3.8-13.7,10-17.3L155,92.8z" stroke="#E1E1E1" stroke-width="2" className="grid" />
                <path d="M152.5,72.2c7.7-4.5,17.3-4.5,25,0l61.6,35.6c7.7,4.5,12.5,12.7,12.5,21.7v71.1c0,8.9-4.8,17.2-12.5,21.7 l-61.6,35.6c-7.7,4.5-17.3,4.5-25,0l-61.6-35.6c-7.7-4.5-12.5-12.7-12.5-21.7v-71.1c0-8.9,4.8-17.2,12.5-21.7L152.5,72.2z" stroke="#E1E1E1" stroke-width="2" className="grid" />
                <circle cx="165" cy="53" r="4" fill="#BA5050" className="circleExercise" />
                <circle cx="165" cy="277" r="4" fill="#D98355" className="circleSocial" />
                <circle cx="262" cy="217" r="4" fill="#4E7FAD" className="circleStress" />
                <circle cx="69" cy="217" r="4" fill="#AA6CBC" className="circleMental" />
                <circle cx="262" cy="113" r="4" fill="#7B8A58" className="circleNutrition" />
                <circle cx="69" cy="113" r="4" fill="#EDBB32" className="circleSleep" />
                <text transform="matrix(1 0 0 1 135.33 37.5909)" className="label">Exercise</text>
                <text transform="matrix(1 0 0 1 143.985 302.591)" className="label">Social</text><text transform="matrix(1 0 0 1 139.405 319.591)" className="label">activity</text>                
                <text transform="matrix(1 0 0 1 247.284 97.5909)" className="label">Nutrition</text>
                <text transform="matrix(1 0 0 1 34.4551 97.5909)" className="label">Sleep</text>
                <text transform="matrix(1 0 0 1 252.844 242.591)" className="label">Stress</text><text transform="matrix(1 0 0 1 230.032 259.591)" className="label">management</text>
                <text transform="matrix(1 0 0 1 23.7373 242.591)" className="label">Mental</text><text transform="matrix(1 0 0 1 9.2793 259.591)" className="label">stimulation</text>
            </svg>
        </div>
    );
}