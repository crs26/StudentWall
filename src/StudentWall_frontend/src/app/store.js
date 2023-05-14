import { configureStore } from '@reduxjs/toolkit'
import identityReducer from './identitySlice'
import commentSlice from './commentSlice'

export default configureStore({
  reducer: {
    identity: identityReducer, 
    post: commentSlice,
    comment: commentSlice
  },
})