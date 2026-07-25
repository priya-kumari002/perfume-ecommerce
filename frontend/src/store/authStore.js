// import { create } from "zustand";
// import { persist } from "zustand/middleware";

// const useAuthStore = create(
//   persist(
//     (set) => ({
//       user: null,
//       setUser: (user) => set({ user }),
//       logout: () => {
//         set({ user: null });
//         localStorage.removeItem("user");
//       },
//     }),
//     {
//       name: "user",
//     }
//   )
// );

// export default useAuthStore;
import { create } from "zustand";
import { persist } from "zustand/middleware";

const useAuthStore = create(
  persist(
    (set) => ({
      user: null,
      token: null,

      setUser: (data) => {
        // data = { name, email, role, token, ... }  OR  { user, token }
        const user = data?.user || data;
        const token = data?.token || data?.accessToken || null;

        if (token) {
          localStorage.setItem("token", token);
        }

        set({
          user: user
            ? {
                _id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
                phone: user.phone,
                avatar: user.avatar,
              }
            : null,
          token,
        });
      },

      logout: () => {
        localStorage.removeItem("token");
        set({ user: null, token: null });
      },
    }),
    {
      name: "auth-storage",
    }
  )
);

export default useAuthStore;