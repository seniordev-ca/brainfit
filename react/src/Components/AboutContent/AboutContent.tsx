import { ReactElement, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import * as contentful from 'contentful';
import parse from 'html-react-parser';
import { documentToHtmlString } from '@contentful/rich-text-html-renderer';
import ReactPlayer from 'react-player/lazy';
import { AboutContent as AboutContentType } from 'types/types';
import { useContentful } from 'helpers/contentfulHelper';
import localization from 'helpers/localizationHelper';
import { Anchor } from 'Components/Anchor/Anchor';
import { Typography } from 'Components/Typography/Typography';
import { ListItem } from 'Components/ListItem/ListItem';
import { ListGroup } from 'Components/ListGroup/ListGroup';

export const AboutContent = function ({ ...props }) {
  const [about, setAbout] = useState<contentful.Entry<AboutContentType>>();
  const [video, setVideo] = useState<ReactElement>();
  const { client } = useContentful();
  const navigate = useNavigate();

  useEffect(() => {
    client
      .getEntries({
        content_type: 'appReasoning'
      })
      .then((data: any) => {
        if (data.items.length > 0) {
          const entry = data.items[0];
          setAbout(entry);

          if (entry.fields.videoAsset !== undefined) {
            setVideo(
              <div key={entry.sys.id}>
                <Typography usage='headingSmall' content={entry.fields.title} />
                {entry.fields.videoAsset && (
                  <video controls>
                    <source
                      src={`https:${entry.fields.videoAsset.fields.file.url}`}
                    />
                  </video>
                )}
              </div>
            );
          } else if (entry.fields.youtubeLink !== undefined) {
            // console.log(entry.fields.youtubeLink);
            setVideo(
              <div key={entry.sys.id}>
                <Typography usage='headingSmall' content={entry.fields.title} />
                {
                  <div>
                    <ReactPlayer width='100%' url={entry.fields.youtubeLink} controls />
                  </div>
                }
              </div>
            );
          } else if (entry.fields.vimeoLink !== undefined) {
            // console.log(entry.fields.vimeoLink);
            setVideo(
              <div key={entry.sys.id}>
                <Typography usage='headingSmall' content={entry.fields.title} />
                {
                  <div>
                    <ReactPlayer width='100%' url={entry.fields.vimeoLink} controls />
                  </div>
                }
              </div>
            );
          } else {
            setVideo(<></>);
          }
        }
      });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div id="aboutContent" className="container h-100 mx-auto text-left">
      <div id='aboutContentHeader' className='w-full inline-flex'>
        <div className='header-controls w-full grid grid-cols-5 pt-6 pb-8'>
          <div className='col-span-1 text-left'>
            <Anchor label="Back" onClick={() => navigate(-1)} />
          </div>
          <div className='col-span-3 flex justify-center items-center'>
            <Typography
              content={about! ? about.fields.title : localization.getString('whyWeBuiltThisAppString')}
              usage='headingSmall' />
          </div>
        </div>
      </div>
      {
        video
      }
      <div className="dark:text-mom_darkMode_text-neutral">
        {about! ? (
          parse(documentToHtmlString(about?.fields.body))
        ) : (
          <p>Body not exist</p>
        )}
      </div>

      <ListGroup
        items={[
          <ListItem
            label={
              <Anchor
                label='Discover more from Mind Over Matter'
                href="https://womensbrainhealth.org/mind-over-matter"
                target='_blank'
              />
            }
            listType="list-primary"
          />,
          <ListItem
            label={
              <Anchor
                label='Visit womensbrainhealth.org'
                href="https://womensbrainhealth.org"
                target='_blank'
              />
            }
            listType="list-primary"
          />,
        ]}
      />
    </div>
  );
};
