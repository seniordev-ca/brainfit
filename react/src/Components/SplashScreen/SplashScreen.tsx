import './SplashScreen.scss';

export interface SplashScreenProps {
  splashScreenClass?: string;
  backgroundColor?: string;
  centerContent?: React.ReactElement;
  bottomContent?: React.ReactElement;
  topContent?: React.ReactElement;
  centerClass?: string;
  topClass?: string;
  bottomClass?: string;
  centerStyle?: React.CSSProperties;
  topStyle?: React.CSSProperties;
  bottomStyle?: React.CSSProperties;
  splashScreenStyle?: React.CSSProperties;
}

export const SplashScreen = function ({
  splashScreenClass = '',
  backgroundColor = '#6D4A74',
  centerClass = '',
  topClass = '',
  bottomClass = '',
  ...props
}: SplashScreenProps) {
  return (
    <div className={['splash-screen', splashScreenClass].join(' ')} style={{
      backgroundColor
    }} >
      <div className={"splash-screen-content"} style={props.splashScreenStyle}>
        <div className={["splash-screen-top", topClass].join(' ')} style={props.topStyle}>
          {props.topContent || <></>}
        </div>
        <div className={["splash-screen-center", centerClass].join(' ')} style={props.centerStyle}>
          {props.centerContent || <></>}
        </div>
        <div className={["splash-screen-bottom", bottomClass].join(' ')} style={props.bottomStyle}>
          {props.bottomContent || <></>}
        </div>
      </div>
    </div>
  );
};
