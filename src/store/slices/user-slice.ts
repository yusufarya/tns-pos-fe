// slices/userSlice.ts
import { Profile } from '@/@core/types'
import { createSlice, PayloadAction } from '@reduxjs/toolkit'

interface UserState {
  user: Profile | null
  isLoggedIn: boolean
  message: string | null
}

const initialState: UserState = {
  user: null,
  isLoggedIn: false,
  message: null
}

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setUserData(state, action: PayloadAction<Profile>) {
      state.user = action.payload
      state.isLoggedIn = true
      state.message = null
    },
    clearUserData(state) {
      state.user = null
      state.isLoggedIn = false
    },
    setUserError(state, action: PayloadAction<string>) {
      state.message = action.payload
    },
    setIsLoggedIn(state, action: PayloadAction<{ status: boolean; message: string }>) {
      state.isLoggedIn = action.payload.status === true
      state.message = action.payload.message
    }
  }
})

export const { setUserData, clearUserData, setUserError, setIsLoggedIn } = userSlice.actions
export default userSlice.reducer
