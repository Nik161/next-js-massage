import { getMaxBookingDate, getToday } from "@/app/lib/booking_time";
import { Button } from "@/app/ui/shared/button";
import SelectableButton from "@/app/ui/booking/selectable_button";
import { BackButton } from "@/app/ui/booking/step_navigation";

function SlotsMessage({ children }: { children: React.ReactNode }) {
  return (
    <p className="rounded-xl bg-gray-50 p-4 text-lg text-gray-500">
      {children}
    </p>
  );
}

export default function BookingSelectDateAndTime({
  selectedDate,
  selectedTime,
  slots,
  isLoading,
  isError,
  onDateChange,
  onTimeChange,
  onBack,
  canSubmit,
  submitText,
}: {
  selectedDate: string;
  selectedTime: string;
  slots: string[];
  isLoading: boolean;
  isError: boolean;
  onDateChange: (date: string) => void;
  onTimeChange: (time: string) => void;
  onBack: () => void;
  canSubmit: boolean;
  submitText: string;
}) {
  return (
    <section>
      <h2 className="text-2xl font-medium text-gray-900">
        Выберите дату и время
      </h2>

      <p className="mt-2 text-lg text-gray-500">
        Выберите удобный день и свободный слот.
      </p>

      <div className="mt-6">
        <label
          htmlFor="booking_date_picker"
          className="mb-2 block text-lg font-medium text-gray-900"
        >
          Дата
        </label>

        <input
          id="booking_date_picker"
          type="date"
          value={selectedDate}
          min={getToday()}
          max={getMaxBookingDate()}
          onChange={(event) => onDateChange(event.target.value)}
          className="block w-full appearance-none rounded-xl border border-gray-200 bg-white px-4 py-3 text-gray-900 outline-none transition focus:border-gray-900 focus:ring-1 focus:ring-gray-900"
        />
      </div>

      <div className="mt-6">
        <p className="mb-3 text-lg font-medium text-gray-900">Время</p>

        {isLoading ? (
          <SlotsMessage>Загружаем свободное время…</SlotsMessage>
        ) : isError ? (
          <SlotsMessage>
            Не удалось загрузить свободное время. Попробуйте позже.
          </SlotsMessage>
        ) : slots.length === 0 ? (
          <SlotsMessage>На выбранную дату свободных слотов нет.</SlotsMessage>
        ) : (
          <div className="grid grid-cols-3 gap-2 sm:grid-cols-4">
            {slots.map((slot) => (
              <SelectableButton
                key={slot}
                selected={selectedTime === slot}
                onClick={() => onTimeChange(slot)}
                className="px-3 py-3 text-lg font-medium"
              >
                {slot}
              </SelectableButton>
            ))}
          </div>
        )}
      </div>

      <div className="mt-8 flex justify-between">
        <BackButton onClick={onBack} />
        <Button type="submit" disabled={!canSubmit}>
          {submitText}
        </Button>
      </div>
    </section>
  );
}
