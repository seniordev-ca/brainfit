import { documentToHtmlString } from '@contentful/rich-text-html-renderer';
import { Loader } from 'Components/Loader/Loader';
import { useContentful } from 'helpers/contentfulHelper';
import parse from 'html-react-parser';
import { ReactElement, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { HabitContent } from 'types/types';

/**
 * Article page
 *
 * @returns
 */
export const Explainer = (props: any): ReactElement => {
  const params = useParams();
  const [loading, setLoading] = useState(true);
  const [explainerContent, setExplainerContent] = useState<any>();
  const { client } = useContentful();

  useEffect(() => {
    if (!explainerContent) {
      client
        .getEntries<HabitContent>({
          content_type: 'pillarExplainer'
        })
        .then((data: any) => {
          if (data.items) {
            const [entry] = data.items.filter(
              (item: any) => item.fields.pillar === params.pillar
            );
            setExplainerContent({
              title: entry.fields.title,
              body: parse(documentToHtmlString(entry.fields.body))
            });
            setLoading(false);
          }
        });
    }
  }, [explainerContent, params, client]);

  if (loading) {
    return <Loader hideText={true} />;
  } else {
    return (
      <div id="explainer" className="text-left container mx-auto">
        <h1 className="pt-4 text-2xl mb-1 text-center font-bold">
          {explainerContent.title}
        </h1>
        <br />
        <div className="my-7 text-center">{explainerContent.body}</div>
      </div>
    );
  }
};
