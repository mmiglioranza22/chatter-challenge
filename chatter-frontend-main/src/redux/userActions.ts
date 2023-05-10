
// * different approach for async actions interacting with API, not implemented but possible (resembles older version for handling actions)
// * THIS IS NOT IMPLEMENTED SINCE createAsyncThunk IS BETTER ADAPTED FOR API REQUESTS
// https://redux-toolkit.js.org/usage/usage-guide#async-requests-with-createasyncthunk
import { userSlice } from './userSlice';
import { UserDataState, FormDataType } from '../types/types';
import apiClient from '../utils/client';
import { AppThunk } from './store';
import { AxiosRequestConfig } from 'axios';
import { NotificationFailure, NotificationSuccess } from '../components/Notifications';

export const { actions } = userSlice

export const loginUser = (data: FormDataType): AppThunk => {
  return async(dispatch) => {
    try {
      const response = await apiClient.post('/login', data)
      const { userId, token } = response.data
      const userData = {
        userId,
        authToken: token
      }
      dispatch(actions.setLoginData(userData))
    } catch (err: any | unknown) {
      const message = `${err.response.data.message}.\n(${err.response.status} ${err.response.statusText}).`
      return NotificationFailure(message)
    }
  }
}

export const createUser = (data: FormDataType, username: string): AppThunk => {
  return async(dispatch) => {
    try {
      const response = await apiClient.post('/signup', data)
      if (response.data.message) {
        dispatch(actions.setUserName(username))
        return NotificationSuccess(response.data.message)
      }
    } catch (err: any | unknown) {
      const message = `${err.response.data.message}.\n(${err.response.status} ${err.response.statusText}).`
      return NotificationFailure(message)
    }
  }
}

export const fetchUserData = (user: UserDataState): AppThunk => {
  return async(dispatch) => {
    try {
      const { authToken, userId } = user
      const config: AxiosRequestConfig = {
        data: { user: userId },
        headers: { Authorization: `Bearer ${authToken}` }
      }
      const response = await apiClient.get('/users', config)
      dispatch(actions.setUserData(response.data))
    } catch (err: any | unknown) {
      const message = `${err.response.data.message}.\n(${err.response.status} ${err.response.statusText}).`
      return NotificationFailure(message)
    }
  }
}

export const deleteUser = (user: UserDataState): AppThunk => {
  return async(dispatch) => {
    try {
      const { authToken, userId } = user
      const config: AxiosRequestConfig = {
        data: { user: userId },
        headers: { Authorization: `Bearer ${authToken}` }
      }
      const response = await apiClient.delete('/users', config)
      if (response.data.message) {
        dispatch(actions.setLogoutData())
        return NotificationSuccess(response.data.message)
      }
    } catch (err: any | unknown) {
      const message = `${err.response.data.message}.\n(${err.response.status} ${err.response.statusText}).`
      return NotificationFailure(message)
    }
  }
}