import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import type { RootState } from './store';
import { UserDataState } from '../types/chat';
import apiClient from '../utils/client';
import FormData from 'form-data';

const initialState: UserDataState = {
  name: '',
  lastName: '',
  email: '',
  photo: '',
  userId: '',
  authToken: ''
};

export const loginUser = createAsyncThunk("user/loginUser", async (loginData: FormData) => {
  // eslint-disable-next-line no-console
  console.log({loginData})
  const response = await apiClient.post('/login', loginData)
  return response.data;
});

export const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setUserName: (state, action: PayloadAction<string>) => {
      state.name = action.payload;
    },
    setLoginData: (state, action: PayloadAction<UserDataState>) => {
      state.userId = action.payload.userId;
      state.authToken = action.payload.authToken;
    },
    setUserData: (state, action: PayloadAction<UserDataState>) => {
      state.name = action.payload.name;
      state.lastName = action.payload.lastName;
      state.email = action.payload.email;
      state.photo = action.payload.photo;
    },
    setLogoutData: (state) => {
      state.name = '';
      state.lastName = '';
      state.email = '';
      state.photo = '';
      state.userId = '';
      state.authToken = '';
    }
  },
  extraReducers: builder => {
    builder.addCase(loginUser.fulfilled, (state, action) => {
      state.userId = action.payload.userId
      state.authToken = action.payload.token
    })
    builder.addCase(loginUser.rejected, (state, action) => {
      // eslint-disable-next-line no-console
      console.log(action.error)
    })
  }
});

export const { setUserName, setLoginData, setUserData, setLogoutData } = userSlice.actions;

export const getUser = (state: RootState) => state.user;

export default userSlice.reducer;
