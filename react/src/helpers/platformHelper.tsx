
import { Capacitor } from '@capacitor/core';
import HealthKit from './ios/healthKit';
import networkHelper from './web/networkHelper';

export default class PlatformHelper {
  static health: any;

  static async init(): Promise<PlatformHelper> {
    const platform = Capacitor.getPlatform();
    console.log(`Platform detected: ${platform}... Initializing`);

    this.health = {
      getSteps: () => console.log('Not implemented')
    }
    if (platform === 'ios') {
      this.health = await HealthKit.init();
    } else if (platform === 'ios') {
      // this.helper = new GoogleFit();
    } else if (platform === 'web') {
      this.health = networkHelper;
    }
    console.log('Platform initialized');
    return new PlatformHelper();
  }

  public getSteps = async () => {
    const steps = await PlatformHelper.health.getSteps('steps');
    return steps;
  }
}