import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import * as adminAuthService from './adminAuthService';

interface AdminAuthState {
    user: any | null;
    loading: boolean;
    error: { message?: string } | null;
     forgotPasswordMessage: string | null;
}

const initialState: AdminAuthState = {
    user: null,
    loading: false,
    error: null,
    forgotPasswordMessage: null,
};

// Async thunk for admin login
export const loginAdmin = createAsyncThunk(
    'adminAuth/login',
    async ({ email, password }: { email: string; password: string }, { rejectWithValue }) => {
        try {
            const data = await adminAuthService.loginAdmin(email, password);
            if (data.role !== 'ADMIN') {
                return rejectWithValue({ message: 'Unauthorized: User is not an admin' });
            }
            localStorage.setItem('adminToken', data.token);
            localStorage.setItem('adminUser', JSON.stringify(data));
            return data;
        } catch (error: any) {
             return rejectWithValue(error.message || 'Login failed');
        }
    }
);

  export const forgotPasswordAdmin = createAsyncThunk(
      "adminAuth/forgotPassword",
      async (email: string, thunkAPI) => {
          try {
              const data = await adminAuthService.forgotPasswordAdmin(email);
              return {
                  message:
                      "A password reset link has been sent to your email address.",
              };
          } catch (error: any) {
              return thunkAPI.rejectWithValue(
                  error?.response?.data?.message ||
                      "Failed to send password reset email."
              );
          }
      }
  );

// Slice for admin authentication
const adminAuthSlice = createSlice({
    name: 'adminAuth',
    initialState,
    reducers: {
        logoutAdmin(state) {
            localStorage.removeItem('adminToken');
            localStorage.removeItem('adminUser');
            state.user = null;
        },
        loadAdminFromStorage(state) {
            const storedUser = localStorage.getItem('adminUser');
            if (storedUser) {
                state.user = JSON.parse(storedUser);
            }
        },
        clearAdminAuthError(state) {
            state.error = null;
        },
        clearForgotPasswordMessage: (state) => {
            state.forgotPasswordMessage = null;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(loginAdmin.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(loginAdmin.fulfilled, (state, action) => {
                state.loading = false;
                state.user = action.payload;
            })
            .addCase(loginAdmin.rejected, (state, action: any) => {
                state.loading = false;
                state.error = action.payload;
            })
            .addCase(forgotPasswordAdmin.pending, (state) => {
                state.loading = true;
                state.error = null;
                state.forgotPasswordMessage = null;
            })
            .addCase(forgotPasswordAdmin.fulfilled, (state, action) => {
                state.loading = false;
                state.forgotPasswordMessage = action.payload?.message;
            })
            .addCase(forgotPasswordAdmin.rejected, (state, action: any) => {
                state.loading = false;
                state.error = action.payload;
                state.forgotPasswordMessage = null;
            });
    },
});

export const { logoutAdmin, loadAdminFromStorage, clearAdminAuthError, clearForgotPasswordMessage } = adminAuthSlice.actions;
export default adminAuthSlice.reducer;