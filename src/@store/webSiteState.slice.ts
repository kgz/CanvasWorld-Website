import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'

type TSiteState = {
    menuOpen: boolean
}

export const UserSliceDefualt: TSiteState = {
    menuOpen: false,
}

export const SetMenuOpen = createAsyncThunk(
    'store/SetMenuOpen',
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
    },
    reducers: {},
});

export default webSiteState.reducer