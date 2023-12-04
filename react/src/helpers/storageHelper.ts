import { Preferences } from '@capacitor/preferences';

const defaultState = {
  data: {
    data: {
      questionnaireAnswers: [] as string[],
      notifications: [] as any[],
      appearanceOption: "system"
    }
  },
  user: {},
  navigation: {}
};

const storageHelper = {
  async save(data: object) {
    try {
      const store = JSON.stringify(data);
      await Preferences.set({ key: 'localStorage', value: store });
    } catch (err: any) {
      console.error(err.message.toString());
    }
  },

  async set(params: object) {
    try {
      let { value }: any = await Preferences.get({ key: 'localStorage' });
      const parsed = JSON.parse(value);
      value = params;
      if (parsed) {
        value = { ...parsed, ...params };
      }
      const store = JSON.stringify(value);
      await Preferences.set({ key: 'localStorage', value: store });
    } catch (err: any) {
      console.error(err.message.toString());
    }
  },

  async getAll(): Promise<any> {
    try {
      let { value }: any = await Preferences.get({ key: 'localStorage' });
      let parsed = defaultState;

      if (value) {
        parsed = JSON.parse(value);
      }
      return parsed;
    } catch (err: any) {
      console.error(err.message.toString());
    }
  },

  async get(key: string) {
    try {
      let { value }: any = await Preferences.get({ key: 'localStorage' });
      console.log(`Retrieved storage: ${value}`);
      const parsed = JSON.parse(value);
      if (!parsed) return null;
      return parsed[key];
    } catch (err: any) {
      console.error(err.message.toString());
    }
  },

  async removeAll() {
    await Preferences.clear();
  },

  async remove(key: string) {
    try {
      let { value }: any = await Preferences.get({ key: 'localStorage' });
      const parsed = JSON.parse(value);
      delete parsed[key];
      value = JSON.stringify(parsed);
      await Preferences.set({ key: 'localStorage', value: value });
    } catch (err: any) {
      console.error(err.message.toString());
    }
  }
};

export default storageHelper;
