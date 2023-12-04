import "./IconFrame.scss";
import React from 'react';

export type IconSurfaceType =
  | 'dimmed'
  | 'background';

interface IconFrameProps {
  Icon?: any;
  url?: string;
  smallIcon?: boolean;
  iconSurfaceType?: IconSurfaceType;
}

export const IconFrame = function ({
  Icon,
  url,
  smallIcon,
  iconSurfaceType='dimmed',
  ...props
}: IconFrameProps) {

  if (url) {
    //let classToUse = "iconFrame_container bg-[url('" + url +"')] bg-cover bg-center"
    return (
      <div style={{ backgroundImage: 'url("' + url + '")' }} className="iconFrame_container bg-cover bg-center">
        {/* <img className="iconFrame_image" alt="collection content" src={url}></img> */}
      </div>
    )
  }

  return (
    <div className={`iconFrame_container dark:bg-mom_darkMode_surface-${iconSurfaceType}`}>
      <Icon className={`iconFrame_image ${smallIcon ? 'smallIcon' : ''}`} />
    </div>
  );

};