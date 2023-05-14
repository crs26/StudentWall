import { configureStore } from '@reduxjs/toolkit'
import identityReducer from './identitySlice'

export default configureStore({
  reducer: {
    identity: identityReducer 
  },
})