import { create } from "zustand";

const useStore = create((set, get) => ({
  //Store variables
  allProducts: [],
  cart: [], 
  theme: "dark",


  //Fetching product
  getProducts: async () => {
    try {
      const res = await fetch(`https://dummyjson.com/products?limit=0`);
      const data = await res.json();
      set({ allProducts: data.products });
    } catch (error) {
      console.error("Error fetching products:", error);
    }
  },


  //Add to cart functionality
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

  //Remove from cart functionality

  removeFromCart: (productId)=>{
    const currentCart = get().cart
    const newCart = currentCart.filter(item=>{
        return item.id != productId
    })

    set({cart : newCart})
  },

  //Theme changer
  themeToggler: () => {
    const currentTheme = get().theme;
    const newTheme = currentTheme === "dark" ? "light" : "dark";
  
    set({ theme: newTheme });
  
    // Apply theme to <html> tag
    document.documentElement.classList.toggle("dark", newTheme === "dark");
  },
  
}));

export default useStore;
