// slices/responseStatusSlice.ts
import { createSlice, PayloadAction } from '@reduxjs/toolkit'

interface responseStatusState {
  status: boolean
  message?: string | null
}

const initialState: responseStatusState = {
  status: false,
  message: null
}

const responseStatusSlice = createSlice({
  name: 'responseStatus',
  initialState,
  reducers: {
    setResponseStatus(state, action: PayloadAction<{ status: boolean; message: string | null }>) {
      state.status = action.payload.status
      state.message = action.payload.message
    }
  }
})

export const { setResponseStatus } = responseStatusSlice.actions
export default responseStatusSlice.reducer
