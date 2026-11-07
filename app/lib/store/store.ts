import { combineSlices, configureStore } from "@reduxjs/toolkit";
import bookingFormSlice from "@/app/lib/store/booking_form_slice";
import { slotsApi } from "@/app/lib/store/slots_api";
import userSlice from "@/app/lib/store/user_slice";
import uiSlice from "@/app/lib/store/ui_slice";

const rootReducer = combineSlices(
  userSlice,
  uiSlice,
  bookingFormSlice,
  slotsApi,
);

// A new store per request on the server and per app load in the browser,
// so state is never shared between users.
export function makeStore(preloadedState?: Partial<RootState>) {
  return configureStore({
    reducer: rootReducer,
    preloadedState,
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware().concat(slotsApi.middleware),
  });
}

export type RootState = ReturnType<typeof rootReducer>;
export type AppStore = ReturnType<typeof makeStore>;
export type AppDispatch = AppStore["dispatch"];
