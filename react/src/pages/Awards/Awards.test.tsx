import { BrowserRouter } from 'react-router-dom';
import { Awards } from './Awards';
import { Provider } from 'react-redux';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import store from 'store/store';
import NetworkHelper from 'helpers/web/networkHelper';
const superagent = require('superagent');

const mockAuth = {
  currentUser: { uid: 'test-uid', getIdToken: () => 'test-token' },
  onAuthStateChanged: jest.fn()
};

const mockRecordAchievement = jest.fn();
NetworkHelper.recordAchievement = mockRecordAchievement;

jest.mock('firebase/auth', () => ({
  ...jest.requireActual('firebase/auth'),
  getAuth: () => mockAuth
}));

describe('Awards Page Unit Tests', () => {
  test('Renders awards page', () => {
    render(
      <Provider store={store}>
        <BrowserRouter>
          <Awards />
        </BrowserRouter>
      </Provider>
    );

    const text = screen.getByText(/Award page/i);
    expect(text).toBeInTheDocument();
  });

  test('Completed achievements from server are marked as complete', async () => {
    superagent.send = jest.fn().mockResolvedValue({
      body: {
        achievements: [
          {
            AchievementID: 'trackedFirstActivity',
            EarnedAt: new Date().toISOString()
          }
        ]
      }
    });

    render(
      <Provider store={store}>
        <BrowserRouter>
          <Awards />
        </BrowserRouter>
      </Provider>
    );

    await waitFor(() => {
      const image = screen.getAllByRole('img')[0];
      expect(image).toHaveClass('star');
    });
  });

  test('Render social modal on achievement click', () => {
    render(
      <Provider store={store}>
        <BrowserRouter>
          <Awards />
        </BrowserRouter>
      </Provider>
    );

    const achievements = screen.getAllByTestId('achievementCardTestID');
    fireEvent.click(achievements[0]);

    const socialModalTitle = screen.getByText(
      'Share Your Award on Social Media!'
    );
    expect(socialModalTitle).toBeInTheDocument();

    const achievementTitles = screen.getAllByText('Tracked your first habit');
    expect(achievementTitles.length).toEqual(2);
  });

  test('Records achievement', () => {
    render(
      <Provider store={store}>
        <BrowserRouter>
          <Awards />
        </BrowserRouter>
      </Provider>
    );

    const recordButton = screen.getByTestId('recordButton');
    fireEvent.click(recordButton);

    expect(mockRecordAchievement).toBeCalled();
  });
});
