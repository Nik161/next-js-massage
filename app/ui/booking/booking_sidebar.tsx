import { formatDate } from "@/app/helpers/formatDate";
import AdditionalInfo from "@/app/ui/booking/additional_info";
import { MassageType } from "@/app/models/booking/massageType";

interface SideBarProps {
  selectedMassage: MassageType;
  selectedDate: string;
  selectedTime: string;
}

export default function BookingSidebar({
  selectedMassage,
  selectedDate,
  selectedTime,
}: SideBarProps) {
  return (
    <div className="lg:col-span-1">
      <div className="bg-[#122014] rounded-2xl border border-[#c9a84c]/10 p-6 md:p-8 sticky top-24">
        <div className="text-[0.65rem] tracking-[0.3em] uppercase text-[#c9a84c] mb-5 font-normal">
          Ваш выбор
        </div>

        <div className="space-y-5">
          {/* Выбранный массаж */}
          <div className="pb-4 border-b border-[#f5ede0]/5">
            <div className="font-['Cormorant_Garamond',serif] text-xl font-light text-[#f5ede0] mb-1">
              {selectedMassage.name}
            </div>
            <div className="text-sm text-[#9eab9f] mb-1">
              {selectedMassage.duration} минут
            </div>
            <div className="text-[#c9a84c] text-sm">
              {selectedMassage.price.toLocaleString()} ₽
            </div>
          </div>

          {/* Выбранная дата */}
          <div className="pb-4 border-b border-[#f5ede0]/5">
            <div className="text-[0.6rem] tracking-[0.2em] uppercase text-[#9eab9f]/60 mb-1">
              Дата
            </div>
            <div className="text-[#f5ede0] text-base">
              {selectedDate ? formatDate(selectedDate) : "—"}
            </div>
          </div>

          {/* Выбранное время */}
          <div className="pb-4 border-b border-[#f5ede0]/5">
            <div className="text-[0.6rem] tracking-[0.2em] uppercase text-[#9eab9f]/60 mb-1">
              Время
            </div>
            <div className="text-[#f5ede0] text-base">
              {selectedTime || "—"}
            </div>
          </div>

          {/*/!* Итого *!/*/}
          {/*<div className="pt-2">*/}
          {/*  <div className="flex justify-between items-end">*/}
          {/*    <span className="text-[#9eab9f] text-sm">Итого</span>*/}
          {/*    <span className="font-['Cormorant_Garamond',serif] text-3xl font-light text-[#c9a84c]">*/}
          {/*      {selectedMassage.price.toLocaleString()} ₽*/}
          {/*    </span>*/}
          {/*  </div>*/}
          {/*</div>*/}
        </div>

        <AdditionalInfo />
      </div>
    </div>
  );
}
