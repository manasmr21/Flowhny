import { create } from "zustand";
import { persist } from "zustand/middleware";
import axios from "axios";
import useStore from "./Store";

const APIURL = import.meta.env.VITE_ADMIN_URL;
const productUrl = import.meta.env.VITE_ADD_PRODUCT;

const adminApis = create(
  persist(
    (set) => ({
      adminData: null,

      //In case if needed
      makeAdminNull: () => {
        set({ adminData: null });
      },

      //Admin route request
      adminRouteRequest: async () => {
        try {
          const response = await axios.get(`${APIURL}`);

          return response.data;
        } catch (error) {
          console.log(error.response.data.message);
          return error.response.data.message;
        }
      },

      adminLogin: async (creds) => {
        try {
          const response = await axios.post(`${APIURL}/loginAdmin`, creds, {
            withCredentials: true,
          });

          if (response.data.success) {
            set({ adminData: response.data.admin });
          }

          return response.data;
        } catch (error) {
          console.log(error.response.data.message);
          return error.response.data.message;
        }
      },

      verifyAdminLogin: async () => {
        try {
          const response = await axios.get(`${APIURL}/verifyAdmin`, {
            withCredentials: true,
          });

          if (response.data.success) {
            set({ adminData: response.data.admin });
          }

          return response.data;
        } catch (error) {
          console.log(error.response.data.message);
          return error.response.data.message;
        }
      },

      adminLogout: async () => {
        try {
          const response = await axios.post(`${APIURL}/logoutAdmin`, null, {
            withCredentials: true,
          });

          if (response.data.success) {
            set({ adminData: null });
          }

          return response.data;
        } catch (error) {
          console.log(error.response.data.message);
          return error.response.data.message;
        }
      },

      //Add a product
      addProduct: async (productData) => {
        try {
          const response = await axios.post(
            `${productUrl}/add-product`,
            productData,
            {
              headers: {
                "Content-Type": "multipart/form-data",
              },
              withCredentials: true,
            }
          );

          console.log(response.data);

          if (response.data.success) {
            const setProduct = useStore.getState().updateProductValue;

            setProduct(response.data.product);
          }

          return response.data;
        } catch (error) {
          console.log(error.response.data.message);
          return error.response.data.message;
        }
      },

      //Delete single or many products
      removeProducts: async (productData) => {
        try {
          const response = await axios.delete(
            `${productUrl}/delete-product`,

            {
              data: productData,
              withCredentials: true,
            }
          );

          if (response.data.success) {
            const setProduct = useStore.getState().updateProductValue;

            setProduct(response.data.product);
          }

          return response.data
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
