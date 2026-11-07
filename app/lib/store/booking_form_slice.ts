import {
  createAsyncThunk,
  createSlice,
  type PayloadAction,
} from "@reduxjs/toolkit";
import type { BookingFormState, BookingResponse } from "@/app/lib/definitions";
import type { BookingInput } from "@/app/lib/bookings";
import { getToday } from "@/app/lib/booking_time";
import {
  ApiRequestError,
  createBooking,
  updateBooking,
} from "@/app/lib/api_client";

export type BookingSelection = {
  therapistId: string;
  date: string;
  time: string;
  massageType: string;
  duration: number;
};

export type BookingWizardState = {
  step: number;
  // Decides which side the next step slides in from
  direction: "forward" | "back";
  selection: BookingSelection;
  // Errors from the last submit, shaped like the bookings API reports them
  submitResult: BookingFormState;
  isSubmitting: boolean;
};

const emptySelection: BookingSelection = {
  therapistId: "",
  date: "",
  time: "",
  massageType: "",
  duration: 0,
};

const initialState: BookingWizardState = {
  step: 1,
  direction: "forward",
  selection: emptySelection,
  submitResult: { message: null, errors: {} },
  isSubmitting: false,
};

const NETWORK_ERROR_MESSAGE =
  "Не удалось отправить запрос. Попробуйте ещё раз.";

function toBookingInput(selection: BookingSelection): BookingInput {
  return {
    therapist_id: selection.therapistId,
    date: selection.date,
    time: selection.time,
    massage_type: selection.massageType,
    duration: selection.duration,
  };
}

function toSubmitResult(error: unknown): BookingFormState {
  if (error instanceof ApiRequestError) {
    return {
      message: error.body.error,
      errors: error.body.fieldErrors ?? {},
    };
  }
  console.error("Failed to save booking:", error);
  return { message: NETWORK_ERROR_MESSAGE, errors: {} };
}

// Creates the booking, or updates it when bookingId is given.
export const submitBooking = createAsyncThunk<
  void,
  { bookingId?: string },
  {
    state: { bookingForm: BookingWizardState };
    rejectValue: BookingFormState;
  }
>(
  "bookingForm/submit",
  async ({ bookingId }, { getState, rejectWithValue }) => {
    const input = toBookingInput(getState().bookingForm.selection);
    try {
      if (bookingId) await updateBooking(bookingId, input);
      else await createBooking(input);
    } catch (error) {
      return rejectWithValue(toSubmitResult(error));
    }
  },
);

export function getInitialSelection(
  booking?: BookingResponse,
  initialTherapistId = "",
): BookingSelection {
  if (!booking) {
    return {
      ...emptySelection,
      therapistId: initialTherapistId,
      date: getToday(),
    };
  }

  const [date, time] = booking.date.split(" ");
  return {
    therapistId: booking.therapist_id,
    date,
    time,
    massageType: booking.massage_type,
    duration: booking.duration,
  };
}

const bookingFormSlice = createSlice({
  name: "bookingForm",
  initialState,
  reducers: {
    // The store outlives pages, so every form mount starts over from here.
    bookingFormStarted: (_state, action: PayloadAction<BookingSelection>) => ({
      ...initialState,
      selection: action.payload,
    }),
    stepChanged: (state, action: PayloadAction<number>) => {
      state.direction = action.payload > state.step ? "forward" : "back";
      state.step = action.payload;
    },
    // Free slots depend on the therapist, so the chosen time is reset.
    therapistSelected: (state, action: PayloadAction<string>) => {
      state.selection.therapistId = action.payload;
      state.selection.time = "";
    },
    massageTypeSelected: (state, action: PayloadAction<string>) => {
      state.selection.massageType = action.payload;
    },
    // A longer session may not fit into the chosen time.
    durationSelected: (state, action: PayloadAction<number>) => {
      state.selection.duration = action.payload;
      state.selection.time = "";
    },
    dateSelected: (state, action: PayloadAction<string>) => {
      state.selection.date = action.payload;
      state.selection.time = "";
    },
    timeSelected: (state, action: PayloadAction<string>) => {
      state.selection.time = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(submitBooking.pending, (state) => {
        state.isSubmitting = true;
      })
      .addCase(submitBooking.fulfilled, (state) => {
        state.isSubmitting = false;
        state.submitResult = initialState.submitResult;
      })
      .addCase(submitBooking.rejected, (state, action) => {
        state.isSubmitting = false;
        state.submitResult = action.payload ?? toSubmitResult(action.error);
      });
  },
  selectors: {
    selectSubmitResult: (state) => state.submitResult,
    selectIsSubmitting: (state) => state.isSubmitting,
    selectStep: (state) => state.step,
    selectDirection: (state) => state.direction,
    selectSelection: (state) => state.selection,
    selectCanSubmit: ({ selection }) =>
      Boolean(
        selection.therapistId &&
        selection.date &&
        selection.time &&
        selection.massageType &&
        selection.duration,
      ),
  },
});

export const {
  bookingFormStarted,
  stepChanged,
  therapistSelected,
  massageTypeSelected,
  durationSelected,
  dateSelected,
  timeSelected,
} = bookingFormSlice.actions;

export const {
  selectStep,
  selectDirection,
  selectSelection,
  selectCanSubmit,
  selectSubmitResult,
  selectIsSubmitting,
} = bookingFormSlice.selectors;

export default bookingFormSlice;
