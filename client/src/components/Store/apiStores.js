import { create } from "zustand";
import axios from "axios"
const apiUrl = "http://localhost:3969"

const apiStore = create((set, get)=>({

    userData : {},

    registerUser: async(formData)=>{

        try {
            const response = await axios.post(`${apiUrl}/api/authentication/register`,{
                data: formData
            })


            set({userData : response.data})

        } catch (error) {
            console.log(error)
         console.log(error.message)   
        }
       
    }

}))

export default apiStore