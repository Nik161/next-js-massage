import NotFoundBase from "@/app/ui/not_found/not-found-base";

export default function NotFound() {
  return (
    <>
      {" "}
      <NotFoundBase
        backText={"Вернуться на главную"}
        message={"Не смогли найти страницу"}
        url={"/"}
      />
    </>
  );
}
