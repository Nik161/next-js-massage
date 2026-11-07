import { Provider } from "react-redux";
import { makeStore, type AppStore } from "@/app/lib/store/store";
import { userLoaded, type SessionUser } from "@/app/lib/store/user_slice";

export const TEST_USER: SessionUser = {
  id: "u-1",
  name: "Анна",
  email: "anna@example.com",
  role: "user",
  balance: 120,
};

// A fresh store per test, so cached slots never leak between tests.
export function makeTestStore(user: SessionUser | null = TEST_USER) {
  const store = makeStore();
  store.dispatch(userLoaded(user));
  return store;
}

export function storeWrapper(store: AppStore = makeTestStore()) {
  return function StoreWrapper({ children }: { children: React.ReactNode }) {
    return <Provider store={store}>{children}</Provider>;
  };
}
