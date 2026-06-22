import {
  createSlice,
  createAsyncThunk,
  isRejectedWithValue,
} from "@reduxjs/toolkit";

export const loginUser = createAsyncThunk(
  "auth/loginuser",
  async ({ user_name, password }, { rejectWithValue }) => {
    try {
      const res = await fetch("http://localhost:5030/api/login", {
        method: "POST",
        credentials: true,
        Headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ user_name, password }),
      });
      const data = await res.json();
      if (!res.ok) return rejectWithValue(data.message);

      return data;
    } catch (error) {
      return rejectWithValue("Network error");
    }
  },
);
/* ================= CHECK AUTH ================= */
export const checkAuth = createAsyncThunk(
  "auth/checkAuth",
  async (_, { rejectWithValue }) => {
    try {
      const res = await fetch("http://localhost:8075/api/check-auth", {
        credentials: "include",
      });

      const data = await res.json();

      if (!res.ok) return rejectWithValue("Not authenticated");

      return data.user;
    } catch {
      return rejectWithValue("Error");
    }
  },
);

/* ================= SLICE ================= */
const authSlice = createSlice({
  name: "auth",
  initialState: {
    user: null,
    isAuthenticated: false,
    loading: false,
    error: null,
  },
  reducers: {
    logoutSuccess: (state) => {
      state.user = null;
      state.isAuthenticated = false;
    },
  },
  extraReducers: (builder) => {
    builder
      /* LOGIN */
      .addCase(loginUser.fulfilled, (state, action) => {
        state.user = { role: action.payload.role };
        state.isAuthenticated = true;
      })

      /* CHECK AUTH */
      .addCase(checkAuth.fulfilled, (state, action) => {
        state.user = action.payload;
        state.isAuthenticated = true;
      })

      .addCase(checkAuth.rejected, (state) => {
        state.isAuthenticated = false;
      });
  },
});

export const { logoutSuccess } = authSlice.actions;
export default authSlice.reducer;
