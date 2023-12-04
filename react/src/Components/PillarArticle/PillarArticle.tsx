import './PillarArticle.scss';

import { Article } from 'Components/Article/Article';
import { HabitIcon } from 'Components/HabitIcon/HabitIcon';
import { ListGroup } from 'Components/ListGroup/ListGroup';
import { ListItem } from 'Components/ListItem/ListItem';
import { Typography } from 'Components/Typography/Typography';
import { pillars } from 'constants/pillars';
import { CustomHabitContext } from 'contexts/customhabit.context';
import { habitIcon, processContentfulAssetURL } from 'helpers/utils';
import { Habit } from 'models/habit';
import moment from 'moment';
import { ReactElement, useContext } from 'react';
import { BottomSheet } from 'react-spring-bottom-sheet';
import { ContentfulPost, DialogProps, HabitContent } from 'types/types';

import { documentToReactComponents } from '@contentful/rich-text-react-renderer';
import { BLOCKS } from '@contentful/rich-text-types';
import { BottomSheetHeader } from 'Components/BottomSheetHeader/BottomSheetHeader';
import { PageWrapper } from 'Components/PageWrapper/PageWrapper';
import * as contentful from 'contentful';
import { useUserHabits } from 'helpers/stateHelper';
import { setDataFieldWithID } from 'slices/dataSlice';
import { useDispatch } from 'react-redux';

export interface TermsContentProps {
  pillar: string;
}

type Props = DialogProps & {
  content: ContentfulPost;
};

export const PillarArticle = ({
  open,
  setOpen,
  content: articleContent
}: Props): ReactElement => {
  const { habits } = useUserHabits();
  const { setInterfaceOpen, setCustomHabit } = useContext(CustomHabitContext);

  // const IconForHabit = (icon: any): any => {
  //   return (
  //     <Icon
  //       icon={icon.icon}
  //       className={'habitGlyph'}
  //       width="45"
  //       height="45"
  //       inline={false}
  //     />
  //   );
  // };

  const renderOptions = {
    renderNode: {
      [BLOCKS.HEADING_1]: (node: any, children: any) => {
        return <Typography usage="display">{children}</Typography>;
      },
      [BLOCKS.HEADING_2]: (node: any, children: any) => {
        return <Typography usage="headingLarge">{children}</Typography>;
      },
      [BLOCKS.HEADING_3]: (node: any, children: any) => {
        return (
          <Typography usage="headingMedium" typeClass={['mb-2']}>
            {children}
          </Typography>
        );
      },
      [BLOCKS.HEADING_4]: (node: any, children: any) => {
        return (
          <Typography usage="headingSmall" typeClass={['mb-2']}>
            {children}
          </Typography>
        );
      },
      [BLOCKS.QUOTE]: (node: any, children: any) => {
        return <blockquote>{children}</blockquote>;
      },
      [BLOCKS.HR]: (node: any, children: any) => {
        return <hr className="mb-4" />;
      },
      [BLOCKS.OL_LIST]: (node: any, children: any) => {
        return <ol>{children}</ol>;
      },
      [BLOCKS.UL_LIST]: (node: any, children: any) => {
        return <ul>{children}</ul>;
      },
      [BLOCKS.LIST_ITEM]: (node: any, children: any) => {
        return <li>{children}</li>;
      },
      [BLOCKS.EMBEDDED_ENTRY]: (node: any, children: any) => {
        // target the contentType of the EMBEDDED_ENTRY to display as you need
        if (node.data.target.sys.contentType.sys.id === 'codeBlock') {
          return (
            <pre>
              <code>{node.data.target.fields.code}</code>
            </pre>
          );
        }

        if (node.data.target.sys.contentType.sys.id === 'videoEmbed') {
          return (
            <iframe
              src={node.data.target.fields.embedUrl}
              height="100%"
              width="100%"
              frameBorder="0"
              scrolling="no"
              title={node.data.target.fields.title}
              allowFullScreen={true}
            />
          );
        }
      },

      [BLOCKS.EMBEDDED_ASSET]: (node: any, children: any) => {
        // render the EMBEDDED_ASSET as you need
        return (
          <img
            src={`https://${node.data.target.fields.file.url}`}
            height={node.data.target.fields.file.details.image.height}
            width={node.data.target.fields.file.details.image.width}
            alt={node.data.target.fields.description}
          />
        );
      }
    }
  };

  const checkMono = (content: any) => {
    // if (data.monoOption) {
    //   return data.colourOption;
    // } else {
    //   return firstPillar(content) as typeof pillars;
    // }
    return firstPillar(content) as typeof pillars;
  };

  const firstPillar = (icon: string): string => {
    const result = icon.split(',');
    return result[0];
  };

  const ContentOfArticle = (): ReactElement => {
    const dispatch = useDispatch();
    const currentHabitTitles = habits?.map((habit) => habit.title);
    const recommendHabits = articleContent.relatedHabits
      ?.filter(
        (remoteHabit: contentful.Entry<HabitContent>) =>
          !currentHabitTitles.includes(remoteHabit.fields.title)
      )
      .map((entry: any) => {
        return (
          <div>
            <ListItem
              prefix={
                true ? (
                  <HabitIcon
                    Icon={() =>
                      habitIcon(
                        checkMono(entry.fields.pillar),
                        [entry.fields.pillars],
                        `mdi:${entry.fields.icon}`
                      )
                    }
                    habitColour={checkMono(entry.fields.pillar)}
                  />
                ) : (
                  <></>
                )
              }
              className={''}
              label={entry.fields.title}
              sublabel={entry.fields.frequency}
              data-testid={entry.fields.title}
              chevron={true}
              onClick={() => {
                setCustomHabit(Habit.createFromContentfulHabit(entry));
                //MIND-687 point 2
                dispatch(
                  setDataFieldWithID({
                    id: 'newHabitType',
                    value: 'predefined'
                  })
                );
                setInterfaceOpen('customHabitOpen', true);
              }}
            />
          </div>
        );
      });
    return (
      <div className="pillar-article">
        <Article
          title={articleContent.title}
          category={articleContent.pillar}
          publicationDate={moment(articleContent.publicationDate).format(
            'MMMM D, YYYY'
          )}
        >
          {documentToReactComponents(articleContent.body, renderOptions)}
        </Article>
        <div className="text-left">
          {recommendHabits?.length > 0 && (
            <ListGroup
              heading="Related Habits"
              items={recommendHabits}
              listGroupType="listGroup_primary"
            />
          )}
        </div>
      </div>
    );
  };

  return (
    <BottomSheet
      header={
        <BottomSheetHeader
          title=""
          leftSideActionLabel="Close"
          leftSideActionOnClick={() => setOpen(false)}
          rightSideActionLabel="Share"
          rightSideActionOnClick={() => setOpen(false)}
        />
      }
      open={open}
      defaultSnap={({ maxHeight }) => maxHeight * 0.94}
      snapPoints={({ maxHeight }) => [maxHeight * 0.94]}
    >
      <PageWrapper sidesOnly>
        <div>
          {articleContent.audioOrVideoAsset ? (
            <img
              src={processContentfulAssetURL(
                articleContent.audioOrVideoAsset?.fields?.file?.url
              )}
              alt={''}
              height={600}
              width={600}
              className="center mb-6"
            />
          ) : (
            <></>
          )}
          <ContentOfArticle />
        </div>
      </PageWrapper>
    </BottomSheet>
  );
};
