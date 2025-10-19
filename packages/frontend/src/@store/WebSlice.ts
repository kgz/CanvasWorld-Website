import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import type { TDatData, TDataFromObject } from '../@types/gui'
import { BlockMath } from 'react-katex'
import React from 'react'

type TState = {
	menuOpen: boolean
	drawerOpen: boolean
	datData: TDatData
	data: TDataFromObject<TDatData['options']>
	description: string | React.ReactElement
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
export const setDescription = createAsyncThunk('store/setDescription', (data: string | React.ReactElement) => {
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

// Selectors
export const selectDescriptionJSX = (state: { WebSlice: TState }) => {
	const description = state.WebSlice.description
	if (!description) return null
	
	// If it's already JSX, return it directly
	if (React.isValidElement(description)) {
		return description
	}
	
	// If it's a string, convert to JSX
	return description.split('\n').map((line, index) => {
		// Check if line contains LaTeX math (starts with x_ or y_, or contains \in)
		if (line.match(/^[xy]_{/) || line.includes('\\in')) {
			return (
				<div key={index} className="my-3">
					<BlockMath math={line} />
				</div>
			)
		}
		return (
			<div key={index} className="my-1">
				{line}
			</div>
		)
	})
}
