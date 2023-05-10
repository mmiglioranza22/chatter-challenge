import { createSlice, PayloadAction, createAsyncThunk } from '@reduxjs/toolkit';
import type { RootState } from './store';
import { UserDataState, APIError, FormDataType } from '../types/chat';
import apiClient from '../utils/client';

const initialState: UserDataState = {
  name: '',
  lastName: '',
  email: '',
  photo: '',
  userId: '',
  authToken: ''
};

const errorState: APIError = {
  message: '',
}
// THUNKS

export const loginUser = createAsyncThunk('user/loginUser', async (loginData: FormDataType, thunkAPI) => {
  let response
  try {
    response = await apiClient.post('/login', loginData)
    return response.data;
  } catch (error: any | unknown) {
    const { response } = error
    const errorResponse: APIError = {
      message: response.data.message,
      status: response.status,
      statusText: response.statusText
    }
    return thunkAPI.rejectWithValue(errorResponse) 
  }
});


export const userSlice = createSlice({
  name: 'user',
  initialState: {
    ...initialState,
    ...errorState
  },
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
      state.error = {}
    })
    builder.addCase(loginUser.rejected, (state, action) => {
      state.error = action.payload
    })
  }
});

export const { setUserName, setLoginData, setUserData, setLogoutData } = userSlice.actions;

export const getUser = (state: RootState) => state.user;

export default userSlice.reducer;
