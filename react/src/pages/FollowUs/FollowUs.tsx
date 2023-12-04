import { ReactElement } from 'react';
import { useNavigate } from 'react-router-dom';
import { Capacitor } from '@capacitor/core';
import { AppLauncher } from '@capacitor/app-launcher';
import localization from 'helpers/localizationHelper';
import { ReactComponent as FacebookLogo } from '../../img/facebook-square.svg';
import { ReactComponent as InstagramLogo } from '../../img/instagram-square.svg';
import { ReactComponent as TwitterLogo } from '../../img/twitter-square.svg';
import { Typography } from 'Components/Typography/Typography';
import { ListItem } from 'Components/ListItem/ListItem';
import { ListGroup } from 'Components/ListGroup/ListGroup';
import { Anchor } from 'Components/Anchor/Anchor';
import './FollowUs.scss'

export const FollowUs = (props: any): ReactElement => {
  const navigate = useNavigate();
  const platform = Capacitor.getPlatform();
  const urls: any = {
    facebook: {
      ios: 'fb://profile/womensbrains',
      android: 'com.facebook.katana',
      web: 'https://www.facebook.com/womensbrains',
    },
    twitter: {
      ios: 'twitter://user?screen_name=womensbrains',
      android: 'com.twitter.android',
      web: 'https://twitter.com/womensbrains',
    },
    instagram: {
      ios: 'instagram://',
      android: 'com.instagram.android',
      web: 'https://www.instagram.com/womensbrains/',
    },
  }

  const checkCanOpenUrl = async (url: string) => {
    const { value } = await AppLauncher.canOpenUrl({ url: url });
    return value;
  };

  const openSocial = async (appName: string) => {
    if (platform !== 'web') {
      const res = await checkCanOpenUrl(urls[appName][platform]);
      if (res) {
        await AppLauncher.openUrl({ url: urls[appName][platform] });
      } else {
        window.location.href = urls[appName][platform];
      }
    } else {
      window.location.href = urls[appName][platform];
    }
  }

  return (
    <div id="followUs" className="container h-100 mx-auto text-left">
      <div id='followUsHeader' className='w-full inline-flex'>
        <div className='header-controls w-full grid grid-cols-5 pt-6 pb-8'>
          <div className='col-span-1 text-left'>
            <Anchor label="Back" onClick={() => navigate(-1)} />
          </div>
          <div className='col-span-3 flex justify-center items-center'>
            <Typography
              content={localization.getString('followUsString')}
              usage='headingSmall' />
          </div>
        </div>
      </div>

      <div className={['flexmx-auto border-0 flex-col'].join(' ')}>
        <ListGroup
          heading='Social'
          items={[
            <ListItem
              prefix={<FacebookLogo />}
              label={
                <Anchor
                  label='Facebook'
                  href='https://www.facebook.com/womensbrains'
                  target='_blank'
                />
              }
              listType="list-primary"
              onClick={() => openSocial('facebook')}
            />,
            <ListItem
              prefix={<TwitterLogo />}
              label={
                <Anchor
                  label='Twitter'
                  href='https://twitter.com/womensbrains'
                  target='_blank'
                />
              }
              listType="list-primary"
              onClick={() => openSocial('twitter')}
            />,
            <ListItem
              prefix={<InstagramLogo />}
              label={
                <Anchor
                  label='Instagram'
                  href='https://www.instagram.com/womensbrains'
                  target='_blank'
                />
              }
              listType="list-primary"
              onClick={() => openSocial('instagram')}
            />,
          ]}
        />
      </div>

      <div className={['flexmx-auto border-0 flex-col'].join(' ')}>
        <ListGroup
          heading='Web'
          items={[
            <ListItem
              label={
                <Anchor
                  label='Mind Over Matter'
                  href="https://womensbrainhealth.org/mind-over-matter"
                  target='_blank'
                />
              }
              listType="list-primary"
            />,
            <ListItem
              label={
                <Anchor
                  label='Women’s Brain Health Initiative'
                  href="https://womensbrainhealth.org"
                  target='_blank'
                />
              }
              listType="list-primary"
            />,
          ]}
        />
      </div>
      {props.children}
    </div>
  )
}