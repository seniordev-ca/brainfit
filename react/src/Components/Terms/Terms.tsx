import { documentToHtmlString } from '@contentful/rich-text-html-renderer';
import { Typography } from 'Components/Typography/Typography';
import { PageWrapper } from 'Components/PageWrapper/PageWrapper';
import * as contentful from 'contentful';
import { useContentful } from 'helpers/contentfulHelper';
import parse from 'html-react-parser';
import { ReactElement, useEffect, useState } from 'react';
import { BottomSheet } from 'react-spring-bottom-sheet';
import { DialogProps, HabitContent } from 'types/types';
import { BottomSheetHeader } from 'Components/BottomSheetHeader/BottomSheetHeader';

export interface TermsContentProps {
  pillar: string;
}

export const Terms = ({ open, setOpen }: DialogProps): ReactElement => {
  const [terms, setTerms] = useState<contentful.Entry<HabitContent>>();
  const [privacy, setPrivacy] = useState<contentful.Entry<HabitContent>>();

  const { client } = useContentful();

  useEffect(() => {
    client
      .getEntries({
        content_type: 'aboutContent'
      })
      .then((data: any) => {
        data.items.forEach((entry: any) => {
          // console.log(entry);
          if (entry.fields.pillar === 'privacy') {
            setPrivacy(entry);
          } else if (entry.fields.pillar === 'terms') {
            setTerms(entry);
          }
        });
      });
  }, [client]);

  const newTermsPickerHeader = (): ReactElement => {
    return (
      <BottomSheetHeader title='' leftSideActionLabel='Done' leftSideActionOnClick={() => setOpen(false)} />
    );
  };

  return (
    <BottomSheet header={newTermsPickerHeader()} open={open}
      initialFocusRef={false}
      defaultSnap={({ maxHeight }) => maxHeight * 0.94}
      snapPoints={({ maxHeight }) => [
        maxHeight * 0.94
      ]}>
      <PageWrapper sidesOnly>
        <Typography usage='headingMedium'>{terms! ? <p>{terms.fields.title}</p> : <p>Title not exists</p>}</Typography>
        <Typography usage='body'>
          {terms! ? (
            parse(documentToHtmlString(terms?.fields.body))
          ) : (
            <p>Body not exist</p>
          )}
        </Typography>
        <Typography usage='headingMedium'>{privacy! ? <p>{privacy.fields.title}</p> : <p>Title not exist</p>}</Typography>
        <Typography usage='body'>
          {privacy! ? (
            parse(documentToHtmlString(privacy?.fields.body))
          ) : (
            <p>Body not exist</p>
          )}
        </Typography>
      </PageWrapper>
    </BottomSheet>
  );
};
