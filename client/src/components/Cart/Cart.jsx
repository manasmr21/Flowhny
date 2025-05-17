import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { FaTrash, FaMinus, FaPlus } from "react-icons/fa";
import "./Cart.css";
import useStore from "../Store/Store";
import apiStore from "../Store/apiStores";

function Cart() {
  const [cartItems, setCartItems] = useState([]);
  const [couponCode, setCouponCode] = useState("");
  const [discount, setDiscount] = useState(0);
  const [couponError, setCouponError] = useState("");
  const [shippingMethod, setShippingMethod] = useState("standard");
  const { cart, removeFromCart } = useStore();
  const {userData} = apiStore()
  const [order, setOrder] = useState({
    userID: userData?.userID,
    items: [{
      productID: "",
      quantity: ""
    }],
    totalPrice :"",
    paymentStatus: "",
    shippingMethod: "",
    couponCode: "",
    shippingCost: "",
    shippingAddress: "",
  })

  // Shipping options
  const shippingOptions = {
    standard: { price: 5.99, name: "Standard Shipping (3-5 business days)" },
    express: { price: 12.99, name: "Express Shipping (1-2 business days)" },
    free: { price: 0, name: "Free Shipping (5-7 business days)" },
  };

  // Update cart items when cart changes
  useEffect(() => {
    const items = cart.map((product) => {
      // Calculate discounted price if applicable
      const discountedPrice = product.discountPercentage
        ? parseFloat(product.price) -
          parseFloat(product.price) *
            (parseFloat(product.discountPercentage) / 100)
        : product.price;

      return {
        ...product,
        totalPrice: discountedPrice * product.buyingQuantity,
        discountedPrice: discountedPrice,
      };
    });

    setCartItems(items);
  }, [cart]); // Added cart as dependency to update when it changes

  // Handle quantity change
  const handleQuantityChange = (id, newQuantity) => {
    if (newQuantity >= 1 && newQuantity <= 10) {
      setCartItems((prevItems) =>
        prevItems.map((item) => {
          if (item.id === id) {
            return {
              ...item,
              buyingQuantity: newQuantity,
              totalPrice: item.discountedPrice * newQuantity,
            };
          }
          return item;
        })
      );
    }
  };

  // Apply coupon code
  const applyCoupon = () => {
    setCouponError("");
    // Mock coupon codes
    const validCoupons = {
      WELCOME10: 10,
      SAVE20: 20,
      FREESHIP: 15,
    };

    if (validCoupons[couponCode]) {
      setDiscount(validCoupons[couponCode]);
    } else {
      setCouponError("Invalid coupon code");
      setDiscount(0);
    }
  };

  // Calculate totals
  const subtotal = cartItems.reduce((sum, item) => sum + item.totalPrice, 0);
  const shippingCost = shippingOptions[shippingMethod].price;
  const discountAmount = (subtotal * discount) / 100;
  const taxRate = 0.07; // 7% tax rate
  const taxAmount = (subtotal - discountAmount) * taxRate;
  const total = subtotal - discountAmount + taxAmount + shippingCost;

  // Format currency
  const formatCurrency = (amount) => {
    return amount.toFixed(2);
  };

  return (
    <div className="dark:bg-themedark">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-themegreen mb-8 text-center">
          Your Shopping Cart
        </h1>

        {cartItems.length === 0 ? (
          <div className=" dark:bg-lighterthemedark dark:shadow-md dark:shadow-black  text-center py-16 bg-white rounded-lg shadow-md">
            <div className="text-gray-500 text-6xl mb-4">🛒</div>
            <h2 className="text-2xl font-semibold text-themegreen mb-4">
              Your cart is empty
            </h2>
            <p className="text-gray-500 mb-8">
             {" Looks like you haven't added anything to your cart yet."}
            </p>
            <Link
              to="/products"
              className="px-6 py-3 bg-themegreen text-white rounded-md hover:bg-opacity-90 transition"
            >
              Continue Shopping
            </Link>
          </div>
        ) : (
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Cart Items */}
            <div className="lg:w-2/3">
              <div className="bg-white rounded-lg dark:bg-lighterthemedark shadow-md overflow-hidden mb-4">
                {cartItems.map((item) => (
                  <div
                    key={item.id}
                    className="p-4 border-b last:border-b-0 dark:hover:bg-[#484848] hover:bg-gray-50"
                  >
                    <div className="grid grid-cols-12 gap-4 items-center">
                      {/* Product */}
                      <div className="col-span-6 flex items-center gap-4">
                        <img
                          src={item.thumbnail}
                          alt={item.title}
                          className="w-16 h-16 object-cover rounded-md"
                        />
                        <div>
                          <h3 className="font-medium dark:text-gray-300 text-gray-800">
                            {item.title}
                          </h3>
                          <p className="text-sm text-gray-500">{item.brand}</p>

                          {/* Remove button */}
                          <div className="flex gap-3 mt-2">
                            <button
                              onClick={() => removeFromCart(item.id)}
                              className="text-xs text-red-500 flex items-center gap-1 hover:underline"
                            >
                              <FaTrash size={12} /> Remove
                            </button>
                          </div>
                        </div>
                      </div>

                      {/* Price */}
                      <div className="col-span-2 text-center">
                        <div className="font-medium dark:text-gray-300 text-gray-800">
                          ${formatCurrency(item.discountedPrice)}
                        </div>
                        {item.discountPercentage > 0 && (
                          <div className="text-xs text-gray-500  line-through">
                            ${formatCurrency(item.price)}
                          </div>
                        )}
                      </div>

                      {/* Quantity */}
                      <div className="col-span-2 dark:text-gray-300 flex justify-center">
                        <div className="flex items-center border rounded-md">
                          <button
                            onClick={() =>
                              handleQuantityChange(
                                item.id,
                                item.buyingQuantity - 1
                              )
                            }
                            disabled={item.buyingQuantity <= 1}
                            className="px-2 py-1 text-gray-600 dark:text-gray-300 hover:bg-gray-100 disabled:opacity-50"
                          >
                            <FaMinus size={12} />
                          </button>
                          <span className="px-3 dark:text-gray-300 py-1 text-center w-10">
                            {item.buyingQuantity}
                          </span>
                          <button
                            onClick={() =>
                              handleQuantityChange(
                                item.id,
                                item.buyingQuantity + 1
                              )
                            }
                            disabled={
                              item.buyingQuantity >= 10 ||
                              item.buyingQuantity >= item.stock
                            }
                            className="px-2 py-1 dark:text-gray-300 text-gray-600 hover:bg-gray-100 disabled:opacity-50"
                          >
                            <FaPlus size={12} />
                          </button>
                        </div>
                      </div>

                      {/* Total */}
                      <div className="col-span-2 dark:text-gray-300 text-center font-medium text-gray-800">
                        ${formatCurrency(item.totalPrice)}
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="flex justify-between items-center mt-6">
                <Link
                  to="/products"
                  className="text-themegreen hover:underline flex items-center gap-2"
                >
                  ← Continue Shopping
                </Link>
              </div>
            </div>

            {/* Order Summary */}
            <div className="lg:w-1/3 ">
              <div className="bg-white dark:bg-lighterthemedark rounded-lg shadow-md p-6 sticky top-24">
                <h2 className="text-xl dark:text-white font-bold text-gray-800 mb-6 pb-2 border-b">
                  Order Summary
                </h2>

                {/* Coupon Code */}
                <div className="mb-6">
                  <label className="block dark:text-gray-300 text-gray-700 text-sm font-medium mb-2">
                    Apply Coupon Code
                  </label>
                  <div className="flex ">
                    <input
                      type="text"
                      value={couponCode}
                      onChange={(e) =>
                        setCouponCode(e.target.value.toUpperCase())
                      }
                      className="flex-grow dark:bg-white px-3 py-2 border rounded-l-md focus:outline-none focus:ring-2 focus:ring-themegreen"
                      placeholder="Enter coupon code"
                    />
                    <button
                      onClick={applyCoupon}
                      className="bg-themegreen text-white px-4 py-2 rounded-r-md hover:bg-opacity-90"
                    >
                      Apply
                    </button>
                  </div>
                  {couponError && (
                    <p className="text-red-500 text-xs mt-1">{couponError}</p>
                  )}
                  {discount > 0 && (
                    <p className="text-green-500 text-xs mt-1">
                      Coupon applied: {discount}% off
                    </p>
                  )}
                  <p className="text-xs dark:text-gray-400 text-gray-500 mt-1">
                    Try codes: WELCOME10, SAVE20, FREESHIP
                  </p>
                </div>

                {/* Shipping Options */}
                <div className="mb-6">
                  <label className="block text-themegreen text-sm font-medium mb-2">
                    Shipping Method
                  </label>
                  <div className="space-y-2">
                    {Object.entries(shippingOptions).map(([key, option]) => (
                      <label key={key} className="flex items-center">
                        <input
                          type="radio"
                          name="shipping"
                          value={key}
                          checked={shippingMethod === key}
                          onChange={() => setShippingMethod(key)}
                          className="mr-2 accent-themegreen"
                        />
                        <span className="text-sm dark:text-gray-300 text-gray-700">
                          {option.name} - $
                          {option.price === 0
                            ? "Free"
                            : formatCurrency(option.price)}
                        </span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Price Breakdown */}
                <div className="space-y-2 dark:text-gray-400 text-gray-700 mb-6">
                  <div className="flex justify-between">
                    <span>Subtotal</span>
                    <span>${formatCurrency(subtotal)}</span>
                  </div>
                  {discount > 0 && (
                    <div className="flex justify-between text-green-600">
                      <span>Discount ({discount}%)</span>
                      <span>-${formatCurrency(discountAmount)}</span>
                    </div>
                  )}
                  <div className="flex justify-between">
                    <span>Shipping</span>
                    <span>${formatCurrency(shippingCost)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Tax (7%)</span>
                    <span>${formatCurrency(taxAmount)}</span>
                  </div>
                  <div className="border-t pt-2 mt-2 font-bold  text-themegreen flex justify-between">
                    <span>Total</span>
                    <span>${formatCurrency(total)}</span>
                  </div>
                </div>

                {/* Checkout Button */}
                <button
                  onClick={() =>
                    alert(
                      "Proceeding to checkout with total: $" +
                        formatCurrency(total)
                    )
                  }
                  className="w-full bg-themegreen text-white py-3 rounded-md font-medium hover:bg-opacity-90 transition active:scale-[98%]"
                >
                  Proceed to Checkout
                </button>

                {/* Payment Methods */}
                <div className="mt-6 text-center">
                  <p className="text-xs text-gray-500 mb-2">We accept:</p>
                  <div className="flex justify-center gap-2">
                    <div className="w-10 h-6 bg-gray-200 rounded flex items-center justify-center text-xs">
                      Visa
                    </div>
                    <div className="w-10 h-6 bg-gray-200 rounded flex items-center justify-center text-xs">
                      MC
                    </div>
                    <div className="w-10 h-6 bg-gray-200 rounded flex items-center justify-center text-xs">
                      Amex
                    </div>
                    <div className="w-10 h-6 bg-gray-200 rounded flex items-center justify-center text-xs">
                      PayP
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default Cart;
