import { Typography } from 'Components/Typography/Typography';
import { ReactElement, useContext, useEffect, useRef, useState } from 'react';
import { ContentfulPost, HabitPillarFilter } from 'types/types';
import './SixPillars.scss';

import { ExploreContent } from 'Components/ExploreContent/ExploreContent';
import { Input } from 'Components/Input/Input';
import { ListItem } from 'Components/ListItem/ListItem';
import { PillarArticle } from 'Components/PillarArticle/PillarArticle';
import { PillarFilter } from 'Components/PillarFilter/PillarFilter';
import { ReactComponent as SearchSVG } from '../../img/icon_search.svg';
import { CommonContext } from 'contexts/common.context';

export const SixPillars = (): ReactElement => {
  const [pillarFilter, setPillarFilter] = useState<HabitPillarFilter>('all');

  const [searchOpen, setSearchOpen] = useState(false);

  const [article, setArticle] = useState<ContentfulPost | undefined>(undefined);

  const [query, setQuery] = useState('');

  const searchRef = useRef<HTMLInputElement>(null);

  const { setInterfaceOpen, interfacesOpen } =
    useContext(CommonContext);

  function openArticle(article: ContentfulPost) {
    setArticle(article);
    setInterfaceOpen('articleOpen', true);
  }

  useEffect(() => {
    setQuery('');
    setPillarFilter('all');

    // MIND-688 point 2
    if (searchOpen && searchRef.current) {
      searchRef.current.focus();
    }
  }, [searchOpen]);

  return (
    <>
      <div>
        <div id="sixPillars">
          <div className={''}>
            {searchOpen ? (
              <>
                <div className="my-4 flex justify-between items-center">
                  <Typography usage="headingLarge" content="Search" />
                  <Typography
                    usage="headingSmall"
                    content="Back"
                    typeClass={[
                      'cursor-pointer !text-mom_lightMode_text-primary dark:!text-mom_darkMode_text-primary'
                    ]}
                    onClick={() => setSearchOpen(false)}
                  />
                  {/* <IconSystems
                    className="cursor-pointer dark:fill-mom_darkMode_icon-primary"
                    onClick={() => setSearchOpen(false)}
                  /> */}
                </div>
                <ListItem
                  listType="list-primary"
                  label={
                    <Input
                      id="input"
                      type="text"
                      value={query}
                      // @ts-ignore
                      elemRef={searchRef}
                      onChange={(e) => setQuery(e.target.value)}
                      tabIndex={0}
                    />
                  }
                />
              </>
            ) : (
              <>
                <div className="my-4 flex justify-between items-center">
                  <Typography usage="headingLarge" content="Explore" />
                  <div className="icon_search">
                    <SearchSVG
                      className="cursor-pointer"
                      onClick={() => setSearchOpen(true)}
                    />
                  </div>
                </div>

                <Typography
                  typeClass={['mb-6']}
                  usage="captionRegular"
                  content="Read the latest news and research related to the six pillars of brain health. Each article includes recommended habits to add."
                />
                <div
                  id="six-pillars-controls"
                  className="w-full flex-wrap gap-y-2 gap-x-1 justify-center"
                >
                  <PillarFilter
                    onPillarChanged={(p) => setPillarFilter(p)}
                    hideArchive
                  />
                </div>
              </>
            )}
          </div>

          <ExploreContent
            hide={!query && searchOpen}
            query={query}
            selectedPillar={pillarFilter as any}
            onArticleClicked={(a) => openArticle(a)}
          />
        </div>
      </div>

      {/* <SearchArticlesBottomSheet
        open={searchOpen}
        setOpen={(open: boolean) => setSearchOpen(open)}
        onArticleClicked={(a) => openArticle(a)}
      /> */}
      {article ? (
        <PillarArticle
          open={interfacesOpen.articleOpen}
          setOpen={() => setInterfaceOpen('articleOpen', false)}
          content={article}
        />
      ) : (
        <></>
      )}
    </>
  );
};
