"use client";

import { useState } from "react";

const MASSAGE_TYPES = [
  {
    id: "balinese",
    name: "Балийский массаж",
    desc: "Глубокое расслабление по традициям острова Бали",
    durations: [60, 90, 120],
  },
  {
    id: "thai",
    name: "Тайский массаж",
    desc: "Энергетические линии тела и точечное воздействие",
    durations: [60, 90, 120],
  },
  {
    id: "relax",
    name: "Релакс массаж",
    desc: "Мягкие техники для полного снятия стресса",
    durations: [45, 60, 90],
  },
  {
    id: "stretching",
    name: "Тайский стретчинг",
    desc: "Пассивная растяжка для гибкости и лёгкости",
    durations: [60, 90],
  },
  {
    id: "sport",
    name: "Спортивный массаж",
    desc: "Восстановление мышц и работа с триггерными точками",
    durations: [60, 90, 120],
  },
];

const TIME_SLOTS = [
  "10:00",
  "11:00",
  "12:00",
  "13:00",
  "14:00",
  "15:00",
  "16:00",
  "17:00",
  "18:00",
  "19:00",
  "20:00",
];

type Booking = {
  id: number;
  date: string;
  time: string;
  massage: string;
  duration: number;
  status: "upcoming" | "completed" | "cancelled";
};

const MOCK_BOOKINGS: Booking[] = [
  {
    id: 1,
    date: "2026-04-20",
    time: "14:00",
    massage: "Балийский массаж",
    duration: 90,
    status: "upcoming",
  },
  {
    id: 2,
    date: "2026-04-18",
    time: "11:00",
    massage: "Релакс массаж",
    duration: 60,
    status: "upcoming",
  },
  {
    id: 3,
    date: "2026-03-30",
    time: "16:00",
    massage: "Тайский массаж",
    duration: 120,
    status: "completed",
  },
  {
    id: 4,
    date: "2026-03-10",
    time: "12:00",
    massage: "Спортивный массаж",
    duration: 60,
    status: "completed",
  },
  {
    id: 5,
    date: "2026-02-14",
    time: "18:00",
    massage: "Тайский стретчинг",
    duration: 90,
    status: "cancelled",
  },
];

function getTodayString() {
  return new Date().toISOString().split("T")[0];
}

