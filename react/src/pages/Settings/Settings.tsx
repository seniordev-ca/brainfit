import { ListGroup } from 'Components/ListGroup/ListGroup';
import { ListItem } from 'Components/ListItem/ListItem';
import { Typography } from 'Components/Typography/Typography';
import { SignUpContext } from 'contexts/signup.context';
import localization from 'helpers/localizationHelper';
import { getData } from 'slices/dataSlice';
import { Anchor } from 'Components/Anchor/Anchor';
import { App } from '@capacitor/app';
import { Capacitor } from '@capacitor/core';
import { ReactElement, useState, useContext, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

/**
 * Settings page
 *
 * @returns
 */
export const Settings = (props: any): ReactElement => {
  const { data } = useSelector(getData);
  const navigate = useNavigate();
  const platform = Capacitor.getPlatform();
  const [version, setVersion] = useState('');
  const { setInterfaceOpen } = useContext(SignUpContext);

  useEffect(() => {
    const func = async () => {
      if (platform !== 'web') {
        const data = await App.getInfo();
        setVersion(data.version);
      }
    };

    func().catch(console.error);
  }, [platform]);

  //const buttonListClass = [platform === 'web' ? 'btn btn-primary mb-5' : 'w-full py-4 pl-2 border-b-2 border-gray-400 text-left'].join(' ');
  return (
    // <PageWrapper>
    <div id="settings" className="container mx-auto text-left">
      <Typography
        content={localization.getString('settingsString')}
        usage="display"
      />

      {/* <div className={['flexmx-auto border-0 flex-col'].join(' ')}>
        <ListGroup
          heading="General"
          items={[
            <ListItem
              label={localization.getString('aboutString')}
              chevron
              listType="list-primary"
              onClick={about}
            />,
            <ListItem
              label={localization.getString('appearanceString')}
              chevron
              listType="list-primary"
              onClick={() => setInterfaceOpen('appearanceScreenOpen', true)}
            />
          ]}
        />
      </div> */}
      <div className={['flex mx-auto border-0 flex-col'].join(' ')}>
        <ListGroup
          heading="General"
          items={[
            // <ListItem
            //   label={localization.getString('aboutString')}
            //   chevron
            //   listType="list-primary"
            //   onClick={about}
            // />,
            <ListItem
              label={localization.getString('appearanceString')}
              chevron
              listType="list-primary"
              onClick={() => setInterfaceOpen('appearanceScreenOpen', true)}
            />
          ]}
        />

        <ListGroup
          heading={localization.getString('accountString')}
          items={[
            <ListItem
              label={localization.getString('nameString')}
              chevron
              listType="list-primary"
              suffix={
                data.questionnaireAnswers?.[0]
                  ? data.questionnaireAnswers?.[0]
                  : localization.getString('addNameString')
              }
              onClick={() =>
                setInterfaceOpen('changeNameBottomSheetOpen', true)
              }
            />,
            <ListItem
              label={localization.getString('accountAndDataString')}
              chevron
              listType="list-primary"
              onClick={() => navigate('/account')}
            />
          ]}
        />

        <ListGroup
          heading={localization.getString('aboutString')}
          items={[
            <ListItem
              label={localization.getString('whyWeBuiltThisAppString')}
              chevron
              listType="list-primary"
              onClick={() => navigate('/about')}
            />,
            <ListItem
              label={localization.getString('followUsString')}
              chevron
              listType="list-primary"
              onClick={() => navigate('/followUs')}
            />,
            <ListItem
              label={localization.getString('versionString')}
              listType="list-primary"
              suffix={version}
            />,
            <ListItem
              label={
                <Anchor
                  label={localization.getString('feedbackAndSupportString')}
                  href="mailto:INFO@WOMENSBRAINHEALTH.ORG"
                />
              }
              listType="list-primary"
            />
          ]}
        />
      </div>
      {props.children}
    </div>
    // </PageWrapper>
  );
};
