import { ListGroup } from 'Components/ListGroup/ListGroup';
import { ListItem } from 'Components/ListItem/ListItem';
import { ReactElement, useContext, useEffect, useState } from 'react';
import { BottomSheet } from 'react-spring-bottom-sheet';
import { ReactComponent as CheckSVG } from '../../../img/check-bold.svg';
import * as contentful from 'contentful';
import { CustomHabitContext } from 'contexts/customhabit.context';
import { useContentful } from 'helpers/contentfulHelper';
import { PageWrapper } from 'Components/PageWrapper/PageWrapper';
import { HabitPillar, PillarDescriptionContent } from 'types/types';
import { BottomSheetHeader } from 'Components/BottomSheetHeader/BottomSheetHeader';
import { Typography } from 'Components/Typography/Typography';

import parse from 'html-react-parser';
import { documentToHtmlString } from '@contentful/rich-text-html-renderer';

interface PillarSelectionProps {
  open: boolean;
  setOpen: any;
}

// type Explainer = {
//   title: contentful.EntryFields.Text;
//   videoAsset: contentful.Asset;
//   order: contentful.EntryFields.Number;
//   vimeoLink: contentful.EntryFields.Text;
//   youtubeLink: contentful.EntryFields.Text;
// };

export const PillarSelectionModal = ({
  open,
  setOpen
}: PillarSelectionProps): ReactElement => {
  const { setCustomHabitValue, habit } = useContext(CustomHabitContext);

  const [exerciseSelected, setExerciseSelected] = useState(false);
  const [nutritionSelected, setNutritionSelected] = useState(false);
  const [stressSelected, setStressSelected] = useState(false);
  const [socialSelected, setSocialSelected] = useState(false);
  const [sleepSelected, setSleepSelected] = useState(false);
  const [mentalSelected, setMentalSelected] = useState(false);

  const [exerciseSuffix, setExerciseSuffix] = useState(<></>);
  const [nutritionSuffix, setNutritionSuffix] = useState(<></>);
  const [stressSuffix, setStressSuffix] = useState(<></>);
  const [socialSuffix, setSocialSuffix] = useState(<></>);
  const [sleepSuffix, setSleepSuffix] = useState(<></>);
  const [mentalSuffix, setMentalSuffix] = useState(<></>);

  // const [pillarVideos, setPillarVideos] = useState<ReactElement[]>([]);
  const [pillarExplainers, setPillarExplainers] = useState<
    contentful.Entry<PillarDescriptionContent>[]
  >([]);

  const { client } = useContentful();

  useEffect(() => {
    if (habit.pillars.includes('Exercise')) {
      setExerciseSelected(true);
      setExerciseSuffix(<CheckSVG />);
    }

    if (habit.pillars.includes('Mental Stimulation')) {
      setMentalSelected(true);
      setMentalSuffix(<CheckSVG />);
    }

    if (habit.pillars.includes('Nutrition')) {
      setNutritionSelected(true);
      setNutritionSuffix(<CheckSVG />);
    }

    if (habit.pillars.includes('Sleep')) {
      setSleepSelected(true);
      setSleepSuffix(<CheckSVG />);
    }

    if (habit.pillars.includes('Social Activity')) {
      setSocialSelected(true);
      setSocialSuffix(<CheckSVG />);
    }

    if (habit.pillars.includes('Stress Management')) {
      setStressSelected(true);
      setStressSuffix(<CheckSVG />);
    }
  }, [habit])

  useEffect(() => {
    const fn = async () => {
      var data = await client.getEntries<any>({
        content_type: 'pillarExplainer'
      });
      if (data.items) {
        setPillarExplainers(data.items);
      }
    };
    fn();
  }, [client]);

  // Video content
  //
  // useEffect(() => {
  //   const getItems = async () => {
  //     const result = await client.getEntries<Explainer>({
  //       content_type: 'pillarExplainer'
  //     });
  //     if (result && result.items) {
  //       const sortedItems = result.items.sort((a, b) => {
  //         if (a.fields.order < b.fields.order) {
  //           return -1;
  //         } else {
  //           return 1;
  //         }
  //       });
  //       const downloadedViews = sortedItems.map((entry) => {
  //         // console.log(entry.fields);
  //         if (entry.fields.videoAsset !== undefined) {
  //           return (
  //             <div key={entry.sys.id} className='mb-2'>
  //               {entry.fields.videoAsset && (
  //                 <video controls>
  //                   <source
  //                     src={`https:${entry.fields.videoAsset.fields.file.url}`}
  //                   />
  //                 </video>
  //               )}
  //             </div>
  //           );
  //         } else if (entry.fields.youtubeLink !== undefined) {
  //           // console.log(entry.fields.youtubeLink);
  //           return (
  //             <div key={entry.sys.id} className='mb-2'>
  //               {
  //                 <div>
  //                   <ReactPlayer width='100%' url={entry.fields.youtubeLink} controls />
  //                 </div>
  //               }
  //             </div>
  //           );
  //         } else if (entry.fields.vimeoLink !== undefined) {
  //           // console.log(entry.fields.vimeoLink);
  //           return (
  //             <div key={entry.sys.id} className='mb-2'>
  //               {
  //                 <div>
  //                   <ReactPlayer width='100%' url={entry.fields.vimeoLink} controls />
  //                 </div>
  //               }
  //             </div>
  //           );
  //         } else {
  //           return <></>;
  //         }
  //       });
  //       // console.log(downloadedViews);
  //       setPillarVideos(downloadedViews);
  //     }
  //   };

  //   if (pillarVideos.length === 0) {
  //     getItems();
  //   }
  //   // eslint-disable-next-line react-hooks/exhaustive-deps
  // }, [open]);

  const header = (): ReactElement => {
    return (
      <BottomSheetHeader title='Select Pillar' leftSideActionLabel='Back' leftSideActionOnClick={() => setOpen(false)} />
    );
  };

  function onSelect(
    setFunc: any,
    pillar: HabitPillar,
    isSelected: boolean,
    setIsSelectedFunc: any
  ) {
    let pillars = [...habit.pillars];

    if (pillars.findIndex((x: HabitPillar) => x === pillar) > -1) {
      pillars = pillars.filter((x: HabitPillar) => x !== pillar);
      setFunc(<></>);
    } else {
      pillars = [...pillars, pillar];
      setFunc(<CheckSVG />);
    }
    setCustomHabitValue('pillars', pillars);
    setIsSelectedFunc(!isSelected);
  }

  const pillars = [
    <ListItem
      label="Exercise"
      suffix={exerciseSuffix}
      onClick={() =>
        onSelect(
          setExerciseSuffix,
          'Exercise',
          exerciseSelected,
          setExerciseSelected
        )
      }
    />,
    <ListItem
      label="Nutrition"
      suffix={nutritionSuffix}
      onClick={() =>
        onSelect(
          setNutritionSuffix,
          'Nutrition',
          nutritionSelected,
          setNutritionSelected
        )
      }
    />,
    <ListItem
      label="Stress Management"
      suffix={stressSuffix}
      onClick={() =>
        onSelect(
          setStressSuffix,
          'Stress Management',
          stressSelected,
          setStressSelected
        )
      }
    />,
    <ListItem
      label="Social Activity"
      suffix={socialSuffix}
      onClick={() =>
        onSelect(
          setSocialSuffix,
          'Social Activity',
          socialSelected,
          setSocialSelected
        )
      }
    />,
    <ListItem
      label="Sleep"
      suffix={sleepSuffix}
      onClick={() =>
        onSelect(setSleepSuffix, 'Sleep', sleepSelected, setSleepSelected)
      }
    />,
    <ListItem
      label="Mental Stimulation"
      suffix={mentalSuffix}
      onClick={() =>
        onSelect(
          setMentalSuffix,
          'Mental Stimulation',
          mentalSelected,
          setMentalSelected
        )
      }
    />
  ];

  return (
    <BottomSheet header={header()} open={open}
      defaultSnap={({ maxHeight }) => maxHeight * 0.94}
      snapPoints={({ maxHeight }) => [
        maxHeight * 0.94
      ]}>
      <PageWrapper sidesOnly>
        <div className='mt-8'>
          <ListGroup heading="Pillar" items={pillars} />
        </div>

        {/* <div className="listGroup_heading">About the pillars</div> */}
        {/* {pillarVideos.map((video) => {
          return video;
        })} */}
        {pillarExplainers.map((pillar: any, index: number) => {
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
      </PageWrapper>
    </BottomSheet>
  );
};
