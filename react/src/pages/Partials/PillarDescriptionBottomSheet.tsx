import * as contentful from 'contentful';
import parse from 'html-react-parser';
import { documentToHtmlString } from '@contentful/rich-text-html-renderer';
import { BottomSheet } from 'react-spring-bottom-sheet';
import { Typography } from 'Components/Typography/Typography';
import { DialogProps, PillarDescriptionContent } from 'types/types';
import { PageWrapper } from 'Components/PageWrapper/PageWrapper';
import { useContentful } from 'helpers/contentfulHelper';
import { useEffect, useState } from 'react';
import { BottomSheetHeader } from 'Components/BottomSheetHeader/BottomSheetHeader';

export const PillarDescriptionBottomSheet = ({
  open,
  setOpen
}: DialogProps) => {
  const { client } = useContentful();
  const [pillars, setPillars] = useState<
    contentful.Entry<PillarDescriptionContent>[]
  >([]);

  useEffect(() => {
    const fn = async () => {
      var data = await client.getEntries<any>({
        content_type: 'pillarExplainer'
      });
      if (data.items) {
        setPillars(data.items);
      }
    };
    fn();
  }, [client]);

  return (
    <BottomSheet
      id="pillarDescriptionBottomSheet"
      className="z-50 pb-10 h-screen"
      open={open}
      defaultSnap={({ maxHeight }) => maxHeight * 0.94}
      snapPoints={({ maxHeight }) => [
        maxHeight * 0.94
      ]}
      header={
        <BottomSheetHeader title='' leftSideActionLabel='Close' leftSideActionOnClick={() => setOpen(false)} />
      }
    >
      <PageWrapper sidesOnly>
        <div id="pillarDescriptionContent" className="w-full block text-left">
          {pillars.map((pillar: any, index: number) => {
            return (
              <div key={index}>
                <Typography
                  usage="headingMedium"
                  typeClass={['mb-4 mt-2']}
                  content={pillar.fields.title}
                />
                <Typography usage="body" typeClass={['mb-6']}>
                  {parse(documentToHtmlString(pillar.fields.description))}
                </Typography>
              </div>
            );
          })}
        </div>
      </PageWrapper>
    </BottomSheet>
  );
};
