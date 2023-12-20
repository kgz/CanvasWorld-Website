import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'

import { newStoreState } from '../@types/storeState'

import type { TUser } from '../@types/TUser';

import Cookies from "universal-cookie";


export const UserSliceDefualt = newStoreState<{user: TUser, loggedIn: boolean}>(0, {
    user: {},
    loggedIn: false
})


export const setUserData = createAsyncThunk(
    'store/setUserData',
    (data: TUser['data']) => {
        return data
    }
)

export const setLoggedIn = createAsyncThunk(
    'store/setLoggedIn',
    (data: boolean) => {
        return data
    }
)

export const setProfileUrl = createAsyncThunk(
    'store/setProfileUrl',
    (data: string) => {
        return data
    }
)

export const setProfileCache = createAsyncThunk(
    'store/setProfileCache',
    (data: string) => {
        return data
    }
)


const UserSlice = createSlice({
	name: 'store',
	initialState: UserSliceDefualt,
	extraReducers: (builder) => {
		builder
			.addCase(setUserData.fulfilled, (state, action) => {
                state.data.user.data = action.payload
            })
            .addCase(setLoggedIn.fulfilled, (state, action) => {
                state.data.loggedIn = action.payload
            })
            .addCase(setProfileUrl.fulfilled, (state, action) => {
                state.data.user.profileUrl = action.payload
            })
            .addCase(setProfileCache.fulfilled, (state, action) => {
                state.data.user.profileCache = action.payload
            })
			
	},
	reducers: {},
});

export default UserSlice.reducer