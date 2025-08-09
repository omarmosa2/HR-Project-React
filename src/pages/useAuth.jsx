import { useState } from "react";

export const useAuth = () => {
  const [user, setUser] = useState({
    firstName: "أحمد",
    lastName: "العلي",
    role: "مدير",
  });

  const logoutMutation = {
    isPending: false,
    mutate: () => {
      console.log("Logging out...");
      setUser(null);
    },
  };

  return { user, logoutMutation };
};
