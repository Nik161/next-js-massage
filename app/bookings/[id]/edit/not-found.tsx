import NotFoundBase from "@/app/ui/not_found/not-found-base";

export default function NotFound() {
  return (
    <>
      <NotFoundBase backText="text" message="not found" url="/bookings" />;
    </>
  );
}
