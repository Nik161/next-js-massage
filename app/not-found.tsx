import NotFoundBase from "@/app/ui/not_found/not-found-base";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-sand">
      <NotFoundBase
        backText={"Вернуться на главную"}
        message={"Не смогли найти страницу"}
        url={"/"}
      />
    </div>
  );
}
