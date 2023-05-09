import { userSlice } from './userSlice';
import { UserDataState } from '../types/types';
import FormData from 'form-data';
import apiClient from '../utils/client';
import { AppThunk } from './store';
import { AxiosRequestConfig } from 'axios';

export const { actions } = userSlice

export const loginUser = (data: FormData): AppThunk => {
  return async(dispatch) => {
    const response = await apiClient.post('/login', data)
    const { userId, token } = response.data
    const userData = {
      userId,
      authToken: token
    }
    dispatch(actions.setLoginData(userData))
  }
}

export const createUser = (data: FormData): AppThunk => {
  return async() => {
    const response = await apiClient.post('/signup', data)
    if (response.data.message) {
      alert(response.data.message)
      return true
    }
    return false
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