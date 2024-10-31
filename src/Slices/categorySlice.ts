// Импорты
import { createSlice, PayloadAction, createAsyncThunk } from '@reduxjs/toolkit';
import { RootState } from '../Store/store';  


export interface Category {
    id: number;
    name: string;
    description: string;
}

export interface CategorySmallResponseDto {
    id: number;
    name: string;
    description: string;
}

interface CategoryState {
    categories: CategorySmallResponseDto[];
    loading: boolean;
    error: string | null;
    hasNext: boolean;
    totalPages: number;
}

const initialState: CategoryState = {
    categories: [],
    loading: false,
    error: null,
    hasNext: false,
    totalPages: 0,
};


export const fetchCategories = createAsyncThunk(
    'category/fetchCategories',
    async ({ page, size }: { page: number; size: number }, { rejectWithValue }) => {
        try {
            const response = await fetch(`http://localhost:8080/api/admin/categories?page=${page}&size=${size}`);
            if (!response.ok) throw new Error('Failed to fetch categories');
            const data = await response.json();
            return data;
        } catch (error: any) {
            return rejectWithValue(error.message);
        }
    }
);


export const addCategory = createAsyncThunk(
    'category/addCategory',
    async (newCategory: { name: string; description: string; slug: string }, { rejectWithValue }) => {
        try {
            const response = await fetch(`http://localhost:8080/api/admin/categories`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(newCategory),
            });
            if (!response.ok) throw new Error('Failed to add category');
            return await response.json();
        } catch (error: any) {
            return rejectWithValue(error.message);
        }
    }
);

export const deleteCategory = createAsyncThunk(
    'category/deleteCategory',
    async (id: number, { rejectWithValue }) => {
        try {
            const response = await fetch(`http://localhost:8080/api/admin/categories/${id}`, { method: 'DELETE' });
            if (!response.ok) throw new Error('Failed to delete category');
            return id;
        } catch (error: any) {
            return rejectWithValue(error.message);
        }
    }
);

const categorySlice = createSlice({
    name: 'category',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchCategories.pending, (state) => { state.loading = true; state.error = null; })
            .addCase(fetchCategories.fulfilled, (state, action: PayloadAction<{ items: CategorySmallResponseDto[]; hasNext: boolean; totalPages: number }>) => {
                state.loading = false;
                state.categories = action.payload.items;
                state.hasNext = action.payload.hasNext;
                state.totalPages = action.payload.totalPages;
            })
            .addCase(fetchCategories.rejected, (state, action) => { state.loading = false; state.error = action.payload as string; })

            .addCase(addCategory.fulfilled, (state, action) => { state.categories.push(action.payload); })
            .addCase(addCategory.rejected, (state, action) => { state.error = action.payload as string; })

            .addCase(deleteCategory.fulfilled, (state, action) => { state.categories = state.categories.filter(category => category.id !== action.payload); })
            .addCase(deleteCategory.rejected, (state, action) => { state.error = action.payload as string; });
    },
});

export default categorySlice.reducer;
export const selectCategories = (state: RootState) => state.category.categories;
