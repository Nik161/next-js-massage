import { TIME_SLOTS } from "@/app/constants/time_slots";
import { MASSAGE_TYPES } from "@/app/constants/massage_types";
import { formatDate } from "@/app/helpers/formatDate";
import { MassageType } from "@/app/models/booking/massageType";

interface BookingFormProps {
  selectedMassage: MassageType;
  setSelectedMassage: (massage: MassageType) => void;
  selectedDate: string;
  setSelectedDate: (date: string) => void;
  selectedTime: string;
  setSelectedTime: (time: string) => void;
  handleSubmit: (e: FormData) => void;
}

const getAvailableDates = () => {
  const dates = [];
  for (let i = 0; i < 7; i++) {
    const date = new Date();
    date.setDate(date.getDate() + i);
    dates.push(date.toISOString().split("T")[0]);
  }
  return dates;
};
const availableDates = getAvailableDates();

export default function BookingForm({
  selectedMassage,
  setSelectedMassage,
  selectedDate,
  setSelectedDate,
  selectedTime,
  setSelectedTime,
  handleSubmit,
}: BookingFormProps) {
  return (
    <div className="lg:col-span-2">
      <div className="bg-[#122014] rounded-2xl border border-[#c9a84c]/10 p-6 md:p-8">
        <form action={handleSubmit} className="space-y-8">
          {/* Выбор типа массажа */}
          <div>
            <label className="block text-[0.7rem] tracking-[0.2em] uppercase text-[#c9a84c] mb-4 font-normal">
              Выберите тип массажа
            </label>
            <div className="grid sm:grid-cols-2 gap-3">
              {MASSAGE_TYPES.map((massage) => (
                <button
                  key={massage.id}
                  type="button"
                  onClick={() => setSelectedMassage(massage)}
                  className={`p-4 text-left rounded-xl border transition-all duration-300 ${
                    selectedMassage.id === massage.id
                      ? "border-[#c9a84c] bg-[#c9a84c]/5 shadow-lg"
                      : "border-[#f5ede0]/10 hover:border-[#c9a84c]/40 hover:bg-[#c9a84c]/5"
                  }`}
                >
                  <div className="font-['Cormorant_Garamond',serif] text-xl font-light text-[#f5ede0] mb-1">
                    {massage.name}
                  </div>
                  <div className="text-xs text-[#9eab9f] mb-2 leading-relaxed">
                    {massage.desc}
                  </div>
                  <div className="text-sm text-[#c9a84c]">
                    {massage.duration} мин • {massage.price.toLocaleString()} ₽
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Выбор даты */}
          <div>
            <label className="block text-[0.7rem] tracking-[0.2em] uppercase text-[#c9a84c] mb-4 font-normal">
              Выберите дату
            </label>
            <div className="grid grid-cols-4 sm:grid-cols-7 gap-2">
              {availableDates.map((date) => {
                const [weekday, day, month] = formatDate(date).split(" ");
                return (
                  <button
                    key={date}
                    type="button"
                    onClick={() => setSelectedDate(date)}
                    className={`py-3 px-2 text-center rounded-lg border transition-all duration-300 ${
                      selectedDate === date
                        ? "border-[#c9a84c] bg-[#c9a84c]/5 text-[#c9a84c]"
                        : "border-[#f5ede0]/10 hover:border-[#c9a84c]/40 text-[#f5ede0]/80 hover:text-[#f5ede0]"
                    }`}
                  >
                    <div className="text-[0.6rem] tracking-wide uppercase opacity-70">
                      {weekday?.replace(",", "")}
                    </div>
                    <div className="font-['Cormorant_Garamond',serif] text-xl font-light mt-1">
                      {day}
                    </div>
                    <div className="text-[0.55rem] uppercase opacity-50">
                      {month}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Выбор времени */}
          <div>
            <label className="block text-[0.7rem] tracking-[0.2em] uppercase text-[#c9a84c] mb-4 font-normal">
              Выберите время
            </label>
            <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
              {TIME_SLOTS.map((time) => (
                <button
                  key={time}
                  type="button"
                  onClick={() => setSelectedTime(time)}
                  className={`py-2.5 px-3 text-center rounded-lg border transition-all duration-300 text-sm ${
                    selectedTime === time
                      ? "border-[#c9a84c] bg-[#c9a84c]/5 text-[#c9a84c]"
                      : "border-[#f5ede0]/10 hover:border-[#c9a84c]/40 text-[#f5ede0]/80 hover:text-[#f5ede0]"
                  }`}
                >
                  {time}
                </button>
              ))}
            </div>
          </div>

          {/* Кнопка отправки */}
          <button
            type="submit"
            disabled={!selectedDate || !selectedTime}
            className={`w-full py-4 rounded-xl text-[0.78rem] tracking-[0.2em] uppercase font-medium transition-all duration-300 ${
              selectedDate && selectedTime
                ? "bg-[#b5633a] text-[#f5ede0] cursor-pointer hover:bg-[#c97050] hover:-translate-y-0.5 shadow-lg"
                : "bg-[#f5ede0]/10 text-[#f5ede0]/30 cursor-not-allowed"
            }`}
          >
            Подтвердить бронь
          </button>
        </form>
      </div>
    </div>
  );
}
