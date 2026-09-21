export default function BookingProgress({
  step,
  setStep,
  name,
}: {
  step: number;
  setStep: (step: number) => void;
  name: string;
}) {
  return (
    <>
      <div className="mb-8 flex">
        <span className="text-2xl text-gray-500">Вы записываетесь как</span>
        <h1 className="ml-2 text-2xl font-medium text-gray-900">{name}</h1>
      </div>
      <div className="mb-8">
        <div className="flex items-center justify-between text-lg">
          {step > 1 ? (
            <button onClick={() => setStep(1)} className="cursor-pointer">
              Массажист
            </button>
          ) : (
            <span
              className={
                step >= 1 ? "font-medium text-gray-900" : "text-gray-400"
              }
            >
              Массажист
            </span>
          )}

          {step > 2 ? (
            <button
              title="Вернуться к выбору даты и времени"
              className="cursor-pointer"
              onClick={() => setStep(2)}
            >
              Дата / Время
            </button>
          ) : (
            <span
              className={
                step >= 2 ? "font-medium text-gray-900" : "text-gray-400"
              }
            >
              Дата / Время
            </span>
          )}
          <span
            className={
              step >= 3 ? "font-medium text-gray-900" : "text-gray-400"
            }
          >
            Программа
          </span>
        </div>

        <div className="mt-3 h-1 overflow-hidden rounded-full bg-gray-100">
          <div
            className="h-full rounded-full bg-gray-900 transition-all duration-300"
            style={{
              width: `${(step / 3) * 100}%`,
            }}
          />
        </div>
      </div>
    </>
  );
}
