import { Typography } from "Components/Typography/Typography";
import logo from "img/home_last_logo.svg";

export interface SelfAssessmentProps {
    answer?: any,
}

export const OnboardingEnd = function ({
    answer,
    ...props
}: SelfAssessmentProps) {
    return (
        <div className="flex flex-col h-[calc(90vh_-_8rem)]">
            <Typography usage="headingMedium" typeClass={['mb-2 text-left']}>Let’s get going by adding new habits or challenges to keep your brain fit</Typography>
            <Typography usage="body" typeClass={['mb-4 text-left']}>You can also add what you're already doing for even better results.</Typography>
            <div className="flex-1 relative mx-4">
                <div className="absolute flex justify-center items-center p-2 w-full h-full">
                    <img src={logo} alt="home logo" className="max-w-full max-h-full block w-full m-0" />
                </div>
            </div>
        </div>
    )
}
