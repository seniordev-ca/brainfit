import React from 'react';

interface TypeProps {
  usage?: 'display' | 'headingLarge' | 'headingMedium' | 'headingSmall' | 'body' | 'captionMedium' | 'captionRegular' | 'tabBarTablet' | 'tabBar' | 'historyBold' | 'historyRegular';
  content?: string;
  typeClass?: Array<string>;
  children?: any;
  onClick?: any;
}

export const Typography = function ({
  usage,
  content,
  typeClass = [],
  children,
  ...props
}: TypeProps) {
  if (usage === 'display') {
    return <h1 className={[usage, ...typeClass].join(' ')} { ...props } >{children ? children : content}</h1>;
  } else if (usage === 'headingLarge') {
    return <h2 className={[usage, ...typeClass].join(' ')} { ...props } >{children ? children : content}</h2>;
  } else if (usage === 'headingMedium') {
    return <h3 className={[usage, ...typeClass].join(' ')} { ...props } >{children ? children : content}</h3>;
  } else if (usage === 'headingSmall') {
    return <h4 className={[usage, ...typeClass].join(' ')} { ...props } >{children ? children : content}</h4>;
  } else if (usage === 'body') {
    return <div className={[usage, ...typeClass].join(' ')} { ...props } >{children ? children : content}</div>;
  } else if (usage === 'captionMedium') {
    return <div className={[usage, ...typeClass].join(' ')} { ...props } >{children ? children : content}</div>;
  } else if (usage === 'captionRegular') {
    return <div className={[usage, ...typeClass].join(' ')} { ...props } >{children ? children : content}</div>;
  } else if (usage === 'tabBarTablet') {
    return <div className={[usage, ...typeClass].join(' ')} { ...props } >{children ? children : content}</div>;
  } else if (usage === 'tabBar') {
    return <div className={[usage, ...typeClass].join(' ')} { ...props } >{children ? children : content}</div>;
  } else if (usage === 'historyBold') {
    return <div className={[usage, ...typeClass].join(' ')} { ...props } >{children ? children : content}</div>;
  } else if (usage === 'historyRegular') {
    return <div className={[usage, ...typeClass].join(' ')} { ...props } >{children ? children : content}</div>;
  }
  return <div className={[usage, ...typeClass].join(' ')} { ...props } >{children ? children : content}</div>;
};
