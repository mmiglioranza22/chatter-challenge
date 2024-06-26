
// * different approach for async actions interacting with API, not implemented but possible (resembles older version for handling actions)
// * THIS IS NOT IMPLEMENTED SINCE createAsyncThunk IS BETTER ADAPTED FOR API REQUESTS
// I leave it only because I started here, and then realized createAsyncThunk was a much better solution xD
// https://redux-toolkit.js.org/usage/usage-guide#async-requests-with-createasyncthunk
import { chatsSlice } from './chatsSlice';
import { UserDataState, FormDataType } from '../types/types';
import apiClient from '../utils/client';
import { AppThunk } from './store';
import { AxiosRequestConfig } from 'axios';
import { NotificationFailure, NotificationSuccess } from '../components/Notifications';

export const { actions } = chatsSlice

export const fetchUserChats = (user: UserDataState): AppThunk => {
  return async(dispatch) => {
    try {
      const { authToken, userId } = user
      const config: AxiosRequestConfig = {
        data: { user: userId },
        headers: { Authorization: `Bearer ${authToken}` }
      }
      const response = await apiClient.get('/chats', config)
      dispatch(actions.setChatsData(response.data.chats))
    } catch (err: any | unknown) {
      const message = `${err.response.data.message}.\n(${err.response.status} ${err.response.statusText}).`
      return NotificationFailure(message)
    }
  }
}

export const createChat = (data: FormDataType, user: UserDataState): AppThunk => {
  return async() => {
    try {
      const { authToken, userId, } = user
      const config: AxiosRequestConfig = {
        data: { user: userId },
        headers: { Authorization: `Bearer ${authToken}` }
      }
      const response = await apiClient.post('/chats', data, config)
      if (response.data.message) {
        return NotificationSuccess(response.data.message)
      }
    } catch (err: any | unknown) {
      const message = `${err.response.data.message}.\n(${err.response.status} ${err.response.statusText}).`
      return NotificationFailure(message)
    }
  }
}