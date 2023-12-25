import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'

type TSiteState = {
    menuOpen: boolean,
    drawerOpen: boolean,
}

export const UserSliceDefualt: TSiteState = {
    menuOpen: false,
    drawerOpen: true,
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
    },
    reducers: {},
});

export default webSiteState.reducer