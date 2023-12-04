import React from 'react';
import { useEffect, useState } from 'react';
import NetworkHelper from 'helpers/web/networkHelper';
import { getAuth } from 'firebase/auth';
import 'reactjs-popup/dist/index.css';
import 'react-sharingbuttons/dist/main.css';
import { AchievementCard } from 'Components/AchievementCard/AchievementCard';
import { Button } from 'Components/Button/Button';
import { Modal } from 'Components/Modal/Modal';
import { addNotification } from 'slices/dataSlice';
import store from 'store/store';
import { NotificationItem } from 'types/types';

const { Facebook, Twitter } = require('react-sharingbuttons');

interface ServerAchievement {
    AchievementID: string;
    EarnedAt: string;
}

export const Awards = () => {
    const [showState, setShowState] = useState(false);
    const [socialAchievementText, setSocialAchievementText] = useState('');
    const [completedAwardIDs, setCompletedAwardIDs] = useState<string[]>([]);
    //An array of objects
    const awardList = [
        {
            id: 0,
            title: 'Tracked your first habit',
            awardId: "trackedFirstActivity"
        },
        {
            id: 1,
            title: 'Created your first custom habit',
            awardId: "firstCustomHabit"
        },
        {
            id: 2,
            title: 'Viewed your first article',
            awardId: "viewedFirstArticle"
        },
        {
            id: 3,
            title: 'Completed your first questionnaire',
            awardId: "completeQuestionaire"
        },
        {
            id: 4,
            title: 'Test Award',
            awardId: "testAward"
        }
    ];

    useEffect(() => {
        const auth = getAuth();
        if (auth.currentUser !== null) {
            NetworkHelper.getAchievementData().then((data) => {
                if (data) {
                    const completedIDs = data.achievements.map((achievement: ServerAchievement) => achievement.AchievementID)
                    console.log(completedIDs)
                    setCompletedAwardIDs(completedIDs);
                }
            });
        }
    }, []);

    const url = "https://womensbrainhealth.org/mind-over-matter-magazine";
    const shareText = 'Check this site!';

    function showSocialModal(achievementTitle: string) {
        console.log("Show social")
        console.log(showState)
        setShowState(!showState);
        setSocialAchievementText(achievementTitle);
    }

    function recordAchievement(props: string) {
        const auth = getAuth();
        if (auth.currentUser !== null) {
            NetworkHelper.recordAchievement(props);
            const notificationItem: NotificationItem = { 
                id: new Date().getTime(),
                title: `You received an award`,
                subtitle: props,
                notify: true
            };
            store.dispatch(addNotification(notificationItem));
        }
    }

    function isAwardCompleted(awardID: string): boolean {
        return completedAwardIDs.includes(awardID)
    }

    return (
        <div>
            <h1>Award Page</h1>
            <div className='grid grid-cols-4'>
                {awardList.length > 0 ?
                    awardList.map(item => <AchievementCard key={item.id} onClick={() => showSocialModal(item.title)} title={item.title} awardID={item.awardId} completed={isAwardCompleted(item.awardId)} />) :
                    (<p>No awards are found.</p>)}
            </div>
            <Button data-testid='recordButton' label='Free Award (Test)' buttonType='btn-primary' onClick={() => recordAchievement("testAward")} />

            <Modal showModal={showState} title='Share Your Award on Social Media!'>
                <div>
                    {socialAchievementText}
                    <Facebook url={url} />
                    <Twitter url={url} shareText={shareText} />
                    <Button onClick={() => setShowState(false)}>
                        Close
                    </Button>
                </div>
            </Modal>
        </div>
    );
}
