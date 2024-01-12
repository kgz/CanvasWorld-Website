import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import type { TDatData, TDataFromObject } from '../@types/gui'

type TSiteState = {
    menuOpen: boolean,
    drawerOpen: boolean,
    datData: TDatData,
    data: TDataFromObject<TDatData['options']>
    description: JSX.Element | JSX.Element[]
}

export const UserSliceDefualt: TSiteState = {
    menuOpen: false,
    drawerOpen: true,
    datData: {
        options: {},
        examples: []
    },
    data: {},
    description: [] as JSX.Element[]
}

export const SetMenuOpen = createAsyncThunk(
    'store/SetMenuOpen',
    (data: boolean) => {
        return data
    }
)

export const SetDrawerOpen = createAsyncThunk(
    'store/SetDrawerOpen',
    (data: boolean) => {
        return data
    }
)

export const setDatData = createAsyncThunk(
    'store/setDatData',
    (data: TDatData) => {
        return data
    }
)

export const setData = createAsyncThunk(
    'store/setData',
    (data: TDataFromObject<TDatData['options']>) => {
        return data
    }
)

export const setDescription = createAsyncThunk(
    'store/setDescription',
    (data: JSX.Element | JSX.Element[]) => {
        return data
    }
)

const webSiteState = createSlice({
    name: 'store',
    initialState: UserSliceDefualt,
    extraReducers: (builder) => {
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
                state.description = action.payload
            })

    },
    reducers: {},
});

export default webSiteState.reducer