import { Preferences } from '@capacitor/preferences';
import storageHelper from './storageHelper'

jest.mock('@awesome-cordova-plugins/health-kit', () => {
  return {
    ...jest.requireActual('react-router-dom'),
  };
});

jest.mock('@capacitor/preferences');

const stepsStr = { value: JSON.stringify({ steps: 50 }) };

describe('Web Platform Helper Unit Tests', () => {

  test('set storage', async () => {
    Preferences.get = jest.fn().mockResolvedValue(stepsStr)
    storageHelper.set({ test: 'Testing' });
    const steps = await storageHelper.get('steps');

    expect(Preferences.get).toHaveBeenCalledTimes(2);
    expect(steps).toEqual(50);
  })
})