import { createSlice } from '@reduxjs/toolkit';
import { StoreType } from '../store/store';

export type UserState = { [key: string]: any };

export const userSlice = createSlice({
  name: 'user',
  initialState: {},
  reducers: {
    setFieldWithID: (state, action) => {
      const { id, value } = action.payload;
      return { ...state, [id]: value };
    },
    loadUser: (state, action) => {
      return action.payload;
    },
    clearData: () => {
      return {};
    }
  }
});

export const { setFieldWithID, loadUser, clearData } = userSlice.actions;
export const getUser = (state: StoreType): UserState => state.user;
export default userSlice.reducer;
