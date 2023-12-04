import { Capacitor } from '@capacitor/core';
import platformHelper from './platformHelper'
import { Preferences } from '@capacitor/preferences';

jest.mock('@awesome-cordova-plugins/health-kit', () => {
  return {
    ...jest.requireActual('react-router-dom'),
  };
});

describe('Web Platform Helper Unit Tests', () => {
  beforeEach(async () => {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const helper = await platformHelper.init();
    Capacitor.getPlatform = jest.fn().mockResolvedValue('web');
    Preferences.get = jest.fn().mockImplementation(
      async (data: { key: string }): Promise<{ value: any }> => {
        return data.key === "steps"
          ? { value: 50 }
          : { value: 0 };
      }
    );
  })

  test('get steps', async () => {
    const helper = await platformHelper.init();
    const steps = await helper.getSteps();

    expect(steps).toEqual(undefined);
  })
})