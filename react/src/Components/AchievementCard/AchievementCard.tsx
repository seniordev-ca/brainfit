import incomplete from '../../img/incomplete.png';
import award from '../../img/award.png';
import './AchievementCard.scss'

interface AchievementCardProps {
  title: string;
  awardID: string;
  completed: boolean;
  onClick: () => void;
}

//The UI for the items to be shown inside the grid
export const AchievementCard = ({ title, awardID, completed, onClick }: AchievementCardProps) => (
  <div data-testid="achievementCardTestID" onClick={() => onClick()}>
    <img className={completed ? "star" : "incomplete"} src={completed ? award : incomplete} alt="Loading..." />
    <h3>{title}</h3>
  </div>
)