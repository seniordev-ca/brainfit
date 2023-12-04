import { createSlice } from '@reduxjs/toolkit';
import { StoreType } from '../store/store';

export type HabitState = { [key: string]: any };

export const habitSlice = createSlice({
  name: 'habit',
  initialState: {},
  reducers: {
    setHabitFieldWithID: (state, action) => {
      const { id, value } = action.payload;
      return { ...state, [id]: value };
    },
    loadHabit: (state, action) => {
      return action.payload;
    },
    clearData: () => {
      return {};
    }
  }
});

export const { setHabitFieldWithID, loadHabit, clearData } = habitSlice.actions;
export const getHabit = (state: StoreType): HabitState => state.habit;
export default habitSlice.reducer;
