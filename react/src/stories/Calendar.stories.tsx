import React from 'react';
import store from 'store/store';
import { Provider } from 'react-redux';
import { ComponentStory, ComponentMeta } from '@storybook/react';

import { Calendar } from '../Components/Calendar/Calendar';
import { StateHelperContextProvider } from 'contexts/stateHelper.context';

export default {
  title: 'Molecules/Calendar',
  component: Calendar,
  decorators: [
    (Story) => {
      return <StateHelperContextProvider><Story /></StateHelperContextProvider>
    }
  ]
} as ComponentMeta<typeof Calendar>;

const Template: ComponentStory<typeof Calendar> = (args) => <Provider store={store}><Calendar {...args} /></Provider>;

export const DefaultCalendar = Template.bind({});

export const MonthlyView = Template.bind({});
MonthlyView.args = {
  initialRangeType: 'month'
}

export const MonthlyViewNoNavigationAndHeader = Template.bind({});
MonthlyViewNoNavigationAndHeader.args = {
  initialRangeType: 'month',
  hideHeader: true,
  disableNavigation: true
}

export const ShowWeekdaysInsteadOfDates = Template.bind({});
ShowWeekdaysInsteadOfDates.args = {
  calendarStyle: 'weekdays'
}

export const ShowWeekdaysHideHeader = Template.bind({});
ShowWeekdaysHideHeader.args = {
  calendarStyle: 'weekdays',
  hideHeader: true,
}

export const MultipleDaysSelection = Template.bind({});
MultipleDaysSelection.args = {
  calendarStyle: 'daysSelection',
  hideHeader: true,
  disableNavigation: true,
  onSelectedDaysChanged: (days: any) => {
    console.log('save passed value to parent state');
    console.log(days);
  }
}

/**
 * Pass string of classes to dayClass to style the calendar day button. The wrapper can also be modified by passing a string of classes to wrapperClass
 * */
export const PassDatesWithDifferentStyling = Template.bind({});
PassDatesWithDifferentStyling.args = {
  initialRangeType: 'month',
  calendarData: [
    {
      dayClass: '!bg-red-600 !text-white active:!bg-slate-400 hover:!bg-red-300',
      dates: [
        '2022-05-10',
        '2022-05-08'
      ]
    },
    {
      dayClass: '!bg-blue-600 !text-white',
      dates: [
        '2022-05-06',
        '2022-05-04'
      ]
    }
  ]
}
