import { create } from "zustand";



const useStore = create((set)=>({
    allProducts : [],

    getProducts: async()=>{
        try {
            const res = await fetch(`https://dummyjson.com/products?limit=0`);
            const data = await res.json();
            set({allProducts: data.products})
        } catch (error) {
            console.log(error);
        }
    },
}))

export default useStore;