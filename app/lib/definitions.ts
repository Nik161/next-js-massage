export type BookingResponse = {
  id: string;
  date: string;
  massage_type: "thai" | "balinese" | "relax" | "sport";
  duration: number;
  status: "booked" | "confirmed" | "canceled" | "completed";
  is_social: boolean;
  user_id: string;
  user_name: string;
  image_url: string;
  therapist_id: string;
  therapist_name: string;
};

export type State = {
  errors: {
    type?: string[];
    duration?: string[];
    date?: string[];
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
