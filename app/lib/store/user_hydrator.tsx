"use client";

import { useEffect, useRef } from "react";
import { useAppStore } from "@/app/lib/store/hooks";
import { userLoaded, type SessionUser } from "@/app/lib/store/user_slice";

// Puts the user loaded on the server into the store. Render it above the
// components that read the user, so their first render already has it.
export default function UserHydrator({ user }: { user: SessionUser | null }) {
  const store = useAppStore();

  // First render: before any reader, so SSR and hydration match.
  const isHydrated = useRef<true | null>(null);
  if (isHydrated.current == null) {
    store.dispatch(userLoaded(user));
    isHydrated.current = true;
  }

  // Later server renders (navigation, router.refresh()) bring fresh data,
  // e.g. the balance after a booking.
  useEffect(() => {
    store.dispatch(userLoaded(user));
  }, [store, user]);

  return null;
}
