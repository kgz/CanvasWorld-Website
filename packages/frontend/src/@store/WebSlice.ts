import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import type { TDatData, TDataFromObject } from '../@types/gui'

type TState = {
	menuOpen: boolean
	drawerOpen: boolean
	datData: TDatData
	data: TDataFromObject<TDatData['options']>
	description: string
}

export const UserSliceDefualt: TState = {
	menuOpen: false,
	drawerOpen: true,
	datData: {
		options: {},
		examples: [],
	},
	data: {},
	description: '',
}

export const SetMenuOpen = createAsyncThunk('store/SetMenuOpen', (data: boolean) => data)
export const SetDrawerOpen = createAsyncThunk('store/SetDrawerOpen', (data: boolean) => data)
export const setDatData = createAsyncThunk('store/setDatData', (data: TDatData) => data)
export const setData = createAsyncThunk('store/setData', (data: TDataFromObject<TDatData['options']>) => data)
export const setDescription = createAsyncThunk('store/setDescription', (data: string) => {
	console.log('Setting description:', data)
	return data
})

const Slice = createSlice({
	name: 'store',
	initialState: UserSliceDefualt,
	extraReducers: builder => {
		builder
			.addCase(SetMenuOpen.fulfilled, (state, action) => {
				state.menuOpen = action.payload
			})
			.addCase(SetDrawerOpen.fulfilled, (state, action) => {
				state.drawerOpen = action.payload
			})
			.addCase(setDatData.fulfilled, (state, action) => {
				state.datData = action.payload
			})
			.addCase(setData.fulfilled, (state, action) => {
				state.data = action.payload
			})
			.addCase(setDescription.fulfilled, (state, action) => {
				console.log('setting description ', action)
				state.description = action.payload
			})
	},
	reducers: {},
})

export const WebSlice = Slice.reducer
