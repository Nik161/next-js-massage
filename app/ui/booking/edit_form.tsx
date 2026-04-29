import { Button } from "@/app/ui/shared/button";
import Link from "next/link";
import { CalendarDaysIcon, ListBulletIcon } from "@heroicons/react/24/outline";
import { MASSAGE_TYPES } from "@/app/constants/massage_types";
import "../styles/datepicker.css";
import { MASSAGE_DURATIONS } from "@/app/constants/massage_durations";

export default function EditBookingForm() {
  return (
    <form className="w-full min-w-full">
      <div className="rounded-md bg-gray-50 p-4 md:p-6">
        {/* Customer Name */}
        <div className="mb-4">
          <h1>Customer name</h1>
          <div className="relative">
            {/*<select*/}
            {/*  id="customer"*/}
            {/*  name="customerId"*/}
            {/*  className="peer block w-full cursor-pointer rounded-md border border-gray-200 py-2 pl-10 text-sm outline-2 placeholder:text-gray-500"*/}
            {/*  defaultValue={invoice.customer_id}*/}
            {/*  aria-describedby="customer-error"*/}
            {/*>*/}
            {/*  <option value="" disabled>*/}
            {/*    Select a customer*/}
            {/*  </option>*/}
            {/*  {customers.map((customer) => (*/}
            {/*    <option key={customer.id} value={customer.id}>*/}
            {/*      {customer.name}*/}
            {/*    </option>*/}
            {/*  ))}*/}
            {/*</select>*/}
            {/*<UserCircleIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500" />*/}
          </div>
          {/*<div id="customer-error" aria-live="polite" aria-atomic="true">*/}
          {/*  {state.errors?.customerId &&*/}
          {/*    state.errors.customerId.map((error: string) => (*/}
          {/*      <p className="mt-2 text-sm text-red-500" key={error}>*/}
          {/*        {error}*/}
          {/*      </p>*/}
          {/*    ))}*/}
          {/*</div>*/}
        </div>

        {/* Booking type */}
        <div className="mb-4">
          <label htmlFor="booking_type" className="mb-2 block font-medium">
            Выберите тип массажа
          </label>
          <div className="relative mt-2 rounded-md">
            <div className="relative">
              <select
                id="booking_type"
                name="booking_type"
                className="peer block w-full cursor-pointer rounded-md border border-gray-200 py-2 pl-10 outline-2 placeholder:text-gray-500"
                // defaultValue={invoice.customer_id}
                // aria-describedby="customer-error"
              >
                <option value="" disabled>
                  Выберите массаж
                </option>
                {MASSAGE_TYPES.map((massage) => (
                  <option key={massage.id} value={massage.id}>
                    {massage.name}
                  </option>
                ))}
              </select>
              <ListBulletIcon className="pointer-events-none absolute left-3 top-1/2 h-4.5 w-4.5 -translate-y-1/2 text-gray-500 peer-focus:text-gray-900" />
            </div>
          </div>
          {/*<div id="amount-error" aria-live="polite" aria-atomic="true">*/}
          {/*  {state.errors?.amount &&*/}
          {/*    state.errors.amount.map((error: string) => (*/}
          {/*      <p className="mt-2 text-sm text-red-500" key={error}>*/}
          {/*        {error}*/}
          {/*      </p>*/}
          {/*    ))}*/}
          {/*</div>*/}
        </div>

        {/*  Date Section   */}

        <div className="mb-4">
          <label htmlFor="date-picker" className="mb-2 block font-medium">
            Выберите дату сеанса
          </label>
          <div className="date-picker-wrapper">
            <input
              className="peer block w-full cursor-pointer rounded-md border border-gray-200 py-2 pl-10 outline-2 placeholder:text-gray-500"
              id="date-picker"
              name="date-picker"
              type="date"
            />
            <CalendarDaysIcon className="pointer-events-none absolute left-3 top-1/2 h-4.5 w-4.5 -translate-y-1/2 text-gray-500 peer-focus:text-gray-900" />
          </div>
        </div>

        {/*Duration section*/}
        <div className="mb-4">
          <label htmlFor="booking_duration" className="mb-2 block font-medium">
            Выберите продолжительность программы
          </label>
          <div className="relative mt-2 rounded-md">
            <div className="relative">
              <select
                id="booking_duration"
                name="booking_duration"
                className="peer block w-full cursor-pointer rounded-md border border-gray-200 py-2 pl-10 outline-2 placeholder:text-gray-500"
              >
                <option value="" disabled>
                  Выберите продолжительность
                </option>
                {MASSAGE_DURATIONS.map((duration, index) => (
                  <option key={index} value={duration}>
                    {duration} минут
                  </option>
                ))}
              </select>
              <ListBulletIcon className="pointer-events-none absolute left-3 top-1/2 h-4.5 w-4.5 -translate-y-1/2 text-gray-500 peer-focus:text-gray-900" />
            </div>
          </div>
        </div>

        {/*Booking Status */}
        <fieldset>
          <legend className="mb-2 mt-2 block font-medium">
            Статус бронирования
          </legend>
          <div className="rounded-md border border-gray-200 bg-white px-3.5 py-3">
            <div className="flex gap-4">
              <div className="flex items-center">
                <input
                  id="pending"
                  name="status"
                  type="radio"
                  value="pending"
                  // defaultChecked={booking.status === "pending"}
                  className="h-4 w-4 cursor-pointer border-gray-300 bg-gray-100 text-gray-600 focus:ring-2"
                  aria-describedby="status-error"
                />
                <label
                  htmlFor="pending"
                  className="ml-2 flex cursor-pointer items-center gap-1.5 rounded-full bg-gray-100 px-3 py-1.5 font-medium text-gray-600"
                >
                  Записаны на массаж
                </label>
              </div>
              <div className="flex items-center">
                <input
                  id="paid"
                  name="status"
                  type="radio"
                  value="paid"
                  // defaultChecked={invoice.status === "paid"}
                  className="h-4 w-4 cursor-pointer border-gray-300 bg-gray-100 text-gray-600 focus:ring-2"
                  aria-describedby="status-error"
                />
                <label
                  htmlFor="paid"
                  className="ml-2 flex cursor-pointer items-center gap-1.5 rounded-full bg-green-500 px-3 py-1.5 font-medium text-white"
                >
                  Массаж сделан
                </label>
              </div>
            </div>
          </div>
          {/*<div id="amount-error" aria-live="polite" aria-atomic="true">*/}
          {/*  {state.errors?.status &&*/}
          {/*    state.errors.status.map((error: string) => (*/}
          {/*      <p className="mt-2 text-sm text-red-500" key={error}>*/}
          {/*        {error}*/}
          {/*      </p>*/}
          {/*    ))}*/}
          {/*</div>*/}
        </fieldset>
      </div>
      <div className="mt-6 flex justify-end gap-4">
        <Link
          href="/bookings"
          className="flex h-10 items-center rounded-lg bg-gray-100 px-4 font-medium text-gray-600 transition-colors hover:bg-gray-200"
        >
          Cancel
        </Link>
        <Button type="submit">Редактировать бронирование</Button>
      </div>
    </form>
  );
}
