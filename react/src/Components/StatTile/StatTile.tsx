import { Card } from 'Components/Card/Card';
import { Typography } from 'Components/Typography/Typography';
import './StatTile.scss';

type StatTileProps = {
  Icon: any;
  value: any;
  stat: any;
};

export function StatTile({ Icon, value, stat }: StatTileProps) {
  return (
    <>
      <Card cardType={'card-notactionable'}>
        <div className={'mb-6 w-6 h-6 streaks_icons'}>
          {Icon}
        </div>
        <Typography usage="captionMedium" content={value} />
        <div className="opacity-50">
          <Typography usage="captionRegular" content={stat} />
        </div>
      </Card>
    </>
  );
}
