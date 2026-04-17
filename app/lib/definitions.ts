export type BookingsResponse = {
  id: string;
  date: string;
  massage_type: string;
  duration: number;
  status: "booked" | "confirmed" | "canceled";
  is_social: boolean;
  user_id: string;
  user_name: string;
  image_url: string;
};
