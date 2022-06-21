import { logout } from "thin-backend";
import { useCurrentUser } from "thin-backend-react";

export function UserStatus() {
  const user = useCurrentUser();

  return (
    <div>
      {user?.email}

      <button onClick={() => logout()}>Logout</button>
    </div>
  );
}
