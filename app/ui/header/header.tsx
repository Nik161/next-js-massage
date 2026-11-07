import { getCurrentUser } from "@/app/lib/session";
import UserHydrator from "@/app/lib/store/user_hydrator";
import HeaderClient from "./header-client";

export default async function Header() {
  const user = await getCurrentUser();

  return (
    <>
      {/* Every page with a header keeps the store's user up to date */}
      <UserHydrator
        user={
          user
            ? {
                id: user.id,
                name: user.name,
                email: user.email,
                role: user.role,
                balance: user.balance,
              }
            : null
        }
      />
      <HeaderClient />
    </>
  );
}
