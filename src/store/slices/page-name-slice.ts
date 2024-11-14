// slices/paneNameSlice.ts
import { createSlice, PayloadAction } from '@reduxjs/toolkit'

interface pageNameState {
  firstParam?: string | null
  secondParam?: string | null
}

const initialState: pageNameState = {
  firstParam: null,
  secondParam: null
}

const paneNameSlice = createSlice({
  name: 'pageName',
  initialState,
  reducers: {
    setPageName(state, action: PayloadAction<{ params1: string; params2: string }>) {
      state.firstParam = action.payload.params1
      state.secondParam = action.payload.params2
    }
  }
})

export const { setPageName } = paneNameSlice.actions
export default paneNameSlice.reducer
