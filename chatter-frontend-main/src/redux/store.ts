import { configureStore, AnyAction, ThunkAction } from '@reduxjs/toolkit'
import { userSlice } from './userSlice'
import { chatsSlice } from './chatsSlice'
import { errorSlice } from './errorSlice'

export const store = configureStore({
  reducer: {
      user: userSlice.reducer,
      chats: chatsSlice.reducer,
      error: errorSlice.reducer
  }
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
export type AppThunk<ReturnType = void> = ThunkAction<
  ReturnType,
  RootState,
  unknown,
  AnyAction
>