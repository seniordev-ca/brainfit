import { PillarArticle } from '../PillarArticle/PillarArticle';
import { render, screen, waitFor } from '@testing-library/react';
import { Provider } from 'react-redux';
import store from 'store/store';
import { setDataFieldWithID } from 'slices/dataSlice';
import NetworkHelper from 'helpers/web/networkHelper';
import { BrowserRouter } from 'react-router-dom';

const superagent = require('superagent');

jest.mock('@capacitor-community/fcm', () => {});

Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: jest.fn().mockImplementation((query) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: jest.fn(), // Deprecated
    removeListener: jest.fn(), // Deprecated
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    dispatchEvent: jest.fn()
  }))
});

jest.mock('contentful', () => ({
  ...jest.requireActual('contentful'), // use actual for all non-hook parts
  createClient: () => {
    return {
      getEntry: () =>
        Promise.resolve({
          sys: {
            id: 'Pillar ID'
          },
          fields: {
            pillar: 'exercise',
            title: 'content',
            label: 'green'
          }
        }),
      getEntries: () =>
        Promise.resolve({
          articleContent: [
            {
              pillar: 'Exercise Sleep',
              title: 'super habit',
              byline: 'sample author'
            },
            {
              pillar: 'Exercise',
              title: 'test habit',
              byline: 'sample author'
            }
          ]
        })
    };
  }
}));

jest.mock('@contentful/rich-text-react-renderer');

jest.mock('react-router', () => ({
  ...jest.requireActual('react-router'), // use actual for all non-hook parts
  useNavigate: () => jest.fn()
}));

const mockAuth = {
  currentUser: { uid: 'test-uid', getIdToken: () => 'test-token' },
  onAuthStateChanged: jest.fn()
};

jest.mock('firebase/auth', () => ({
  ...jest.requireActual('firebase/auth'),
  getAuth: () => mockAuth
}));

describe('Pillar Article tests', () => {
  const setOpen = jest.fn();

  test('renders pillar article page', async () => {
    superagent.query = jest.fn().mockResolvedValue({
      body: {
        habits: []
      }
    });

    store.dispatch(
      setDataFieldWithID({ id: 'currentPillar', value: 'exercise' })
    );
    NetworkHelper.getHabitsByPillar = jest.fn().mockImplementation(() => {
      return [];
    });

    render(
      <Provider store={store}>
        <BrowserRouter>
          <PillarArticle
            open={true}
            setOpen={setOpen}
            content={{
              body: undefined,
              byline: '',
              pillar: 'Exercise',
              title: 'super habit',
              publicationDate: '',
              audioOrVideoAsset: undefined,
              relatedHabits: undefined,
              createdAt: Date.now()
            }}
          />
        </BrowserRouter>
      </Provider>
    );

    await waitFor(() => {
      const text = screen.getByText(/super habit/i);
      expect(text).toBeInTheDocument();
    });
  });

  test('does not render certain habit for pillar article page', async () => {
    superagent.query = jest.fn().mockResolvedValue({
      body: {
        habits: []
      }
    });

    store.dispatch(
      setDataFieldWithID({ id: 'currentPillar', value: 'exercise' })
    );
    NetworkHelper.getHabitsByPillar = jest.fn().mockImplementation(() => {
      return [
        {
          pillar: 'Exercise',
          Title: 'test habit'
        }
      ];
    });

    render(
      <Provider store={store}>
        <BrowserRouter>
          <PillarArticle
            open={true}
            setOpen={setOpen}
            content={{
              body: '',
              pillar: 'Nutrition',
              title: 'super habit',
              byline: 'sample author',
              publicationDate: '',
              audioOrVideoAsset: undefined,
              relatedHabits: undefined,
              createdAt: Date.now()
            }}
          />
        </BrowserRouter>
      </Provider>
    );

    await waitFor(() => {
      const text = screen.queryByRole('test habit');
      expect(text).not.toBeInTheDocument();
    });
  });
});