function formatDate(dateStr: string) {
  const d = new Date(dateStr + "T00:00:00");
  return d.toLocaleDateString("ru-RU", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

const STATUS_CONFIG: Record<
  Booking["status"],
  { label: string; dot: string; text: string }
> = {
  upcoming: { label: "Предстоит", dot: "bg-[#c9a84c]", text: "text-[#c9a84c]" },
  completed: {
    label: "Завершён",
    dot: "bg-[#f5ede0]/30",
    text: "text-[#f5ede0]/40",
  },
  cancelled: { label: "Отменён", dot: "bg-[#b5633a]", text: "text-[#b5633a]" },
};

const STEPS = ["Услуга", "Дата и время", "Контакты"];

export default function BookingPage() {
  const [step, setStep] = useState(0);
  const [selectedMassage, setSelectedMassage] = useState(MASSAGE_TYPES[0].id);
  const [selectedDuration, setSelectedDuration] = useState(60);
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedTime, setSelectedTime] = useState("");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [comment, setComment] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [bookings, setBookings] = useState<Booking[]>(MOCK_BOOKINGS);
  const [activeTab, setActiveTab] = useState<"upcoming" | "all">("upcoming");

  const currentMassage = MASSAGE_TYPES.find((m) => m.id === selectedMassage)!;

  const handleMassageChange = (id: string) => {
    setSelectedMassage(id);
    const m = MASSAGE_TYPES.find((x) => x.id === id)!;
    if (!m.durations.includes(selectedDuration))
      setSelectedDuration(m.durations[0]);
  };

  const canNext = [true, !!(selectedDate && selectedTime), !!(name && phone)];

  const handleSubmit = () => {
    const newBooking: Booking = {
      id: Date.now(),
      date: selectedDate,
      time: selectedTime,
      massage: currentMassage.name,
      duration: selectedDuration,
      status: "upcoming",
    };
    setBookings([newBooking, ...bookings]);
    setSubmitted(true);
  };

  const handleReset = () => {
    setSubmitted(false);
    setStep(0);
    setSelectedDate("");
    setSelectedTime("");
    setName("");
    setPhone("");
    setComment("");
    setSelectedMassage(MASSAGE_TYPES[0].id);
    setSelectedDuration(60);
  };

  const displayedBookings =
    activeTab === "upcoming"
      ? bookings.filter((b) => b.status === "upcoming")
      : bookings;

  return (
    <div className="bg-[#f5ede0] text-[#2a1f14] min-h-screen font-['Jost',sans-serif]">
      {/* Hero */}
      <section className="relative h-[42vh] min-h-[280px] flex items-end pb-16 justify-center overflow-hidden">
        <div className="absolute inset-0 bg-[url('/images/massage_back.jpeg')] bg-cover bg-center" />
        <div className="absolute inset-0 bg-[#1a2e1e]/65" />
        <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-[#f5ede0] to-transparent" />
        <div className="relative z-10 text-center text-[#f5ede0] px-6">
          <div className="text-[0.65rem] tracking-[0.4em] uppercase text-[#c9a84c] mb-4 flex items-center justify-center gap-3">
            <span className="block w-8 h-px bg-[#c9a84c] opacity-70" />
            Онлайн запись
            <span className="block w-8 h-px bg-[#c9a84c] opacity-70" />
          </div>
          <h1 className="font-['Cormorant_Garamond',serif] text-[clamp(2.4rem,6vw,5rem)] font-light leading-[1.05] tracking-[-0.01em]">
            Забронировать <em className="italic text-[#c9a84c]">сеанс</em>
          </h1>
        </div>
      </section>

      <div className="max-w-[1080px] mx-auto px-[5vw] pt-4 pb-20">
        {/* FORM BLOCK */}
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_310px] gap-px mb-20 bg-[#142316]">
          {/* Form */}
          <div className="bg-[#1a2e1b] text-[#f5ede0]">
            {submitted ? (
              <div className="flex flex-col items-center justify-center text-center px-10 py-20 min-h-[520px]">
                <div className="w-14 h-14 border border-[#c9a84c]/40 flex items-center justify-center mb-8">
                  <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                    <path
                      d="M3 10.5L8 15.5L17 5"
                      stroke="#c9a84c"
                      strokeWidth="1.3"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </div>
                <div className="text-[0.62rem] tracking-[0.38em] uppercase text-[#c9a84c] mb-5">
                  Запись подтверждена
                </div>
                <h2 className="font-['Cormorant_Garamond',serif] text-[2.2rem] font-light mb-2">
                  {currentMassage.name}
                </h2>
                <p className="text-[#f5ede0]/40 text-[0.85rem] font-light mb-1">
                  {selectedDuration} минут
                </p>
                <p className="text-[#f5ede0]/40 text-[0.85rem] font-light mb-10">
                  {formatDate(selectedDate)} · {selectedTime}
                </p>
                <div className="w-10 h-px bg-[#c9a84c]/25 mb-10" />
                <button
                  onClick={handleReset}
                  className="text-[0.7rem] tracking-[0.25em] uppercase font-medium px-9 py-3.5 border border-[#c9a84c]/40 text-[#c9a84c] bg-transparent cursor-pointer transition-all duration-300 hover:bg-[#c9a84c]/8"
                >
                  Новая запись
                </button>
              </div>
            ) : (
              <>
                {/* Step tabs */}
                <div className="flex border-b border-[#f5ede0]/6">
                  {STEPS.map((s, i) => (
                    <button
                      key={s}
                      onClick={() => {
                        if (i < step) setStep(i);
                      }}
                      className={`flex-1 py-5 relative transition-colors duration-200 ${
                        i === step
                          ? "cursor-default"
                          : i < step
                            ? "cursor-pointer"
                            : "cursor-default"
                      }`}
                    >
                      <span
                        className={`flex items-center justify-center gap-2 text-[0.62rem] tracking-[0.22em] uppercase transition-colors ${
                          i === step
                            ? "text-[#c9a84c]"
                            : i < step
                              ? "text-[#f5ede0]/40 hover:text-[#f5ede0]/60"
                              : "text-[#f5ede0]/18"
                        }`}
                      >
                        <span
                          className={`w-[18px] h-[18px] border flex items-center justify-center flex-shrink-0 transition-all text-[0.55rem] ${
                            i < step
                              ? "border-[#c9a84c]/40 text-[#c9a84c]"
                              : i === step
                                ? "border-[#c9a84c] text-[#c9a84c]"
                                : "border-[#f5ede0]/12 text-[#f5ede0]/18"
                          }`}
                        >
                          {i < step ? (
                            <svg
                              width="8"
                              height="8"
                              viewBox="0 0 8 8"
                              fill="none"
                            >
                              <path
                                d="M1 4.5L3 6.5L7 2"
                                stroke="currentColor"
                                strokeWidth="1.2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                              />
                            </svg>
                          ) : (
                            i + 1
                          )}
                        </span>
                        <span className="hidden sm:inline">{s}</span>
                      </span>
                      {i === step && (
                        <span className="absolute bottom-0 left-0 right-0 h-px bg-[#c9a84c]" />
                      )}
                    </button>
                  ))}
                </div>

                {/* Step 0 */}
                {step === 0 && (
                  <div className="p-8 md:p-10">
                    <div className="mb-8">
                      <div className="text-[0.6rem] tracking-[0.3em] uppercase text-[#c9a84c]/60 mb-4">
                        Вид массажа
                      </div>
                      <div className="flex flex-col gap-2">
                        {MASSAGE_TYPES.map((m) => (
                          <button
                            key={m.id}
                            onClick={() => handleMassageChange(m.id)}
                            className={`text-left px-5 py-4 border transition-all duration-200 ${
                              selectedMassage === m.id
                                ? "border-[#c9a84c]/40 bg-[#c9a84c]/5"
                                : "border-[#f5ede0]/7 hover:border-[#f5ede0]/18"
                            }`}
                          >
                            <div className="flex items-center justify-between gap-4">
                              <div>
                                <div
                                  className={`text-[0.9rem] font-light mb-0.5 transition-colors ${selectedMassage === m.id ? "text-[#c9a84c]" : "text-[#f5ede0]"}`}
                                >
                                  {m.name}
                                </div>
                                <div className="text-[#f5ede0]/30 text-[0.74rem] font-light">
                                  {m.desc}
                                </div>
                              </div>
                              <div
                                className={`w-4 h-4 border flex-shrink-0 flex items-center justify-center transition-all ${
                                  selectedMassage === m.id
                                    ? "border-[#c9a84c]"
                                    : "border-[#f5ede0]/15"
                                }`}
                              >
                                {selectedMassage === m.id && (
                                  <div className="w-1.5 h-1.5 bg-[#c9a84c]" />
                                )}
                              </div>
                            </div>
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="mb-10">
                      <div className="text-[0.6rem] tracking-[0.3em] uppercase text-[#c9a84c]/60 mb-4">
                        Продолжительность
                      </div>
                      <div className="flex gap-2.5">
                        {currentMassage.durations.map((d) => (
                          <button
                            key={d}
                            onClick={() => setSelectedDuration(d)}
                            className={`px-6 py-3 border text-[0.8rem] font-light transition-all duration-200 ${
                              selectedDuration === d
                                ? "border-[#c9a84c]/50 text-[#c9a84c] bg-[#c9a84c]/6"
                                : "border-[#f5ede0]/12 text-[#f5ede0]/45 hover:border-[#f5ede0]/25 hover:text-[#f5ede0]/65"
                            }`}
                          >
                            {d} мин
                          </button>
                        ))}
                      </div>
                    </div>

                    <button
                      onClick={() => setStep(1)}
                      className="w-full py-4 text-[0.73rem] tracking-[0.26em] uppercase font-medium bg-[#b5633a] text-[#f5ede0] border-none cursor-pointer transition-all duration-300 hover:bg-[#c97050]"
                    >
                      Далее — выбрать дату
                    </button>
                  </div>
                )}

                {/* Step 1 */}
                {step === 1 && (
                  <div className="p-8 md:p-10">
                    <div className="mb-8">
                      <div className="text-[0.6rem] tracking-[0.3em] uppercase text-[#c9a84c]/60 mb-4">
                        Дата
                      </div>
                      <input
                        type="date"
                        min={getTodayString()}
                        value={selectedDate}
                        onChange={(e) => {
                          setSelectedDate(e.target.value);
                          setSelectedTime("");
                        }}
                        className="bg-transparent border border-[#f5ede0]/12 px-5 py-3.5 text-[0.88rem] text-[#f5ede0] font-light outline-none focus:border-[#c9a84c]/40 transition-colors duration-200 w-full sm:w-auto [color-scheme:dark]"
                      />
                    </div>

                    {selectedDate && (
                      <div className="mb-10">
                        <div className="text-[0.6rem] tracking-[0.3em] uppercase text-[#c9a84c]/60 mb-4">
                          Время
                          <span className="text-[#f5ede0]/20 normal-case tracking-normal ml-3 font-light">
                            {formatDate(selectedDate)}
                          </span>
                        </div>
                        <div className="grid grid-cols-4 sm:grid-cols-6 gap-2">
                          {TIME_SLOTS.map((t) => (
                            <button
                              key={t}
                              onClick={() => setSelectedTime(t)}
                              className={`py-3 border text-[0.78rem] font-light transition-all duration-200 ${
                                selectedTime === t
                                  ? "border-[#c9a84c]/50 text-[#c9a84c] bg-[#c9a84c]/6"
                                  : "border-[#f5ede0]/10 text-[#f5ede0]/40 hover:border-[#f5ede0]/22 hover:text-[#f5ede0]/65"
                              }`}
                            >
                              {t}
                            </button>
                          ))}
                        </div>
                      </div>
                    )}

                    <div className="flex gap-3">
                      <button
                        onClick={() => setStep(0)}
                        className="px-7 py-4 text-[0.7rem] tracking-[0.2em] uppercase font-medium border border-[#f5ede0]/12 text-[#f5ede0]/40 bg-transparent cursor-pointer transition-all duration-200 hover:border-[#f5ede0]/25 hover:text-[#f5ede0]/65 flex-shrink-0"
                      >
                        Назад
                      </button>
                      <button
                        onClick={() => setStep(2)}
                        disabled={!canNext[1]}
                        className="flex-1 py-4 text-[0.73rem] tracking-[0.26em] uppercase font-medium bg-[#b5633a] text-[#f5ede0] border-none cursor-pointer transition-all duration-300 hover:bg-[#c97050] disabled:opacity-20 disabled:cursor-not-allowed"
                      >
                        Далее — контакты
                      </button>
                    </div>
                  </div>
                )}

                {/* Step 2 */}
                {step === 2 && (
                  <div className="p-8 md:p-10">
                    <div className="mb-8">
                      <div className="text-[0.6rem] tracking-[0.3em] uppercase text-[#c9a84c]/60 mb-4">
                        Ваши данные
                      </div>
                      <div className="flex flex-col gap-2.5">
                        {[
                          {
                            label: "Имя",
                            value: name,
                            setter: setName,
                            type: "text",
                          },
                          {
                            label: "Телефон",
                            value: phone,
                            setter: setPhone,
                            type: "tel",
                          },
                        ].map(({ label, value, setter, type }) => (
                          <div key={label} className="relative group">
                            <label className="absolute top-3.5 left-5 text-[0.58rem] tracking-[0.22em] uppercase text-[#f5ede0]/25 pointer-events-none transition-colors group-focus-within:text-[#c9a84c]/50">
                              {label}
                            </label>
                            <input
                              type={type}
                              value={value}
                              onChange={(e) => setter(e.target.value)}
                              className="w-full bg-transparent border border-[#f5ede0]/10 pt-8 pb-3.5 px-5 text-[0.9rem] text-[#f5ede0] font-light outline-none focus:border-[#c9a84c]/35 transition-colors duration-200"
                            />
                          </div>
                        ))}
                        <div className="relative group">
                          <label className="absolute top-3.5 left-5 text-[0.58rem] tracking-[0.22em] uppercase text-[#f5ede0]/25 pointer-events-none transition-colors group-focus-within:text-[#c9a84c]/50">
                            Комментарий (необязательно)
                          </label>
                          <textarea
                            value={comment}
                            onChange={(e) => setComment(e.target.value)}
                            rows={3}
                            className="w-full bg-transparent border border-[#f5ede0]/10 pt-8 pb-3.5 px-5 text-[0.9rem] text-[#f5ede0] font-light outline-none focus:border-[#c9a84c]/35 transition-colors duration-200 resize-none"
                          />
                        </div>
                      </div>
                    </div>

                    <div className="flex gap-3">
                      <button
                        onClick={() => setStep(1)}
                        className="px-7 py-4 text-[0.7rem] tracking-[0.2em] uppercase font-medium border border-[#f5ede0]/12 text-[#f5ede0]/40 bg-transparent cursor-pointer transition-all duration-200 hover:border-[#f5ede0]/25 hover:text-[#f5ede0]/65 flex-shrink-0"
                      >
                        Назад
                      </button>
                      <button
                        onClick={handleSubmit}
                        disabled={!canNext[2]}
                        className="flex-1 py-4 text-[0.73rem] tracking-[0.26em] uppercase font-medium bg-[#b5633a] text-[#f5ede0] border-none cursor-pointer transition-all duration-300 hover:bg-[#c97050] disabled:opacity-20 disabled:cursor-not-allowed"
                      >
                        Подтвердить запись
                      </button>
                    </div>
                  </div>
                )}
              </>
            )}
          </div>

          {/* Sidebar */}
          <div className="flex flex-col gap-px">
            <div className="bg-[#142316] text-[#f5ede0] px-7 py-8 flex-1">
              <div className="text-[0.58rem] tracking-[0.32em] uppercase text-[#c9a84c]/60 mb-5">
                Ваш выбор
              </div>

              <div className="font-['Cormorant_Garamond',serif] text-[1.6rem] font-light leading-[1.2] mb-1 text-[#f5ede0]">
                {currentMassage.name}
              </div>
              <div className="text-[#f5ede0]/30 text-[0.75rem] font-light leading-[1.7] mb-7">
                {currentMassage.desc}
              </div>

              <div className="w-full h-px bg-[#f5ede0]/6 mb-7" />

              <div className="flex flex-col gap-5">
                {[
                  {
                    label: "Продолжительность",
                    value: `${selectedDuration} мин`,
                  },
                  {
                    label: "Дата",
                    value: selectedDate ? formatDate(selectedDate) : null,
                  },
                  { label: "Время", value: selectedTime || null },
                  { label: "Имя", value: name || null },
                ].map(({ label, value }) => (
                  <div key={label}>
                    <div className="text-[0.57rem] tracking-[0.22em] uppercase text-[#f5ede0]/20 mb-1">
                      {label}
                    </div>
                    <div
                      className={`text-[0.85rem] font-light transition-colors ${value ? "text-[#f5ede0]/65" : "text-[#f5ede0]/15"}`}
                    >
                      {value ?? "—"}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-[#142316] px-7 py-5 border-t border-[#f5ede0]/5">
              <div className="flex flex-col gap-3">
                {[
                  "Бесплатная отмена за 24 часа",
                  "Мастер свяжется для подтверждения",
                  "Только сертифицированные специалисты",
                ].map((t) => (
                  <div key={t} className="flex items-start gap-2.5">
                    <span className="text-[#c9a84c]/40 text-[0.55rem] mt-1 flex-shrink-0">
                      ✦
                    </span>
                    <span className="text-[#f5ede0]/25 text-[0.73rem] font-light leading-[1.6]">
                      {t}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* BOOKINGS */}
        <div>
          <div className="flex items-end justify-between mb-2 gap-4 flex-wrap">
            <h2 className="font-['Cormorant_Garamond',serif] text-[2rem] font-light text-[#2a1f14] leading-[1]">
              История записей
            </h2>
            <div className="flex gap-5 mb-1">
              {(["upcoming", "all"] as const).map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`text-[0.65rem] tracking-[0.22em] uppercase pb-1 border-b transition-all duration-200 ${
                    activeTab === tab
                      ? "border-[#b5633a] text-[#b5633a]"
                      : "border-transparent text-[#2a1f14]/30 hover:text-[#2a1f14]/55"
                  }`}
                >
                  {tab === "upcoming" ? "Предстоящие" : "Все"}
                </button>
              ))}
            </div>
          </div>
          <div className="w-full h-px bg-[#2a1f14]/10 mb-6" />

          {displayedBookings.length === 0 ? (
            <div className="py-16 text-center">
              <div className="text-[#2a1f14]/18 text-[0.78rem] tracking-[0.18em] uppercase">
                Нет записей
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5">
              {displayedBookings.map((b) => {
                const cfg = STATUS_CONFIG[b.status];
                return (
                  <div
                    key={b.id}
                    className={`bg-[#1a2e1b] px-6 py-5 flex items-start justify-between gap-4 transition-opacity ${
                      b.status === "cancelled" ? "opacity-40" : ""
                    }`}
                  >
                    <div>
                      <div className="text-[#f5ede0] text-[0.9rem] font-light mb-1">
                        {b.massage}
                      </div>
                      <div className="text-[#f5ede0]/30 text-[0.74rem] font-light mb-3">
                        {formatDate(b.date)} · {b.time}
                      </div>
                      <div className="text-[#f5ede0]/20 text-[0.7rem] tracking-[0.08em]">
                        {b.duration} минут
                      </div>
                    </div>
                    <div
                      className={`flex items-center gap-1.5 text-[0.62rem] tracking-[0.18em] uppercase flex-shrink-0 mt-0.5 ${cfg.text}`}
                    >
                      <span
                        className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${cfg.dot}`}
                      />
                      {cfg.label}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
