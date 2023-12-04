import { useState } from 'react';
import { BottomSheet } from 'react-spring-bottom-sheet';

import { ContentfulPost, DialogProps } from 'types/types';

import { BottomSheetHeader } from 'Components/BottomSheetHeader/BottomSheetHeader';
import { ExploreContent } from 'Components/ExploreContent/ExploreContent';
import { Input } from 'Components/Input/Input';
import { ListItem } from 'Components/ListItem/ListItem';
import { PageWrapper } from 'Components/PageWrapper/PageWrapper';

type Props = DialogProps & {
  onArticleClicked?: (article: ContentfulPost) => void;
};

export const SearchArticlesBottomSheet = ({
  open,
  setOpen,
  onArticleClicked
}: Props) => {
  const [query, setQuery] = useState<string>('');
  return (
    <BottomSheet
      id="SearchArticlesBottomSheet"
      open={open}
      defaultSnap={({ maxHeight }) => maxHeight * 0.94}
      snapPoints={({ maxHeight }) => [maxHeight * 0.94]}
      header={
        <BottomSheetHeader
          title="Search"
          leftSideActionLabel="Back"
          leftSideActionOnClick={() => setOpen(false)}
        />
      }
    >
      <PageWrapper sidesOnly>
        <ListItem
          listType="list-primary"
          label={
            <Input
              id="input"
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
          }
        />

        <ExploreContent query={query} onArticleClicked={onArticleClicked} />
      </PageWrapper>
    </BottomSheet>
  );
};
