import { create } from "zustand";
import { persist } from "zustand/middleware";
import axios from "axios";
const apiUrl = import.meta.env.VITE_API_URL;

const apiStore = create(
  persist((set) => ({
    userData: {},

    registerUser: async (formData) => {
      return await axios({
        method: "post",
        url: `${apiUrl}/register`,
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
        const response = await axios.post(
          `${apiUrl}/verify-email`,
          {
            useremail,
            code,
          }
        );

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
          `${apiUrl}/resend-verification-code`,
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
        const response = await axios.post(
          `${apiUrl}/login`,
          {
            data: formData,
          }
        );

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
  }))
);

export default apiStore;
