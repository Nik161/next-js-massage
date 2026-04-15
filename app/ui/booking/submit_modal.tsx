import { formatDate } from "@/app/helpers/formatDate";
import { MassageType } from "@/app/models/booking/massageType";

interface SubmitModalProps {
  selectedMassage: MassageType;
  selectedDate: string;
  selectedTime: string;
  isSubmitted: boolean;
  handleReset: () => void;
}

export default function SubmitModal({
  handleReset,
  selectedMassage,
  selectedDate,
  isSubmitted,
  selectedTime,
}: SubmitModalProps) {
  if (isSubmitted) {
    return (
      <div className="min-h-screen bg-[#1a2e1e] flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-[#122014] rounded-2xl border border-[#c9a84c]/20 p-10 text-center animate-fadeUp">
          <div className="w-20 h-20 rounded-full bg-[#c9a84c]/10 flex items-center justify-center mx-auto mb-6 border border-[#c9a84c]/30">
            <svg
              className="w-10 h-10 text-[#c9a84c]"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M5 13l4 4L19 7"
              />
            </svg>
          </div>
          <div className="text-[0.7rem] tracking-[0.35em] uppercase text-[#c9a84c] mb-4">
            Запись подтверждена
          </div>
          <h2 className="font-['Cormorant_Garamond',serif] text-3xl font-light text-[#f5ede0] mb-3">
            {selectedMassage.name}
          </h2>
          <p className="text-[#9eab9f] text-sm mb-6">
            {formatDate(selectedDate)} в {selectedTime} ·{" "}
            {selectedMassage.duration} мин
          </p>
          <div className="w-12 h-px bg-[#c9a84c]/30 mx-auto mb-8" />
          <button
            onClick={handleReset}
            className="px-8 py-3 text-[0.72rem] tracking-[0.2em] uppercase font-medium bg-[#b5633a] text-[#f5ede0] border-none cursor-pointer transition-all duration-300 hover:bg-[#c97050] hover:-translate-y-0.5"
          >
            Новая запись
          </button>
        </div>
      </div>
    );
  }
}
