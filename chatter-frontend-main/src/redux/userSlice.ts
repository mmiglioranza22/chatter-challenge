import { createSlice, PayloadAction, createAsyncThunk, isRejected } from '@reduxjs/toolkit';
import type { RootState } from './store';
import { UserDataState, APIError, FormDataType } from '../types/chat';
import apiClient from '../utils/client';
import { AxiosRequestConfig } from 'axios';

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

// THUNKS ACTION CREATORS

export const loginUser = createAsyncThunk('user/loginUser', async (loginData: FormDataType, thunkAPI) => {
  try {
    const response = await apiClient.post('/login', loginData)
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

export const fetchUserData = createAsyncThunk('user/fetchUserData', async (user: UserDataState, thunkAPI) => {
  try {
    const { authToken, userId } = user
      const config: AxiosRequestConfig = {
        data: { user: userId },
        headers: { Authorization: `Bearer ${authToken}` }
      }
    const response = await apiClient.get('/users', config)
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

const isARejectedAction = isRejected(loginUser, fetchUserData)

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
    // Login
    builder.addCase(loginUser.fulfilled, (state, action) => {
      state.userId = action.payload.userId
      state.authToken = action.payload.token
      state.error = {}
    })
    // User data
    builder.addCase(fetchUserData.fulfilled, (state, action) => {
      state.name = action.payload.name;
      state.lastName = action.payload.lastName;
      state.email = action.payload.email;
      state.photo = action.payload.photo;
    })
    // Error handler for all actions
    builder.addMatcher(
      (action)  => isARejectedAction(action),
      (state, action) => {
        state.error = action.payload || action.error;
      })
    }
});

export const { setUserName, setLoginData, setUserData, setLogoutData } = userSlice.actions;

export const getUser = (state: RootState) => state.user;

export default userSlice.reducer;
