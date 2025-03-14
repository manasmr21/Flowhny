import { create } from "zustand";

const useStore = create((set, get) => ({
    allProducts: [],
    cart: [],

    getProducts: async () => {
        try {
            const res = await fetch(`https://dummyjson.com/products?limit=0`);
            const data = await res.json();
            set({ allProducts: data.products })
        } catch (error) {
            console.log(error);
        }
    },
    addToCart: (productID) => {
        const currentCart = get().cart;
        if(currentCart.length < 20){
            set({ cart: [...currentCart, productID] })
        }else{
            alert("You cant add more than 20 items to your cart")
        }
    }
}))

export default useStore;