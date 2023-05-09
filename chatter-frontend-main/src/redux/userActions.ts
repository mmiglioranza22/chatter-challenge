import { userSlice } from './userSlice';
import { UserDataState } from '../types/types';
import FormData from 'form-data';
import apiClient from '../utils/client';
import { AppThunk } from './store';
import { AxiosRequestConfig } from 'axios';
import { NotificationFailure, NotificationSuccess } from '../components/Notifications';

export const { actions } = userSlice

export const loginUser = (data: FormData): AppThunk => {
  return async(dispatch) => {
    try {
      const response = await apiClient.post('/login', data)
      const { userId, token } = response.data
      const userData = {
        userId,
        authToken: token
      }
      dispatch(actions.setLoginData(userData))
      return NotificationSuccess('Login exitoso!')
    } catch (err: any | unknown) {
      const message = `${err.response.data.message}.\n(${err.response.status} ${err.response.statusText}).`
      return NotificationFailure(message)
    }
  }
}

export const createUser = (data: FormData, username: string): AppThunk => {
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