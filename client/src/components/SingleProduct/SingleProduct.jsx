import { useParams } from "react-router-dom";
import useStore from "../Store/Store";
import { useEffect, useState } from "react";
import "./SingleProduct.css";

function SingleProduct() {
  const { allProducts } = useStore();
  const [product, setProduct] = useState(null);
  const [mainImage, setMainImage] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState("details");
  const { productID } = useParams();

  //Filter out the product
  useEffect(() => {
    const foundProduct = allProducts.find(item => item.id == productID);
    if (foundProduct) {
      setProduct(foundProduct);
    }
  }, [productID, allProducts]);

  useEffect(()=>{
    window.scrollTo(0,0)
  },[])

  // Fixed image selection function
  const handleImageClick = (imageUrl) => {
    // Set the main image directly without any additional logic
    setMainImage(imageUrl);
  };

  const handleQuantityChange = (action) => {
    if (action === 'increase' && quantity < 10) {
      setQuantity(prev => prev + 1);
    } else if (action === 'decrease' && quantity > 1) {
      setQuantity(prev => prev - 1);
    }
    else{
      setQuantity(1)
    }
  };

  // Format date
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };

  //Loading screen
  if (!product) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="animate-pulse text-themegreen text-xl font-medium">Loading...</div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 md:py-12">
      <div className="flex flex-col lg:flex-row gap-8">
        <div className="lg:w-2/5">
        {/* image section */}
          <div className="bg-white p-4 rounded-lg shadow-md mb-4">
            <img 
              src={mainImage || product.thumbnail} 
              alt={product.title} 
              className="w-full h-[300px] sm:h-[400px] object-contain rounded-md"
            />
          </div>
          
          <div className="grid grid-cols-5 gap-2">
            {/* Thumbnail */}
            <div 
              className={`cursor-pointer p-2 border rounded-md ${mainImage === product.thumbnail ? 'border-themegreen' : 'border-gray-200'}`}
              onClick={() => handleImageClick(product.thumbnail)}
            >
              <img 
                src={product.thumbnail} 
                alt="thumbnail" 
                className="h-16 w-full object-cover"
              />
            </div>
          
            {/* Additional images */}
            {product.images && product.images.map((img, index) => (
              <div 
                key={index} 
                className={`cursor-pointer p-2 border rounded-md ${mainImage === img ? 'border-themegreen' : 'border-gray-200'}`}
                onClick={() => handleImageClick(img)}
              >
                <img 
                  src={img} 
                  alt={`product-${index}`} 
                  className="h-16 w-full object-cover"
                />
              </div>
            ))}
          </div>
        </div>

        {/* Some product details  */}
        <div className="lg:w-3/5 scroll-auto">
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h1 className="text-2xl md:text-3xl font-bold text-themegreen mb-2">{product.title}</h1>
            <p className="text-gray-500 text-sm mb-4">
              Product by: <span className="text-themegreen font-medium">{product.brand}</span>
              <span className="ml-3 text-gray-600">SKU: {product.sku}</span>
            </p>
            
            <div className="flex items-center mb-4">
              <div className="bg-themegreen text-white px-2 py-1 rounded-md text-sm font-medium mr-3">
                {product.rating} <span className="text-[gold]">★</span>
              </div>
              <span className="text-gray-600 text-sm">
                {product.reviews ? product.reviews.length : 0} user reviews
              </span>
            </div>

            <p className="text-gray-700 mb-6">{product.description}</p>

            <div className="mb-6">
              <p className="text-2xl font-bold flex items-center">
                <span className={product.discountPercentage ? "text-gray-400 line-through mr-3" : "text-themegreen"}>
                  ${product.price}
                </span>
                {product.discountPercentage ? (
                  <span className="text-themegreen">
                    ${(parseFloat(product.price) - parseFloat(product.price) * (parseFloat(product.discountPercentage) / 100)).toFixed(2)}
                  </span>
                ) : null}
                
                {product.discountPercentage ? (
                  <span className="ml-4 bg-red-500 text-white text-sm px-2 py-1 rounded-full">
                    {product.discountPercentage}% OFF
                  </span>
                ) : null}
              </p>
            </div>

            {product.tags && product.tags.length > 0 && (
              <div className="mb-6 flex flex-wrap gap-2">
                {product.tags.map((tag, index) => (
                  <span key={index} className="bg-gray-100 text-gray-700 text-sm px-2 py-1 rounded-md">
                    {tag}
            </span>
                ))}
              </div>
            )}

            <div className="mb-6">
              <p className="text-gray-700 mb-1">
                Availability: 
                <span className={`font-medium ${product.availabilityStatus === 'In Stock' ? 'text-green-600' : 'text-red-600'}`}>
                  {" "}{product.availabilityStatus}
              </span>
                {product.stock && (
                  <span className="text-gray-600 ml-2">({product.stock} in stock)</span>
            )}
          </p>
              <p className="text-gray-700 mb-1">{product.shippingInformation}</p>
              <p className="text-gray-700">{product.warrantyInformation}</p>
            </div>

            <div className="mb-6">
              <p className="text-gray-700 mb-2">Quantity:</p>
              <div className="flex items-center">
                <button 
                  type="button"
                  disabled={quantity==1}
                  onClick={() => handleQuantityChange('decrease')}
                  className="cursor-pointer px-3 py-1 border border-gray-300 rounded-l-md bg-gray-100 hover:bg-gray-200"
                >
                  -
                </button>
                <input 
                  type="number" 
                  disabled
                  value={quantity} 
                  onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                  className="w-16 text-center border-t border-b border-gray-300 py-1"
                  min="1"
                />
                <button 
                  type="button"
                  disabled= {quantity >= 10}
                  onClick={() => handleQuantityChange('increase')}
                  className="cursor-pointer px-3 py-1 border border-gray-300 rounded-r-md bg-gray-100 hover:bg-gray-200"
                >
                  +
                </button>
              </div>
            </div>

            <div className="mb-6">
              <span className="bg-gray-200 text-gray-700 rounded-sm px-3 py-1 text-sm">
                {product.returnPolicy}
              </span>
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <button 
                type="button"
                className="w-full sm:w-1/2 p-3 border border-themegreen rounded-md bg-white text-themegreen hover:bg-themegreen hover:text-white transition duration-300 active:scale-[98%] font-medium"
              >
              Add to Cart
            </button>
              <button 
                type="button"
                className="w-full sm:w-1/2 p-3 border border-themegreen rounded-md bg-themegreen text-white hover:bg-white hover:text-themegreen transition duration-300 active:scale-[98%] font-medium"
              >
              Buy Now
            </button>
          </div>
          </div>
        </div>
      </div>

      <div className="mt-10 bg-white rounded-lg shadow-md overflow-hidden">
        <div className="border-b border-gray-200">
          <nav className="flex flex-wrap">
            <button 
              type="button"
              onClick={() => setActiveTab('details')}
              className={`px-4 py-4 text-sm font-medium ${activeTab === 'details' ? 'text-white bg-themegreen' : 'text-gray-700 hover:text-themegreen hover:bg-gray-50'}`}
            >
              Product Details
            </button>
            <button 
              type="button"
              onClick={() => setActiveTab('reviews')}
              className={`px-4 py-4 text-sm font-medium ${activeTab === 'reviews' ? 'text-white bg-themegreen' : 'text-gray-700 hover:text-themegreen hover:bg-gray-50'}`}
            >
              Reviews ({product.reviews ? product.reviews.length : 0})
            </button>
            <button 
              type="button"
              onClick={() => setActiveTab('shipping')}
              className={`px-4 py-4 text-sm font-medium ${activeTab === 'shipping' ? 'text-white bg-themegreen' : 'text-gray-700 hover:text-themegreen hover:bg-gray-50'}`}
            >
              Shipping Info
            </button>
          </nav>
        </div>

        <div className="p-6">
          {activeTab === 'details' && (
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-4">Specifications</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="border-b border-gray-200 pb-2">
                  <p className="text-gray-500 text-sm">Category</p>
                  <p className="text-gray-900">{product.category}</p>
                </div>
                <div className="border-b border-gray-200 pb-2">
                  <p className="text-gray-500 text-sm">Brand</p>
                  <p className="text-gray-900">{product.brand}</p>
                </div>
                <div className="border-b border-gray-200 pb-2">
                  <p className="text-gray-500 text-sm">Stock</p>
                  <p className="text-gray-900">{product.stock} units</p>
                </div>
                <div className="border-b border-gray-200 pb-2">
                  <p className="text-gray-500 text-sm">SKU</p>
                  <p className="text-gray-900">{product.sku}</p>
                </div>
                <div className="border-b border-gray-200 pb-2">
                  <p className="text-gray-500 text-sm">Weight</p>
                  <p className="text-gray-900">{product.weight} oz</p>
                </div>
                {product.dimensions && (
                  <div className="border-b border-gray-200 pb-2">
                    <p className="text-gray-500 text-sm">Dimensions</p>
                    <p className="text-gray-900">
                      {product.dimensions.width}W × {product.dimensions.height}H × {product.dimensions.depth}D cm
                    </p>
                  </div>
                )}
              </div>
              
              <h3 className="text-lg font-medium text-gray-900 mt-6 mb-4">Product Description</h3>
              <p className="text-gray-700">{product.description}</p>
            </div>
          )}

          {activeTab === 'reviews' && (
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-4">Customer Reviews</h3>
              
              {product.reviews && product.reviews.length > 0 ? (
                <div className="space-y-6">
                  {product.reviews.map((review, index) => (
                    <div key={index} className="border-b border-gray-200 pb-4">
                      <div className="flex items-center mb-2">
                        <div className="flex mr-2">
                          {[...Array(5)].map((_, i) => (
                            <span key={i} className={i < review.rating ? "text-yellow-400" : "text-gray-300"}>★</span>
                          ))}
                        </div>
                        <p className="text-gray-700 font-medium">{review.reviewerName}</p>
                        <p className="text-gray-500 text-sm ml-auto">{formatDate(review.date)}</p>
                      </div>
                      <p className="text-gray-700">{review.comment}</p>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500">No reviews yet. Be the first to review this product!</p>
              )}
            </div>
          )}

          {activeTab === 'shipping' && (
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-4">Shipping Information</h3>
              <div className="space-y-4">
                <div className="border-b border-gray-200 pb-3">
                  <h4 className="font-medium text-gray-800 mb-2">Delivery</h4>
                  <p className="text-gray-700">{product.shippingInformation}</p>
                </div>
                
                <div className="border-b border-gray-200 pb-3">
                  <h4 className="font-medium text-gray-800 mb-2">Return Policy</h4>
                  <p className="text-gray-700">{product.returnPolicy}</p>
                </div>
                
                <div className="border-b border-gray-200 pb-3">
                  <h4 className="font-medium text-gray-800 mb-2">Warranty</h4>
                  <p className="text-gray-700">{product.warrantyInformation}</p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
      </div>
  );
}

export default SingleProduct;
