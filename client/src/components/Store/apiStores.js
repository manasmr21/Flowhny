import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import axios from "axios";
const AUTHAPI = import.meta.env.VITE_AUTHAPI_URL;

const apiStore = create(
  persist(
    (set) => ({
      userData: null,

      makeUserNull: () => {
        set({ userData: null });
      },

      changeUserData: (data) => {
        set({ userData: data });
      },

      //API for Registering new user
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
            console.log(error.response.data.message);
            return error.response.data.message;
          });
      },

      //Verify user email
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
          console.log(error.response.data.message);
          return error.response.data.message;
        }
      },

      //To resend verification code while signing in
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
          console.log(error.response.data.message);
          return error.response.data.message;
        }
      },

      //API for user log in
      loginUser: async (formData) => {
        try {
          const response = await axios.post(
            `${AUTHAPI}/login`,
            {
              data: formData,
            },
            {
              withCredentials: true,
            }
          );

          if (response.data.success) {
            set({ userData: response.data.user });

            return response.data;
          } else {
            throw new Error(response.data.message || "Login failed");
          }
        } catch (error) {
          console.log(error.response.data.message);
          return error.response.data.message;
        }
      },

      //Log out the user
      logoutUser: async () => {
        try {
          const response = await axios.post(`${AUTHAPI}/logout`, null, {
            withCredentials: true,
          });

          if (response.data.success) {
            set({ userData: null });
            alert(response.data.message);
            return response.data;
          } else {
            throw new Error(response.data.message || "Logout failed");
          }
        } catch (error) {
          console.log(error.response.data.message);
          return error.response.data.message;
        }
      },

      //Change Username
      updateUsername: async (updatedUser) => {
        try {
          const response = await axios.post(
            `${AUTHAPI}/update-username`,
            updatedUser,
            {
              withCredentials: true,
            }
          );

          if (response.data.success) {
            set({ userData: response.data.userData });
          }

          return response.data;
        } catch (error) {
          console.log(error.response.data.message);
          return error.response.data.message;
        }
      },

      //Change email
      handleVerification: async (newMail, code) => {
        try {
          const response = await axios.patch(
            `${AUTHAPI}/update-email`,
            {
              newMail,
              code,
            },
            { withCredentials: true }
          );

          if (response.data.success) {
            set({ userData: response.data.userData });
          }

          return response.data;
        } catch (error) {
          console.log(error.response.data.message);
          return error.response.data.message;
        }
      },

      //Delete an existing user
      deleteUser: async (password, userID) => {
        try {
          const response = await axios.delete(
            `${AUTHAPI}/deleteUser/${userID}`,
            {
              data: { password },
              withCredentials: true,
            }
          );

          if (response.data.success) {
            set({ userData: null });
          }

          return response.data;
        } catch (error) {
          console.log(error.response.data.message);
          return error.response.data.message;
        }
      },

      //Add address API
      addAddress: async (address) => {
        try {
          const response = await axios.post(`${AUTHAPI}/add-address`, address, {
            withCredentials: true,
          });

          if (response.data.success) {
            set({ userData: response.data.userData });
          }

          return response.data;
        } catch (error) {
          console.log(error.response.data.message);
          return error.response.data.message;
        }
      },

      //Delete an existing address
      deleteAddress: async (addressID) => {
        try {
          const response = await axios.delete(
            `${AUTHAPI}/deleteAddress/${addressID}`,
            {
              withCredentials: true,
            }
          );

          console.log(response);

          if (response.data.success) {
            set({ userData: response.data.userData });
          }

          return response.data;
        } catch (error) {
          console.log(error.response.data.message);
          return error.response.data.message;
        }
      },

      //Update address
      updateAddress: async (addressID, newAddress) => {
        try {
          const response = await axios.post(
            `${AUTHAPI}/updateAddress`,
            {
              newAddress,
              addressID,
            },
            { withCredentials: true }
          );

          if (response.data.success) {
            set({ userData: response.data.userData });
          }

          return response.data;
        } catch (error) {
          console.log(error.response.data.message);
          return error.response.data.message;
        }
      },

      //Verify if the user is logged in or not
      verifyLogIn: async () => {
        try {
          const response = await axios.post(`${AUTHAPI}/verify`, null, {
            withCredentials: true,
          });

          if (response.data.success) {
            set({ userData: response.data.userData });
          }

          console.log(response)

          return response.data;
        } catch (error) {
          console.log(error.response.data.message);
          return error.response.data.message;
        }
      },
    }),

    {
      name: 'api-storage', 
      partialize: (state) => ({ userData: state.userData }), 
      merge: (persistedState, currentState) => ({
        ...currentState,
        ...persistedState,
      }),
    }
  )
);

export default apiStore;
