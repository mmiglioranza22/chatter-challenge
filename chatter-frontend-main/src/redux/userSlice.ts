import { createSlice, PayloadAction, createAsyncThunk, isRejected, isFulfilled } from '@reduxjs/toolkit';
import type { RootState } from './store';
import { UserDataState, APIResponse, FormDataType } from '../types/chat';
import apiClient from '../utils/client';
import { AxiosRequestConfig } from 'axios';
import { generateApiErrorResponse } from '../utils/utils';

const initialState: UserDataState = {
  name: '',
  lastName: '',
  email: '',
  photo: '',
  userId: '',
  authToken: ''
};

const apiResponseState: APIResponse = {
  message: '',
}

// THUNKS ACTION CREATORS

export const loginUser = createAsyncThunk('user/loginUser', async (loginData: FormDataType, thunkAPI) => {
  try {
    const response = await apiClient.post('/login', loginData)
    return response.data;
  } catch (error: any | unknown) {
    const errorResponse: APIResponse = generateApiErrorResponse(error)
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
    const errorResponse: APIResponse = generateApiErrorResponse(error)
    return thunkAPI.rejectWithValue(errorResponse) 
  }
});

export const createUser = createAsyncThunk('user/createUser', async (data: FormDataType , thunkAPI) => {
  try {
    const response = await apiClient.post('/signup', data)
    return response.data;
  } catch (error: any | unknown) {
    const errorResponse: APIResponse = generateApiErrorResponse(error) 
    return thunkAPI.rejectWithValue(errorResponse) 
  }
});

export const deleteUser = createAsyncThunk('user/deleteUser', async (user: UserDataState, thunkAPI) => {
  try {
    const { authToken, userId } = user
      const config: AxiosRequestConfig = {
        data: { user: userId },
        headers: { Authorization: `Bearer ${authToken}` }
      }
    const response = await apiClient.delete('/users', config)
    return response.data
  } catch (error: any | unknown) {
    const errorResponse: APIResponse = generateApiErrorResponse(error)
    return thunkAPI.rejectWithValue(errorResponse) 
  }
});

const isRejectedAction = isRejected(loginUser, fetchUserData, createUser)
const isFulfilledAction = isFulfilled(loginUser, fetchUserData, createUser)

export const userSlice = createSlice({
  name: 'user',
  initialState: {
    ...initialState,
    ...apiResponseState
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
    })
    // User data
    builder.addCase(fetchUserData.fulfilled, (state, action) => {
      state.name = action.payload.name;
      state.lastName = action.payload.lastName;
      state.email = action.payload.email;
      state.photo = action.payload.photo;
    })
    // Create new user
    builder.addCase(createUser.fulfilled, (state, action) => {
     state.message = action.payload
    })
    // Delete user
    builder.addCase(deleteUser.fulfilled, (state, action) => {
      state = initialState
      state.message = action.payload
     })   
    // Error handler for all actions
    builder.addMatcher(
      (action)  => isRejectedAction(action),
      (state, action) => {
        state.error = action.payload || action.error;
      })
    // Clear stale errors upon successful API responses.
    builder.addMatcher(
      (action)  => isFulfilledAction(action),
      (state) => {
        state.error = {};
      }) 
    }
});

export const { setUserName, setLoginData, setUserData, setLogoutData } = userSlice.actions;

export const getUser = (state: RootState) => state.user;

export default userSlice.reducer;
