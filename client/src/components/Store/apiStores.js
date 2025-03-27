import { create } from "zustand";
import { persist } from "zustand/middleware";
import axios from "axios";
const AUTHAPI = import.meta.env.VITE_AUTHAPI_URL;

const apiStore = create(
  persist((set) => ({
    userData: null,

    registerUser: async (formData) => {
      return await axios({
        method: "post",
        url: `${AUTHAPI}/register`,
        data: {
          data: formData,
        },
      })
        .then((response) => {
          if (response.statusText == "OK") {
            console.log(response.data);
            set({ userData: response.data.newUser });
            return response.data;
          }
        })
        .catch((error) => {
          const errorMessage =
            error.response?.data?.message ||
            error.message ||
            "Registration failed";
          throw new Error(errorMessage);
        });
    },

    verifyUser: async (useremail, code) => {
      try {
        const response = await axios.post(`${AUTHAPI}/verify-email`, {
          useremail,
          code,
        });

        if (response.data.success) {
          console.log(response);
          return response.data;
        }
      } catch (error) {
        const errorMessage =
          error.response?.data?.message ||
          error.message ||
          "Verification failed";
        throw new Error(errorMessage);
      }
    },

    resendVerificationCode: async (useremail) => {
      try {
        const response = await axios.post(
          `${AUTHAPI}/resend-verification-code`,
          {
            useremail,
          }
        );

        if (response.data.success) {
          alert(response.data.message);
          return response.data;
        }
      } catch (error) {
        const errorMessage =
          error.response?.data?.message ||
          error.message ||
          "Failed to resend code";
        throw new Error(errorMessage);
      }
    },

    loginUser: async (formData) => {
      try {
        const response = await axios.post(`${AUTHAPI}/login`, {
          data: formData,
        }, {
          withCredentials: true
        });

        if (response.data.success) {
          set({ userData: response.data.user });

          return response.data;
        } else {
          throw new Error(response.data.message || "Login failed");
        }
      } catch (error) {
        const errorMessage =
          error.response?.data?.message || error.message || "Login failed";
        throw new Error(errorMessage);
      }
    },
    logoutUser: async () => {
      try {
        const response = await axios.post(`${AUTHAPI}/logout`, null, {
          withCredentials: true
        });
        

        set({ userData: {} });

        if (response.data.success) {
          set({ userData: null });
          alert(response.data.message)
          return response.data;
        } else {
          throw new Error(response.data.message || "Logout failed");
        }

      } catch (error) {
        const errorMessage =
          error.response?.data?.message || error.message || "Login failed";
        throw new Error(errorMessage);
      }
    },

    //Verify if the user token is valid or expired
    //TODO: write the code


  }))
);

export default apiStore;
