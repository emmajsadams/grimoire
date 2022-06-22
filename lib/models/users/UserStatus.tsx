import { logout } from "thin-backend";
import { useCurrentUser } from "thin-backend-react";

export function UserStatus() {
  const user = useCurrentUser();

  return (
    <>
      {user?.email}

      <button onClick={() => logout()}>Logout</button>
    </>
  );
}
