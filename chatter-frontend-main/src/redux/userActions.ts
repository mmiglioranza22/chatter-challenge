import { userSlice } from './userSlice';
import { UserDataState } from '../types/types';
import FormData from 'form-data';
import apiClient from '../utils/client';
import { AppThunk } from './store';
import { AxiosRequestConfig } from 'axios';

export const { actions } = userSlice

export const loginUser = (loginData: FormData): AppThunk => {
  return async(dispatch) => {
    const response = await apiClient.post('/login', loginData)
    const userData = {
      userId: response.data.userId,
      authToken: response.data.token
    }
    dispatch(actions.setLoginData(userData))
  }
}

export const fetchUserData = (user: UserDataState): AppThunk => {
  return async(dispatch) => {
    const { authToken, userId } = user
    const config: AxiosRequestConfig = {
      data: { user: userId },
      headers: { Authorization: `Bearer ${authToken}` }
    }
    const response = await apiClient.get('/users', config)
    dispatch(actions.setUserData(response.data))
  }
}