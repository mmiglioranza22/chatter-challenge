import { createSlice, PayloadAction, createAsyncThunk, isRejected, isFulfilled } from '@reduxjs/toolkit';
import type { RootState } from './store';
import { ChatsState, ChatTabProps, UserDataState, APIResponse, FormDataType } from '../types/chat';
import apiClient from '../utils/client';
import { AxiosRequestConfig } from 'axios';
import { generateApiErrorResponse } from '../utils/utils';

const initialState: ChatsState = {
  chats: [],
  isAllowedExpand: true
};

const apiResponseState: APIResponse = {
  message: '',
}

// THUNKS ACTION CREATORS

export const fetchUserChats = createAsyncThunk('user/fetchUserData', async (user: UserDataState, thunkAPI) => {
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

export const deleteChat = createAsyncThunk('user/deleteChat', async (data: Record<string, any>, thunkAPI) => {
  try {
    const { 
      chatId,
      userData: {
        authToken, 
        userId 
      }
    } = data
    const config: AxiosRequestConfig = {
      data: { user: userId },
      headers: { Authorization: `Bearer ${authToken}` }
    }
    const response = await apiClient.delete(`/chats/${chatId}`, config)
    return response.data;
  } catch (error: any | unknown) {
    const errorResponse: APIResponse = generateApiErrorResponse(error)
    return thunkAPI.rejectWithValue(errorResponse) 
  }
});

const isRejectedAction = isRejected(fetchUserChats)
const isFulfilledAction = isFulfilled(fetchUserChats)

export const chatsSlice = createSlice({
  name: 'chats',
  initialState: {
    ...initialState,
    ...apiResponseState
  },
  reducers: {
    setChatsData: (state, action: PayloadAction<Array<ChatTabProps>>) => {
      state.chats = action.payload;
    },
    setIsAllowedExpand: (state, action: PayloadAction<boolean>) => {
      state.isAllowedExpand = action.payload;
    }
  },
  extraReducers: builder => {
    // Fetch chats
    builder.addCase(fetchUserChats.fulfilled, (state, action) => {
      state.chats = action.payload.chats;
    })
    // Delete chats
    builder.addCase(deleteChat.fulfilled, (state, action) => {
      state.message = action.payload.message;
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

export const { setChatsData, setIsAllowedExpand } = chatsSlice.actions;

export const getChats = (state: RootState) => state.chats;
export const getIsAllowedExpand = (state: RootState) => state.chats.isAllowedExpand;

export default chatsSlice.reducer;
