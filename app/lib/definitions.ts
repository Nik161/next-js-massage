export type BookingStatus = "booked" | "confirmed" | "canceled" | "completed";

// Statuses an admin can set manually from the bookings table.
export type ManualBookingStatus = Extract<
  BookingStatus,
  "confirmed" | "completed"
>;

export type BookingResponse = {
  id: string;
  // Formatted as "YYYY-MM-DD HH:MI"
  date: string;
  massage_type: string;
  duration: number;
  status: BookingStatus;
  is_social: boolean;
  user_id: string;
  user_name: string;
  email: string;
  image_url: string | null;
  therapist_id: string;
  therapist_name: string;
};

export type BookingFormState = {
  errors: {
    massage_type?: string[];
    duration?: string[];
    date?: string[];
    time?: string[];
    therapist_id?: string[];
  };
  message: string | null;
};

export type User = {
  id: string;
  name: string;
  email: string;
  password: string;
  role: "user" | "admin";
};

export type Therapist = {
  id: string;
  name: string;
  description: string | null;
  image_url: string | null;
};

export type MassageType = {
  id: string;
  name: string;
  description: string;
};
