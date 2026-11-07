"use client";

import {
  AtSymbolIcon,
  KeyIcon,
  ExclamationCircleIcon,
} from "@heroicons/react/24/outline";
import { ArrowRightIcon } from "@heroicons/react/20/solid";
import { useRef } from "react";
import { useSearchParams } from "next/navigation";
import { Button } from "@/app/ui/shared/button";
import Spinner from "@/app/ui/shared/spinner";
import { navigateWithReload } from "@/app/lib/navigation";
import {
  useAppDispatch,
  useAppSelector,
  useAppStore,
} from "@/app/lib/store/hooks";
import {
  logIn,
  loginFormOpened,
  selectIsLoggingIn,
  selectLoginError,
} from "@/app/lib/store/user_slice";

function Field({
  id,
  label,
  icon: Icon,
  ...inputProps
}: {
  id: string;
  label: string;
  icon: typeof AtSymbolIcon;
} & React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <div>
      <label
        className="mb-2 block text-xs font-medium uppercase tracking-[0.15em] text-muted"
        htmlFor={id}
      >
        {label}
      </label>
      <div className="relative">
        <input
          id={id}
          name={id}
          {...inputProps}
          className="peer block h-12 w-full rounded-xl border border-line bg-white pl-11 pr-4 text-ink outline-none transition-all duration-300 placeholder:text-muted/60 focus:border-gold focus:ring-4 focus:ring-gold/15"
        />
        <Icon className="pointer-events-none absolute left-4 top-1/2 size-5 -translate-y-1/2 text-muted transition-colors peer-focus:text-gold-dark" />
      </div>
    </div>
  );
}

export default function LoginForm() {
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") || "/bookings";

  // Before the first read, so the server render matches
  const store = useAppStore();
  const isOpened = useRef<true | null>(null);
  if (isOpened.current == null) {
    store.dispatch(loginFormOpened());
    isOpened.current = true;
  }

  const dispatch = useAppDispatch();
  const errorMessage = useAppSelector(selectLoginError);
  const isPending = useAppSelector(selectIsLoggingIn);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (isPending) return;
    const formData = new FormData(event.currentTarget);
    const result = await dispatch(
      logIn({
        email: String(formData.get("email") ?? ""),
        password: String(formData.get("password") ?? ""),
        callbackUrl,
      }),
    );
    // A client-side router.push here could replay the redirect to /login
    // cached while signed out, leaving the user on this page.
    if (logIn.fulfilled.match(result)) navigateWithReload(result.payload);
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="animate-scale-in rounded-3xl bg-white/95 p-7 shadow-lift backdrop-blur [animation-delay:100ms] sm:p-9"
    >
      <p className="text-xs font-medium uppercase tracking-[0.3em] text-gold-dark">
        Добро пожаловать
      </p>
      <h1 className="mt-1 font-display text-3xl font-medium text-ink">
        Войдите, чтобы продолжить
      </h1>

      <div className="mt-7 space-y-5">
        <Field
          id="email"
          label="Email"
          icon={AtSymbolIcon}
          type="email"
          placeholder="you@example.com"
          autoComplete="email"
          required
        />
        <Field
          id="password"
          label="Пароль"
          icon={KeyIcon}
          type="password"
          placeholder="Минимум 6 символов"
          autoComplete="current-password"
          required
          minLength={6}
        />
      </div>

      <Button className="group mt-7 w-full" disabled={isPending}>
        {isPending ? <Spinner /> : null}
        Войти
        {!isPending && (
          <ArrowRightIcon className="size-5 transition-transform duration-300 group-hover:translate-x-1" />
        )}
      </Button>

      <div aria-live="polite" aria-atomic="true">
        {errorMessage && (
          <p
            key={errorMessage}
            className="mt-4 flex animate-shake items-center gap-2 rounded-xl bg-terracotta-soft p-3 text-sm text-terracotta"
          >
            <ExclamationCircleIcon className="size-5 shrink-0" />
            {errorMessage}
          </p>
        )}
      </div>
    </form>
  );
}
