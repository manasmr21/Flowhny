import { create } from "zustand";

const useStore = create((set, get) => ({
  allProducts: [],
  cart: [], // ✅ Should be an empty array

  getProducts: async () => {
    try {
      const res = await fetch(`https://dummyjson.com/products?limit=0`);
      const data = await res.json();
      set({ allProducts: data.products });
    } catch (error) {
      console.error("Error fetching products:", error);
    }
  },

  addToCart: (product) => {
    const currentCart = get().cart;

    const isAlreadyInCart = currentCart.some((item) => item.id === product.id);
    
    if (isAlreadyInCart) {
      alert("Item is already in the cart");
      return;
    }

    if (currentCart.length < 20) {
      set({ cart: [...currentCart, product] });
    } else {
      alert("You can't add more than 20 items to your cart");
    }
  },
  removeFromCart: (productId)=>{
    const currentCart = get().cart
    const newCart = currentCart.filter(item=>{
        return item.id != productId
    })

    set({cart : newCart})
  }
}));

export default useStore;
