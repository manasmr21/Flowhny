import { create } from "zustand";
import { persist } from "zustand/middleware";
import axios from "axios";
const APIURL = import.meta.env.VITE_ADMIN_URL;

const adminApis = create(
  persist(
    (set) => ({
      adminData: null,

      //Admin route request
      adminRouteRequest: async () => {
        try {
          const response = await axios.get(`${APIURL}`);

          console.log(response)
            
          return response.data;
        } catch (error) {
            console.log(error.response.data.message);
            return error.response.data.message;
        }
      },
    }),

    {
      name: "admin-storage",
      partialize: (state) => ({ adminData: state.adminData }),
      merge: (persistedState, currentState) => ({
        ...currentState,
        ...persistedState,
      }),
    }
  )
);

export default adminApis;
