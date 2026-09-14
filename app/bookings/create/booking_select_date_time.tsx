import clsx from "clsx";

export default function BookingSelectDateAndTime({
  setStep,
  selectedDate,
  today,
  setSelectedDate,
  setSelectedTime,
  canGoToProgram,
  availableSlots,
  selectedTime,
  maxDate,
}: {
  setStep: (step: number) => void;
  selectedDate: string;
  today: string;
  maxDate: string;
  setSelectedDate: (date: string) => void;
  setSelectedTime: (time: string) => void;
  canGoToProgram: boolean;
  availableSlots: string[];
  selectedTime: string;
}) {
  return (
    <section>
      <h2 className="text-2xl font-medium text-gray-900">
        Выберите дату и время
      </h2>

      <p className="mt-2 text-lg text-gray-500">
        Выберите удобный день и свободный слот.
      </p>

      {/* Date */}

      <div className="mt-6">
        <label
          htmlFor="booking_date"
          className="mb-2 block text-lg font-medium text-gray-900"
        >
          Дата
        </label>

        <div className="relative">
          <input
            id="booking_date"
            name="booking_date"
            type="date"
            value={selectedDate}
            min={today}
            max={maxDate}
            onChange={(event) => {
              setSelectedDate(event.target.value);
              setSelectedTime("");
            }}
            className="block w-full appearance-none rounded-xl border border-gray-200 bg-white px-4 py-3 text-gray-900 outline-none transition focus:border-gray-900 focus:ring-1 focus:ring-gray-900"
          />
        </div>
      </div>

      {/* Time */}

      <div className="mt-6">
        <p className="mb-3 text-lg font-medium text-gray-900">Время</p>

        {availableSlots.length === 0 ? (
          <p className="rounded-xl bg-gray-50 p-4 text-lg text-gray-500">
            На выбранную дату свободных слотов нет.
          </p>
        ) : (
          <div className="grid grid-cols-3 gap-2 sm:grid-cols-4">
            {availableSlots.map((slot) => {
              const isSelected = selectedTime === slot;

              return (
                <button
                  key={slot}
                  type="button"
                  onClick={() => setSelectedTime(slot)}
                  className={clsx(
                    "rounded-xl border px-3 py-3 text-lg font-medium transition-all",
                    isSelected
                      ? "border-gray-900 bg-gray-900 text-white"
                      : "border-gray-200 bg-white text-gray-900 hover:border-gray-400",
                  )}
                >
                  {slot}
                </button>
              );
            })}
          </div>
        )}
      </div>

      <div className="mt-8 flex justify-between">
        <button
          type="button"
          onClick={() => setStep(1)}
          className="rounded-xl bg-gray-100 px-5 py-3 font-medium text-gray-700 transition hover:bg-gray-200"
        >
          Назад
        </button>

        <button
          type="button"
          disabled={!canGoToProgram}
          onClick={() => setStep(3)}
          className="rounded-xl bg-gray-900 px-6 py-3 font-medium text-white transition hover:bg-gray-800 disabled:cursor-not-allowed disabled:opacity-40"
        >
          Далее
        </button>
      </div>
    </section>
  );
}
