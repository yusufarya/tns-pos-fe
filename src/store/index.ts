// store.ts
import { configureStore } from '@reduxjs/toolkit'
import userReducer from './slices/user-slice' // Adjust the path to your user slice
import setPageName from './slices/page-name-slice'
import setResponseStatus from './slices/response-status-slice'

export const store = configureStore({
  reducer: {
    user: userReducer,
    pageName: setPageName,
    responseStatus: setResponseStatus

    // add other reducers here
  }
})

// Optional: Type for RootState and AppDispatch
export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
