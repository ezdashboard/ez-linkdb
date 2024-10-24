const { configureStore } = require("@reduxjs/toolkit");
import { reducer as authReducer } from './authReducer';

 export const store =configureStore({
    reducer:{
      auth: authReducer,

    }
 })  