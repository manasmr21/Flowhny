import { useEffect, useState } from "react";
import "./product-page.css";
import useStore from "../Store/Store";

function ProductPage() {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedPriceRanges, setSelectedPriceRanges] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const [isFilterVisible, setIsFilterVisible] = useState(false);
  const [scrollDistance, setScrollDistance] = useState(0);

  const priceRanges = [
    { label: "Under $50", min: 0, max: 50 },
    { label: "$50 - $100", min: 50, max: 100 },
    { label: "$100 - $500", min: 100, max: 500 },
    { label: "$500 - $1000", min: 500, max: 1000 },
    { label: "Above $1000", min: 1000, max: Infinity },
  ];

  //Zustand state manager
  const { allProducts } = useStore();

  useEffect(() => {
    setProducts(allProducts);
  }, []);

  useEffect(() => {
    if (products.length > 0) {
      setFilteredProducts(products);

      const uniqueCategories = [
        "all",
        ...new Set(products.map((p) => p.category)),
      ];
      setCategories(uniqueCategories);
    }
  }, [products]);

  useEffect(() => {
    const handleScroll = () => {
      setScrollDistance(window.scrollY);
    };

    window.addEventListener("scroll", handleScroll);

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  //Filtering the product based on user preference
  const filterProducts = () => {
    let updatedProducts = products;
    if (selectedCategory !== "all") {
      updatedProducts = updatedProducts.filter(
        (p) => p.category === selectedCategory
      );
    }
    if (selectedPriceRanges.length > 0) {
      updatedProducts = updatedProducts.filter((p) =>
        selectedPriceRanges.some(
          (range) => p.price >= range.min && p.price <= range.max
        )
      );
    }
    setFilteredProducts(updatedProducts);
  };

  useEffect(() => {
    filterProducts();
  }, [selectedCategory, selectedPriceRanges]);

  //Price filter
  const handlePriceChange = (range) => {
    setSelectedPriceRanges((prev) => {
      if (prev.some((r) => r.min === range.min && r.max === range.max)) {
        return prev.filter((r) => r.min !== range.min || r.max !== range.max);
      } else {
        return [...prev, range];
      }
    });
  };

  return (
    <div className="product-page container mx-auto p-4 md:p-6">
      <p className="text-right text-themegreen italic font-medium">
        Showing {filteredProducts.length} items
      </p>
      {/* Filter Toggle Button - Only visible on mobile and tablet */}
      <button
        onClick={() => setIsFilterVisible(!isFilterVisible)}
        className="lg:hidden w-full mb-4 p-3 active:scale-[95%] bg-themegreen text-white rounded-lg flex items-center justify-center gap-2"
      >
        <svg
          className="w-6 h-6"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M4 6h16M4 12h16M4 18h16"
          />
        </svg>
        {isFilterVisible ? "Hide Filters" : "Show Filters"}
      </button>

      <div className="flex flex-col lg:flex-row gap-6">
        {/* Filter Section */}
        <aside
          className={`filter-section w-full lg:w-3/5 xl:w-2/5 p-4 lg:p-6 border rounded-lg bg-white shadow-lg lg:sticky lg:top-[100px] h-fit flex flex-col gap-6 transition-all duration-300 ${
            isFilterVisible ? "block" : "hidden lg:block"
          }`}
        >
          <h2 className="text-2xl font-bold text-themegreen mb-4 border-b pb-2">
            Filters
          </h2>

          {/* Custom Dropdown */}
          <div className="relative">
            <label className="block mb-2 font-medium text-gray-700">
              Category
            </label>
            <div
              onClick={() => setIsOpen(!isOpen)}
              className="w-full p-3 rounded-sm bg-gray-100 flex justify-between items-center cursor-pointer border border-gray-200 hover:border-themegreen"
            >
              <span className="text-lg font-medium">{selectedCategory}</span>
              <svg
                className={`w-4 h-4 transition-transform duration-200 ${
                  isOpen ? "rotate-180" : ""
                }`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 9l-7 7-7-7"
                />
              </svg>
            </div>

            {/* Dropdown Menu */}
            {isOpen && (
              <div className="absolute left-0 right-0 mt-1 bg-white border border-gray-200 rounded-sm shadow-lg z-50 max-h-60 overflow-y-auto scrollbar">
                {categories.map((category) => (
                  <div
                    key={category}
                    className={`px-4 py-3 cursor-pointer transition-colors hover:bg-[#009900] hover:text-white
                      ${
                        selectedCategory === category
                          ? "bg-[#009900] text-white"
                          : "text-gray-700"
                      }`}
                    onClick={() => {
                      setSelectedCategory(category);
                      setIsOpen(false);
                    }}
                  >
                    {category}
                  </div>
                ))}
              </div>
            )}
          </div>
          <div>
            <label className="block mb-2 font-medium text-gray-700">
              Price Range
            </label>
            <div className="flex flex-col gap-3">
              {priceRanges.map((range) => (
                <label
                  key={range.label}
                  className="flex items-center gap-3 p-2 bg-gray-100 rounded-sm hover:bg-themegreen hover:text-white transition cursor-pointer shadow-sm"
                >
                  <input
                    type="checkbox"
                    checked={selectedPriceRanges.some(
                      (r) => r.min === range.min && r.max === range.max
                    )}
                    onChange={() => handlePriceChange(range)}
                    className="accent-themegreen w-5 h-5"
                  />
                  <span className="text-md font-medium">{range.label}</span>
                </label>
              ))}
            </div>
          </div>
        </aside>
        {/* Product List */}
        <section className="flex flex-col gap-6 flex-grow lg:ml-6">
          {filteredProducts.map((product) => (
            <div
              key={product?.id}
              className="product-after relative hover:bg-[#a1a1a17a] bg-white flex flex-row items-start p-4"
            >
              <div className="w-[100px] min-w-[100px] sm:w-[120px] sm:min-w-[120px] md:w-[140px] md:min-w-[140px]">
                <img
                  src={product?.thumbnail}
                  alt={product?.title}
                  className="w-full h-[100px] sm:h-[120px] md:h-[140px] object-cover rounded-md"
                />
              </div>
              <section className="product-details text-themegreen px-2 sm:px-4 flex flex-col flex-grow">
                <p className="text-sm sm:text-base md:text-lg font-bold hover:underline cursor-pointer">
                  {product?.title}
                </p>
                <p className="text-xs sm:text-sm md:text-md font-semibold break-words">
                  <span
                    className={`${
                      product.discountPercentage
                        ? "text-gray-400 line-through"
                        : ""
                    }`}
                  >
                    ${product?.price}
                  </span>
                  {product.discountPercentage ? (
                    <span className="block">
                      $
                      {(
                        parseFloat(product?.price) -
                        parseFloat(product?.price) *
                          (parseFloat(product?.discountPercentage) / 100)
                      ).toFixed(2)}
                    </span>
                  ) : (
                    ""
                  )}
                </p>
                <p className="text-xs md:text-sm text-gray-600 line-clamp-2">
                  {product?.description}
                </p>
                <button className="cursor-pointer active:scale-[95%] hover:bg-white hover:text-themegreen border border-themegreen mt-2 w-full sm:w-32 md:w-40 rounded py-1 md:py-2 bg-themegreen text-white font-semibold transition text-sm md:text-base">
                  Buy Now
                </button>
              </section>
            </div>
          ))}
        </section>
      </div>
      <button
        className={`fixed right-5 ${
          scrollDistance < 300 ? "hidden" : "block"
        } hover:scale-[103%] transition cursor-pointer bottom-5 rounded-4xl px-5 py-3 bg-themegreen text-white text-2xl font-bold border border-themegreen active:scale-[95%] `}
        onClick={() => window.scrollTo(0, 0)}
      >
        &#8593;
      </button>
    </div>
  );
}

export default ProductPage;
