import React from 'react';
import { Provider } from 'react-redux';
import { render, screen } from '@testing-library/react';
import store from '../../store/store';
import { Scroller } from './Scroller';

test('renders Scroller', () => {
  render(
    <Provider store={store}>
      <Scroller
        id="ScrollerTest"
        source={[
          { value: 'test', text: 'test' },
          ...new Array(24).fill(1).map((v, i) => ({ value: i + 1, text: i + 1 }))
        ]} />
    </Provider>
  );
  const text = screen.queryAllByText(/test/i);
  expect(text.length).toEqual(4);
});
