import { useRef, useState, useEffect } from "react";
import { FaPlusCircle, FaUpload } from "react-icons/fa";
import { ImCross } from "react-icons/im";
import adminApis from "../../components/Store/adminApi";

const EditProduct = ({ product, onClose, onUpdate }) => {
  const { updateProducts } = adminApis();

  const initialProduct = product;

  console.log(product);

  const [thumbnail, setThumbnail] = useState(null);
  const [previewImage, setPreviewImage] = useState(null);

  const imgRef = useRef(null);
  const [tags, setTags] = useState([]);
  const [tagsValue, setTagValue] = useState("");

  const [existingImages, setExistingImages] = useState([]);
  const [newImages, setNewImages] = useState([]);
  const [newImagePreviews, setNewImagePreviews] = useState([]);

  const [inputKey, setInputKey] = useState(Date.now());
  const [validsku, setValidsku] = useState(true);

  const [productData, setProductData] = useState({
    title: "",
    description: "",
    category: "",
    discountPercentage: 0,
    price: 0,
    stock: 0,
    sku: "",
    shippingInformation: "",
    returnPolicy: "",
    brand: "",
  });

  useEffect(() => {
    if (initialProduct) {
      setProductData({
        title: initialProduct.title || "",
        description: initialProduct.description || "",
        category: initialProduct.category || "",
        discountPercentage: initialProduct.discountPercentage || 0,
        price: initialProduct.price || 0,
        stock: initialProduct.stock || 0,
        sku: initialProduct.sku || "",
        shippingInformation: initialProduct.shippingInformation || "",
        returnPolicy: initialProduct.returnPolicy || "",
        brand: initialProduct.brand || "",
      });
      setTags(initialProduct.tags || []);
      setPreviewImage(initialProduct.thumbnail.displayPath || null);
      setExistingImages(initialProduct.images || []);
    }
  }, [initialProduct]);

  const clickRef = () => {
    if (imgRef.current) imgRef.current.click();
  };

  const handleThumbnailUpload = (e) => {
    e.preventDefault();
    const file = e.target.files[0];
    if (file) {
      const imagUrl = URL.createObjectURL(file);
      setPreviewImage(imagUrl);
      setThumbnail(file);
    }
  };

  const handleUploadImages = (e) => {
    e.preventDefault();
    const files = e.target.files;
    const totalCount = existingImages.length + newImages.length + files.length;

    if (totalCount > 5) {
      alert("You cannot add more than 5 images");
      return;
    }

    if (files.length > 0) {
      const fileArray = Array.from(files);
      const previewUrls = fileArray.map((img) => URL.createObjectURL(img));

      setNewImages((prev) => [...prev, ...fileArray]);
      setNewImagePreviews((prev) => [...prev, ...previewUrls]);
    }
  };

  const removeExistingImage = (imgUrl) => {
    setExistingImages(existingImages.filter((img) => img !== imgUrl));
  };

  const removeNewImage = (idx) => {
    const updatedNewImages = [...newImages];
    const updatedPreviews = [...newImagePreviews];

    updatedNewImages.splice(idx, 1);
    updatedPreviews.splice(idx, 1);

    setNewImages(updatedNewImages);
    setNewImagePreviews(updatedPreviews);
  };

  const addTags = (e) => {
    e.preventDefault();
    if (!tagsValue.trim()) return alert("Please add a tag");
    if (tags.length < 8) {
      setTags((prev) => [...prev, tagsValue.trim()]);
      setTagValue("");
    } else {
      alert("You cannot add more tags");
      setTagValue("");
    }
  };

  // const handleUpdateProduct = async (e) => {
  //   e.preventDefault();
  //   const formData = new FormData();

  //   if (thumbnail) formData.append("thumbnail", thumbnail);

  //   if (newImages.length > 0) {
  //     newImages.forEach((img) => {
  //       formData.append("images", img);
  //     });
  //   }

  //   Object.entries(productData).forEach(([key, value]) => {
  //     formData.append(key, value);
  //   });

  //   if (tags.length > 0) {
  //     tags.forEach((tag) => {
  //       formData.append("tags", tag);
  //     });
  //   }

  //   // --- STATIC MOCK SUBMIT ---
  //   console.log("--- STATIC UPDATE MODE ---");
  //   console.log("Form Data Entries:");
  //   for (let pair of formData.entries()) {
  //     console.log(pair[0] + ", " + pair[1]);
  //   }
  //   console.log("Remaining Existing Images:", existingImages);

  //   alert("Static Update Successful! Check console for data.");
  //   if (onUpdate) onUpdate(); // Mock refresh
  //   onClose();
  // };

  const handleProductData = (e) => {
    const { name, value } = e.target;
    setProductData({ ...productData, [name]: value });
  };
  const handleUpdatingProduct = async () => {
    const data = await updateProducts(product.productID, productData);
    console.log(data);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60 backdrop-blur-sm overflow-y-auto pt-10 pb-10">
      <div className="relative bg-white dark:bg-gray-800 w-[95%] md:w-[75%] lg:w-[50%] p-6 rounded-lg shadow-xl max-h-[90vh] overflow-y-auto">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-red-500 text-2xl z-20"
        >
          <ImCross />
        </button>

        <h2 className="text-2xl font-bold text-center mb-6 text-gray-800 dark:text-white">
          Edit Product (Static)
        </h2>

        {/* --- Form Starts --- */}
        <div className="addProducts mx-auto text-gray-900 dark:text-gray-300">
          {/* Thumbnail Upload */}
          <div className="flex flex-col items-center">
            <input
              type="file"
              accept="image/png, image/jpeg"
              className="hidden"
              ref={imgRef}
              onChange={handleThumbnailUpload}
              name="thumbnail"
            />
            <div className="border relative border-gray-500 dark:border-white w-48 h-60 flex justify-center items-center">
              {previewImage ? (
                <img
                  src={previewImage}
                  className="object-contain h-full w-full"
                  alt="thumbnail"
                />
              ) : (
                <button type="button" onClick={clickRef}>
                  <FaPlusCircle className="text-5xl text-gray-500 cursor-pointer" />
                </button>
              )}
              {previewImage && (
                <button
                  className="bg-red-600 cursor-pointer p-1 absolute top-[-3%] right-[-5%] rounded-2xl border border-white"
                  onClick={() => {
                    setPreviewImage(null);
                    setThumbnail(null);
                  }}
                >
                  <ImCross className="text-white text-xs" />
                </button>
              )}
            </div>
            <p className="text-sm mt-2 text-gray-500">
              Click image to change thumbnail
            </p>
          </div>

          {/* Product Fields */}
          <div className="mt-8 space-y-4">
            <div>
              <label htmlFor="title">Title:</label>
              <input
                type="text"
                name="title"
                placeholder="Product Name"
                value={productData.title}
                className="w-full p-2 rounded border focus:outline-themegreen"
                onChange={handleProductData}
              />
            </div>

            <div>
              <label htmlFor="brand">Brand:</label>
              <input
                type="text"
                name="brand"
                placeholder="Brand Name"
                value={productData.brand}
                className="w-full p-2 rounded border focus:outline-themegreen"
                onChange={handleProductData}
              />
            </div>

            <div>
              <label htmlFor="category">Category:</label>
              <input
                name="category"
                placeholder="Category"
                className="w-full p-2 rounded border focus:outline-themegreen"
                value={productData.category}
                onChange={handleProductData}
              />
            </div>

            <div>
              <label htmlFor="description">Description:</label>
              <textarea
                name="description"
                placeholder="Product Description"
                className="w-full p-2 rounded border focus:outline-themegreen"
                value={productData.description}
                onChange={handleProductData}
              />
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1">
                <label>Price:</label>
                <input
                  type="number"
                  name="price"
                  placeholder="Price"
                  className="w-full p-2 rounded border focus:outline-themegreen"
                  value={productData.price}
                  onChange={handleProductData}
                />
              </div>
              <div className="flex-1">
                <label>Discount(%):</label>
                <input
                  type="number"
                  name="discountPercentage"
                  placeholder="Discount"
                  className="w-full p-2 rounded border focus:outline-themegreen"
                  value={productData.discountPercentage}
                  onChange={handleProductData}
                />
              </div>
              <div className="flex-1">
                <label>Stock:</label>
                <input
                  type="number"
                  name="stock"
                  placeholder="Stock"
                  className="w-full p-2 rounded border focus:outline-themegreen"
                  value={productData.stock}
                  onChange={handleProductData}
                />
              </div>
            </div>

            {/* Tags */}
            <div>
              <label>Edit Tags:</label>
              <div className="flex flex-wrap items-center gap-2">
                <input
                  type="text"
                  value={tagsValue}
                  onChange={(e) => setTagValue(e.target.value)}
                  maxLength={10}
                  placeholder="Tags"
                  className="flex-1 p-2 rounded border focus:outline-themegreen"
                />
                <button type="button" onClick={addTags}>
                  <FaPlusCircle className="text-2xl text-themegreen cursor-pointer" />
                </button>
              </div>
              <div className="flex flex-wrap gap-2 mt-2">
                {tags?.map((item, idx) => (
                  <span
                    key={idx}
                    className="flex items-center bg-gray-500 text-white px-2 py-1 rounded"
                  >
                    {item.startsWith("#") ? item : `#${item}`}
                    <button
                      type="button"
                      onClick={() => setTags(tags.filter((t) => t !== item))}
                      className="ml-2 hover:text-red-500 cursor-pointer"
                    >
                      <ImCross />
                    </button>
                  </span>
                ))}
              </div>
            </div>

            {/* SKU */}
            <div>
              <label>SKU:</label>
              <input
                type="text"
                name="sku"
                placeholder="SKU"
                value={productData.sku}
                className={`w-full p-2 rounded border ${
                  !validsku
                    ? "focus:outline-red-500"
                    : "focus:outline-themegreen"
                } uppercase`}
                onChange={(e) => {
                  const input = e.target.value.toUpperCase();
                  const isValid = /^[A-Z0-9-]*$/.test(input);
                  setValidsku(isValid);
                  if (isValid) setProductData({ ...productData, sku: input });
                }}
              />
            </div>

            <div>
              <label>Shipping Info:</label>
              <input
                type="text"
                name="shippingInformation"
                value={productData.shippingInformation}
                className="w-full p-2 rounded border focus:outline-themegreen"
                onChange={handleProductData}
              />
            </div>

            <div>
              <label>Return Policy:</label>
              <input
                type="text"
                name="returnPolicy"
                value={productData.returnPolicy}
                className="w-full p-2 rounded border focus:outline-themegreen"
                onChange={handleProductData}
              />
            </div>

            {/* Image Upload */}
            <div>
              <label>Product Images (Max 5):</label>
              <div className="relative mt-2">
                <input
                  key={inputKey}
                  type="file"
                  accept="image/*"
                  multiple
                  className="absolute inset-0 opacity-0 cursor-pointer z-10"
                  onChange={handleUploadImages}
                />
                <div className="flex items-center justify-center gap-2 px-4 py-2 bg-gray-500 text-white rounded shadow cursor-pointer">
                  <FaUpload className="text-lg" />
                  <span>Add More Images</span>
                </div>
              </div>

              <div className="flex flex-wrap gap-5 mt-4">
                {/* Existing Images from DB */}
                {existingImages.map((img, idx) => (
                  <div
                    key={`old-${idx}`}
                    className="relative w-[120px] h-[150px] border border-gray-500 rounded p-1 bg-gray-100"
                  >
                    <img
                      src={img.displayPath}
                      alt="product"
                      className="object-contain w-full h-full"
                    />
                    <button
                      type="button"
                      onClick={() => removeExistingImage(img)}
                      className="absolute top-[-8px] right-[-8px] text-white cursor-pointer border rounded-full p-1 bg-red-500"
                    >
                      <ImCross />
                    </button>
                  </div>
                ))}

                {/* New Uploaded Images */}
                {newImagePreviews.map((img, idx) => (
                  <div
                    key={`new-${idx}`}
                    className="relative w-[120px] h-[150px] border border-green-500 rounded p-1 bg-green-50"
                  >
                    <img
                      src={img}
                      alt="product-new"
                      className="object-contain w-full h-full"
                    />
                    <button
                      type="button"
                      onClick={() => removeNewImage(idx)}
                      className="absolute top-[-8px] right-[-8px] text-white cursor-pointer border rounded-full p-1 bg-red-500"
                    >
                      <ImCross />
                    </button>
                  </div>
                ))}
              </div>
            </div>

            <button
              type="button"
              className="text-center w-full bg-themegreen py-2 rounded text-white font-semibold transition hover:scale-[1.02] cursor-pointer active:scale-[0.98] mt-4"
              onClick={handleUpdatingProduct}
            >
              Update Product
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditProduct;
