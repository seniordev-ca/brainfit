// Similar docs on HealthKit
// https://github.com/EddyVerbruggen/HealthKit
// Possible sample types: https://github.com/theos/sdks/blob/master/iPhoneOS10.3.sdk/System/Library/Frameworks/HealthKit.framework/Headers/HKTypeIdentifiers.h

import { HealthKit } from '@awesome-cordova-plugins/health-kit';

// const fitnessSampleTypes = {
//   stepCount: 'HKQuantityTypeIdentifierStepCount',
//   distanceWalking: 'HKQuantityTypeIdentifierDistanceWalkingRunning',
//   distanceCycling: 'HKQuantityTypeIdentifierDistanceCycling',
//   distanceWheelchair: 'HKQuantityTypeIdentifierDistanceWheelchair',

// }
export default class CustomHealthKit {
  static available: boolean;
  static authorized: boolean;
  static supportedTypes: string[] = [
    'HKQuantityTypeIdentifierHeight',
    'HKQuantityTypeIdentifierStepCount',
    'HKQuantityTypeIdentifierDistanceWalkingRunning',
    'HKCategoryTypeIdentifierSleepAnalysis',
    'HKQuantityTypeIdentifierDietaryEnergyConsumed',
    'HKQuantityTypeIdentifierDietaryFatTotal'
  ];

  static async init() {
    await this.checkAvailability()
    await this.requestAuthorization();

    return new CustomHealthKit();
  }

  protected static async checkAvailability() {
    const available = await HealthKit.available();

    if (!available) console.error('HealthKit not available');
  }

  protected static async requestAuthorization() {
    const authorized = await HealthKit.requestAuthorization(
      {
        readTypes: CustomHealthKit.supportedTypes,
        writeTypes: CustomHealthKit.supportedTypes
      }
    );

    if (!authorized) console.error('HealthKit not authorized');
  }

  private async querySampleType(sampleType: string, startDate?: Date, endDate?: Date) {
    console.log(`querying health kit sample: ${sampleType}\nstart date:${startDate}\nend date:${endDate}`);
    const now = new Date();
    const data = await HealthKit.querySampleType({
      sampleType: sampleType,
      startDate: startDate || new Date(now.getFullYear(), now.getMonth() - 1, 1),
      endDate: endDate || now
    });
    console.log(`Retrieved: ${JSON.stringify(data)}`);
    return data;
  }

  private async querySampleTypeAggregated(sampleType: string, aggregation: string = 'year', startDate?: Date, endDate?: Date) {
    console.log(`querying health kit sample aggregated: ${sampleType}\nstart date:${startDate}\nend date:${endDate}`);
    const now = new Date();
    const data = await HealthKit.querySampleType({
      sampleType: sampleType,
      aggregation: aggregation,
      startDate: startDate || new Date(now.getFullYear(), now.getMonth() - 1, 1),
      endDate: endDate || now
    });
    console.log(`Retrieved: ${JSON.stringify(data)}`);
    return data;
  }

  private async sumQuantityType(sampleType: string, startDate?: Date, endDate?: Date) {
    console.log(`querying health kit sum: ${sampleType}\nstart date:${startDate}\nend date:${endDate}`);
    const now = new Date();
    const data = await HealthKit.sumQuantityType({
      sampleType: sampleType,
      startDate: startDate || new Date(now.getFullYear(), now.getMonth() - 1, 1),
      endDate: endDate || now
    });
    console.log(`Retrieved ${sampleType}: ${JSON.stringify(data)}`);
    return data;
  }

  public async getSteps() {
    const steps = await this.sumQuantityType('HKQuantityTypeIdentifierStepCount');
    return steps;
  }
}