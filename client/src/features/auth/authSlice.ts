import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import * as authService from "../../app/api/authService";

export interface AuthState {
  user: authService.AuthResponse | null;
  loading: boolean;
  error: { message?: string; detail?: string } | string | null;
  verificationMessage: string | null; 
  forgotPasswordMessage: string | null;
}

const initialState: AuthState = {
  user: null,
  loading: false,
  error: null,
  verificationMessage: null,
  forgotPasswordMessage: null,
};

export const loginUser = createAsyncThunk(
  "auth/login",
  async (
    { email, password }: { email: string; password: string },
    thunkAPI
  ) => {
    try {
      const data = await authService.login(email, password);
      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data));
      return data;
    } catch (error: any) {
      return thunkAPI.rejectWithValue(error);
    }
  }
);

export const signupUser = createAsyncThunk(
  "auth/signup",
  async (
    {
      name,
      email,
      password,
      phone,
    }: { name: string; email: string; password: string; phone: string },
    thunkAPI
  ) => {
    try {
      const data = await authService.signup(name, email, password, phone);
      return data; // Backend now returns a success message
    } catch (error: any) {
      return thunkAPI.rejectWithValue(error);
    }
  }
);


export const forgotPassword = createAsyncThunk(
  "auth/forgotPassword",
  async (email: string, thunkAPI) => {
    try {
      await authService.forgotPassword(email);
      return { message: 'A password reset link has been sent to your email address.' }; // Return a success message
    } catch (error: any) {
      return thunkAPI.rejectWithValue(error?.response?.data?.message || 'Failed to send password reset email.');
    }
  }
);


export const resetPassword = createAsyncThunk(
  "auth/resetPassword",
  async ({ token, newPassword }: { token: string; newPassword: string }, thunkAPI) => {
    try {
      await authService.resetPassword(token, newPassword); // We'll create this in authService
      return { message: 'Your password has been reset successfully. You can now log in with your new password.' };
    } catch (error: any) {
      return thunkAPI.rejectWithValue(error?.response?.data?.message || 'Failed to reset password. Please try again or request a new link.');
    }
  }
);

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    logout(state) {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      state.user = null;
    },
    loadUserFromStorage(state) {
      const storedUser = localStorage.getItem("user");
      if (storedUser) {
        state.user = JSON.parse(storedUser);
      }
    },
    clearVerificationMessage(state) {
      state.verificationMessage = null;
    },
    clearAuthError: (state) => { // NEW REDUCER TO CLEAR THE ERROR
      state.error = null;
    },
    clearForgotPasswordMessage: (state) => { // New reducer
      state.forgotPasswordMessage = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
      })
      .addCase(loginUser.rejected, (state, action: any) => {
        state.loading = false;
        state.error = action.payload?.message || "Login failed"; // Extract the message
      })
      .addCase(signupUser.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.verificationMessage = null; // Clear previous message
      })
      .addCase(signupUser.fulfilled, (state, action) => {
        state.loading = false;
        state.verificationMessage = action.payload?.message || "Signup successful. Please check your email.";
        state.error = null; // Clear any previous signup errors
        state.user = null; // Prevent automatic login in state
      })
      .addCase(signupUser.rejected, (state, action: any) => {
        state.error = action.payload;
        state.loading = false;
        state.verificationMessage = null;
      })
      .addCase(forgotPassword.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.forgotPasswordMessage = null;
      })
      .addCase(forgotPassword.fulfilled, (state, action) => {
        state.loading = false;
        state.forgotPasswordMessage = action.payload?.message;
      })
      .addCase(forgotPassword.rejected, (state, action: any) => {
        state.loading = false;
        state.error = action.payload;
        state.forgotPasswordMessage = null;
      })
      .addCase(resetPassword.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(resetPassword.fulfilled, (state, action) => {
        state.loading = false;
        // You might want to set a success message state here
      })
      .addCase(resetPassword.rejected, (state, action: any) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { logout, loadUserFromStorage, clearVerificationMessage , clearAuthError,clearForgotPasswordMessage} = authSlice.actions;
export default authSlice.reducer;