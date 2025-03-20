import { create } from "zustand";
import axios from "axios"
const apiUrl = "http://localhost:3969"

const apiStore = create((set) => ({
    userData : {},

    registerUser: async(formData)=>{
        try {
            const response = await axios.post(`${apiUrl}/api/authentication/register`,{
                data: formData
            });

            if (response.data.success) {
                set({userData : response.data.newUser});
                return response.data;
            } else {
                throw new Error(response.data.message || 'Registration failed');
            }
        } catch (error) {
            const errorMessage = error.response?.data?.message || error.message || 'Registration failed';
            throw new Error(errorMessage);
        }
    },

    loginUser: async(formData) => {
        try {
            const response = await axios.post(`${apiUrl}/api/authentication/login`, {
                data: formData
            });

            if (response.data.success) {
                set({userData: response.data.user});
                return response.data;
            } else {
                throw new Error(response.data.message || 'Login failed');
            }
        } catch (error) {
            const errorMessage = error.response?.data?.message || error.message || 'Login failed';
            throw new Error(errorMessage);
        }
    }
}))

export default apiStore