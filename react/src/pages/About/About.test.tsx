import React from 'react';
import { Provider } from 'react-redux';
import store from '../../store/store';
import { render, screen } from '@testing-library/react';
import { About } from './About'
import { BrowserRouter } from 'react-router-dom';

jest.mock('contentful', () => ({
    ...jest.requireActual('contentful'), // use actual for all non-hook parts
    createClient: () => {
      return {
        getEntries: () => Promise.resolve({ data: {} })
      }
    }
}));

describe('About Page Unit Tests', () => {
    test('Renders about page', () => {
        render(
            <Provider store={store}>
            <BrowserRouter>
                <About />
            </ BrowserRouter>
            </Provider>
        );
    const text = screen.getByText(/Body not exist/i);
    expect(text).toBeInTheDocument(); })

    test('Renders about page content', () => {
        render(
            <Provider store={store}>
            <BrowserRouter>
                <About />
            </ BrowserRouter>
            </Provider>
        );
    const text = screen.getByText(/Body not exist/i);
    expect(text).toBeInTheDocument(); })
})