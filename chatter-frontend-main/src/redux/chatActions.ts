import { chatsSlice } from './chatsSlice';
import { UserDataState } from '../types/types';
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
      // eslint-disable-next-line no-console
      console.log(response.data)
      dispatch(actions.setChatsData(response.data.chats))
    } catch (err: any | unknown) {
      const message = `${err.response.data.message}.\n(${err.response.status} ${err.response.statusText}).`
      return NotificationFailure(message)
    }
  }
}
