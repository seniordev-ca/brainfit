import './IconPickerModal.scss';

import { Icon } from '@iconify/react';
import { InputStyled } from 'Components/InputStyled/InputStyled';
import { PageWrapper } from 'Components/PageWrapper/PageWrapper';
import { SegmentedControl } from 'Components/SegmentedControl/SegmentedControl';
import { CustomHabitContext } from 'contexts/customhabit.context';
import { ReactElement, useContext, useEffect, useState } from 'react';
import { BottomSheet } from 'react-spring-bottom-sheet';
import { DialogProps } from 'types/types';
import { BottomSheetHeader } from 'Components/BottomSheetHeader/BottomSheetHeader';

import iconifyData from 'constants/iconifyData';
import { Typography } from 'Components/Typography/Typography';
import { getProperHabitCss } from 'helpers/utils';

export const IconPickerModal = ({
  open,
  setOpen
}: DialogProps): ReactElement => {
  const { habit, setCustomHabitValue } = useContext(CustomHabitContext);
  const [icon, setIcon] = useState(habit.icon);
  const [segIndex, setSegIndex] = useState(0);
  const [searchField, setSearchField] = useState('');
  const [iconList, setIconList] = useState([
    'eva:alert-circle-fill',
    'eva:bulb-outline',
    'eva:camera-fill',
    'eva:checkmark-circle-2-outline',
    'eva:clock-outline',
    'eva:close-square-outline',
    'eva:cloud-download-outline',
    'eva:color-palette-outline',
    'eva:compass-outline',
    'eva:eye-fill'
  ]);

  useEffect(() => {
    const func = async () => {
      if (open) {
        setSearchField('');
        setIcon(habit.icon);
        setErrorMessage('');

        if (habit.icon !== '') {
          if (habit.icon.startsWith('eva:') || habit.icon.startsWith('mdi:')) {
            setSegIndex(0);
            setIconType('icon');

            await new Promise((r) => setTimeout(r, 100));
            const iconName = habit.icon.split(':')[1];
            const item = iconifyData.filter(
              (iconData) => iconData.name === iconName
            );
            if (item.length > 0) {
              const newIconList = [
                habit.icon,
                ...iconifyData
                  .filter((iconData) => iconData.name !== iconName)
                  .slice(0, 49)
                  .map((iconData) => `mdi:${iconData.name}`)
              ];
              setIconList(newIconList);
            }
          } else {
            setSegIndex(1);
            setIconType('emoji');
          }
        } else {
          setSegIndex(0);
          setIconType('icon');
        }
      }
    };

    func();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [setOpen]);

  useEffect(() => {
    const searchTerm = searchField.replace(/[|+-/]/g, '').toLowerCase();
    const newIconList = iconifyData
      .filter(
        (iconData) =>
          iconData.name.includes(searchTerm) ||
          iconData.tags.includes(searchTerm)
      )
      .slice(0, 50)
      .map((iconData) => `mdi:${iconData.name}`);
    setIconList(newIconList);
  }, [searchField]);

  const emojiCheck = (emoji: string) => {
    let emojiRegex = /\p{Emoji}/u;
    if (emojiRegex.test(emoji)) {
      return 'emoji';
    } else {
      return 'icon';
    }
  };

  const useStateCheck = () => {
    if (habit.icon !== '') {
      return emojiCheck(habit.icon);
    } else {
      return 'emoji';
    }
  };

  const [iconType, setIconType] = useState<'emoji' | 'icon'>(useStateCheck);

  const [errorMessage, setErrorMessage] = useState('');

  const displayIcon = (iconOption: string[]): ReactElement => {
    if (iconOption.length === 0) {
      return (
        <div className="text-center p-4 pb-8">
          <Typography
            usage="captionRegular"
            content="No icons found. Please refine your search."
          />
        </div>
      );
    }
    return (
      <div className="items-center grid grid-cols-5 justify-items-center my-8 gap-y-4">
        {iconOption.map((currentIcon) => {
          return (
            <div
              className={`p-2 ${icon === currentIcon ? 'icon-selected' : ''}`}
              key={currentIcon}
            >
              <Icon
                className={`${getProperHabitCss(habit.colour)} !bg-transparent`}
                icon={currentIcon}
                width="40"
                height="40"
                cursor={'pointer'}
                onClick={() => setIcon(currentIcon)}
              />
            </div>
          );
        })}
      </div>
    );
  };

  // const getSelectUi = (): ReactElement => {
  //   if (iconType === 'emoji') {
  //     return (
  //       <>

  //       </>
  //     )
  //   } else if (iconType === 'icon') {
  //     return (
  //       <>

  //       </>
  //     )
  //   }

  //   return (
  //     <div style={{ width: '3%' }} className='display-icon'>
  //       {getDefaultIconFromPillars(habit.pillars)}
  //     </div>
  //   )
  // }

  return (
    <BottomSheet
      open={open}
      header={
        <BottomSheetHeader
          title="Select icon"
          leftSideActionLabel="Back"
          leftSideActionOnClick={() => {
            setCustomHabitValue('icon', icon);
            setOpen(false);
          }}
        />
      }
      defaultSnap={({ maxHeight }) => maxHeight * 0.94}
      snapPoints={({ maxHeight }) => [maxHeight * 0.94]}
    >
      <PageWrapper sidesOnly keyboardPadding>
        <SegmentedControl
          indexSelected={segIndex}
          onOptionSelected={(selectedIndex: number) => {
            if (selectedIndex === 0) {
              setIconType('icon');
              setErrorMessage('');
            } else if (selectedIndex === 1) {
              setIconType('emoji');
            }
          }}
          optionLabels={['Icons', 'Emoji']}
        />
        <div className="text-center">{errorMessage}</div>
        {iconType === 'icon' && (
          <InputStyled
            id="searchInput"
            data-testid="search"
            disableState
            inputClass="!p-4"
            wrapperClass={['mt-4 mb-6']}
            placeholder="Search"
            value={searchField}
            onValueChanged={(value: string) => {
              setSearchField(value);
            }}
          />
        )}
        {iconType === 'emoji' ? (
          <InputStyled
            id="emojiInput"
            data-testid="emoji"
            disableState
            defaultValue={emojiCheck(icon) === 'emoji' ? icon : ''}
            inputClass="!p-4"
            wrapperClass={['mt-4 mb-8']}
            placeholder="Enter an emoji"
            maxLength={2}
            onValueChanged={(value: any) => {
              if (emojiCheck(value.emoji || value) === 'emoji') {
                setIcon((value.emoji || value).replace(' ', ''));
                setErrorMessage('');
              } else {
                setErrorMessage('Please enter an emoji');
              }
            }}
          />
        ) : (
          <div data-testid="iconListTestID">{displayIcon(iconList)}</div>
        )}
      </PageWrapper>
    </BottomSheet>
  );
};
