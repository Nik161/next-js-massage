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
};

export type State = {
  errors: {
    type?: string[];
    duration?: string[];
    date?: string[];
  };
  message: string | null;
};
