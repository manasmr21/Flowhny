import { create } from "zustand";

const useStore = create((set)=>({
    allProducts : [],

    getProducts: async()=>{
        const res = await fetch("https://dummyjson.com/products");
        const data = await res.json();
        set({allProducts: data.products})
    }
}))

export default useStore;