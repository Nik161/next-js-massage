import {
  createAsyncThunk,
  createSlice,
  type PayloadAction,
} from "@reduxjs/toolkit";
import { signIn } from "next-auth/react";
import type { User } from "@/app/lib/definitions";

// What the browser may know about the signed-in user
export type SessionUser = Omit<User, "password">;

export type UserState = {
  current: SessionUser | null;
  // Message from the last failed login attempt
  loginError: string | null;
  isLoggingIn: boolean;
};

const initialState: UserState = {
  current: null,
  loginError: null,
  isLoggingIn: false,
};

// Goes through NextAuth's own credentials endpoint, which sets the session
// cookie. Resolves with the URL to continue to; the user itself arrives with
// the next server render (see UserHydrator).
export const logIn = createAsyncThunk<
  string,
  { email: string; password: string; callbackUrl: string },
  { rejectValue: string }
>(
  "user/logIn",
  async ({ email, password, callbackUrl }, { rejectWithValue }) => {
    try {
      const result = await signIn("credentials", {
        email,
        password,
        redirectTo: callbackUrl,
        redirect: false,
      });
      if (result?.error === "CredentialsSignin") {
        return rejectWithValue("Invalid credentials.");
      }
      // On success NextAuth returns the callback URL, checked to be on our origin.
      if (result?.url) return result.url;
    } catch (error) {
      console.error("Sign-in failed:", error);
    }
    return rejectWithValue("Something went wrong.");
  },
);

function isSameUser(a: SessionUser | null, b: SessionUser | null) {
  if (a === null || b === null) return a === b;
  return (
    a.id === b.id &&
    a.name === b.name &&
    a.email === b.email &&
    a.role === b.role &&
    a.balance === b.balance
  );
}

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    // Sent with every server render; unchanged data leaves the state as is,
    // so subscribers don't re-render.
    userLoaded: (state, action: PayloadAction<SessionUser | null>) => {
      if (!isSameUser(state.current, action.payload)) {
        state.current = action.payload;
      }
    },
    userSignedOut: (state) => {
      state.current = null;
    },
    // A fresh login form doesn't show the error from an earlier visit.
    loginFormOpened: (state) => {
      state.loginError = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(logIn.pending, (state) => {
        state.isLoggingIn = true;
        state.loginError = null;
      })
      .addCase(logIn.fulfilled, (state) => {
        state.isLoggingIn = false;
      })
      .addCase(logIn.rejected, (state, action) => {
        state.isLoggingIn = false;
        state.loginError = action.payload ?? "Something went wrong.";
      });
  },
  selectors: {
    selectCurrentUser: (state) => state.current,
    selectIsLoggedIn: (state) => state.current !== null,
    selectUserName: (state) =>
      state.current ? state.current.name || state.current.email : "",
    selectBalance: (state) => state.current?.balance,
    selectLoginError: (state) => state.loginError,
    selectIsLoggingIn: (state) => state.isLoggingIn,
  },
});

export const { userLoaded, userSignedOut, loginFormOpened } = userSlice.actions;

export const {
  selectCurrentUser,
  selectIsLoggedIn,
  selectUserName,
  selectBalance,
  selectLoginError,
  selectIsLoggingIn,
} = userSlice.selectors;

export default userSlice;
