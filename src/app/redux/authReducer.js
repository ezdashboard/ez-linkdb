// authReducer.js
import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  // Your initial state here
  // For example: user: null,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    // Your reducer actions go here
    // For example: setUser: (state, action) => { state.user = action.payload; },
  },
});

export const { actions, reducer } = authSlice;
