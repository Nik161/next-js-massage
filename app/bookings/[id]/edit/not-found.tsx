import NotFoundBase from "@/app/ui/not_found/not-found-base";

export default function NotFound() {
  return (
    <NotFoundBase
      backText="Вернуться к бронированиям"
      message="Бронирование не найдено"
      url="/bookings"
    />
  );
}
