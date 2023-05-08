import { createSlice, PayloadAction, /* createAsyncThunk */} from '@reduxjs/toolkit';
import type { RootState } from './store';
import { ApiError } from '../types/types';

const initialState: ApiError = {
  errorCode: '',
  errorMessage: '',
  meta: {}
};

export const errorSlice = createSlice({
  name: 'error',
  initialState,
  reducers: {
    setApiError: (state, action: PayloadAction<ApiError>) => {
      state.errorCode = action.payload.errorCode;
      state.errorMessage = action.payload.errorMessage;
      state.meta = action.payload.meta || {}
    },
    clearError: (state) => {
      state.errorCode = '';
      state.errorMessage = '';
      state.meta = {}
    }
  },
});

export const { setApiError, clearError } = errorSlice.actions;

export const getError = (state: RootState) => state.error;

export default errorSlice.reducer;
