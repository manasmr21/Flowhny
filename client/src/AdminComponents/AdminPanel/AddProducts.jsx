import { useRef, useState } from "react";
import { FaPlusCircle, FaUpload } from "react-icons/fa";
import { ImCross } from "react-icons/im";
import adminApis from "../../components/Store/adminApi";

const AddProducts = () => {
  const [thumbnail, setThumbnail] = useState(null);
  const [previewImage, setPreviewImage] = useState(null);
  const imgRef = useRef(null);
  const [tags, setTags] = useState([]);
  const [tagsValue, setTagValue] = useState("");
  const [images, setImages] = useState([]);
  const [showProductImage, setShowProductImage] = useState([]);
  const [inputKey, setInputKey] = useState(Date.now());
  const [validsku, setValidsku] = useState(true);
  const [productData, setProductData] = useState({
    title: "",
    description: "",
    category: "",
    discountPercentage: null,
    price: null,
    stock: null,
    tags: tags,
    sku: "",
    shippingInformation: "",
    returnPolicy: "",
  });

  const { addProduct } = adminApis();

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
    const file = e.target.files;

    const totalImageCount = Array.from(file).length + images.length;

    if (totalImageCount > 5) {
      alert("you cannot add more than 5 images");
      e.target.value = null;
      return;
    }

    if (file.length > 0) {
      const imgUrl = Array.from(file).map((img) => URL.createObjectURL(img));
      setImages((prev) => [...prev, ...imgUrl]);
      setShowProductImage((prev) => [...prev, ...file]);
    }
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

  const handleAddingProduct = async (e) => {
    e.preventDefault();

    const formData = new FormData();

    if (thumbnail) formData.append("thumbnail", thumbnail);
    if (images && images.length) {
      showProductImage.forEach((img) => {
        formData.append("images", img);
      });
    }

    Object.entries(productData).forEach(([key, value]) => {
      if (key === "tags") {
        return;
      } else {
        formData.append(key, value);
      }
    });

    if (tags.length > 0) {
      tags.forEach((tags) => {
        formData.append("tags", tags);
      });
    }

    try {
      const response = await addProduct(formData);

      if (response.success) {
        alert("Product Added successfully");
        setProductData({
          title: "",
          description: "",
          price: "",
          stock: "",
          tags: [],
          discountPercentage: "",
          sku: "",
          shippingInformation: "",
          returnPolicy: "",
          images: [],
          brand: "",
          category: "",
        });

        setImages([]);
        setShowProductImage([]);
        setTags([]);
        setTagValue("");
        setThumbnail(null);
        setPreviewImage(null);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleProductData = (e) => {
    const { name, value } = e.target;

    setProductData({
      ...productData,
      [name]: value,
    });
  };

  return (
    <>
      <div className=" addProducts w-[95%] md:w-[75%] lg:w-[50%] mx-auto p-4 text-gray-900 dark:text-gray-300">
        {/* Thumbnail Upload */}
        <div className="flex flex-col items-center">
          <input
            type="file"
            accept="image/png"
            className="hidden"
            ref={imgRef}
            onChange={handleThumbnailUpload}
            name="thumbnail"
          />

          <div className="border relative border-gray-500 dark:border-white w-48 h-60 flex justify-center items-center">
            {previewImage ? (
              <img
                src={previewImage}
                className=" object-contain h-full w-full"
              />
            ) : (
              <button type="button" onClick={clickRef} className="">
                <FaPlusCircle className="text-5xl text-gray-500 cursor-pointer" />
              </button>
            )}

            <div>
              <button className={`bg-red-600 cursor-pointer p-1 ${!previewImage && "hidden" } top-[-3%] right-[-5%] rounded-2xl border border-white absolute`}
                onClick={()=> setPreviewImage(null)}
              >
                <ImCross/>
              </button>
            </div>

          </div>
        </div>
        {/* Product Form */}
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
              <label htmlFor="price">Price:</label>
              <input
                type="number"
                name="price"
                placeholder="Price"
                className="w-full p-2 rounded border focus:outline-themegreen"
                value={productData.price}
                onChange={(e) => {
                  setProductData((prev) => ({
                    ...prev,
                    price: parseInt(e.target.value),
                  }));
                }}
              />
            </div>
            <div className="flex-1">
              <label htmlFor="price">Discount(%):</label>
              <input
                type="number"
                name="price"
                placeholder="Price"
                className="w-full p-2 rounded border focus:outline-themegreen"
                value={productData.discountPercentage}
                onChange={(e) => {
                  setProductData((prev) => ({
                    ...prev,
                    discountPercentage: parseInt(e.target.value),
                  }));
                }}
              />
            </div>

            <div className="flex-1">
              <label htmlFor="stock">Quantity in Stock:</label>
              <input
                type="number"
                name="stock"
                placeholder="Stock"
                className="w-full p-2 rounded border focus:outline-themegreen"
                value={productData.stock}
                onChange={(e) =>
                  setProductData((prev) => ({
                    ...prev,
                    stock: parseInt(e.target.value),
                  }))
                }
              />
            </div>
          </div>

          <div>
            <label htmlFor="tags">Add Tags:</label>
              <div className="flex flex-wrap items-center gap-2">
                <input
                  type="text"
                  name="tags"
                  value={tagsValue}
                  onChange={(e) => setTagValue(e.target.value)}
                  maxLength={10}
                  placeholder="Tags"
                  className="flex-1 p-2 rounded border focus:outline-themegreen"
                />
                <button
                  type="button"
                  onClick={addTags}
                >
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
                    onClick={(e) => {
                      e.preventDefault();
                      setTags(tags.filter((t) => t !== item));
                    }}
                    className="ml-2 hover:text-red-500 cursor-pointer"
                  >
                    <ImCross />
                  </button>
                </span>
              ))}
            </div>
          </div>

          <div>
            <label htmlFor="sku">Stock Keeping Unit (SKU):</label>
            <input
              type="text"
              name="sku"
              placeholder="SKU"
              value={productData.sku.toUpperCase()}
              className={`w-full p-2 rounded border ${
                !validsku ? "focus:outline-red-500" : "focus:outline-themegreen"
              }  uppercase`}
              onChange={(e) => {
                const input = e.target.value.toUpperCase();
                const isValid = /^[A-Z0-9-]*$/.test(input);
                if (isValid) {
                  setValidsku(true);
                  setProductData((prev) => ({ ...prev, sku: input }));
                } else {
                  setValidsku(false);
                }
              }}
            />
          </div>

          <div>
            <label htmlFor="shippingInformation">
              Shipping Information (days):
            </label>
            <input
              type="text"
              name="shippingInformation"
              placeholder="Shipping information"
              value={productData.shippingInformation}
              className="w-full p-2 rounded border focus:outline-themegreen"
              onChange={handleProductData}
            />
          </div>

          <div>
            <label htmlFor="returnPolicy">Return Policy:</label>
            <input
              type="text"
              name="returnPolicy"
              placeholder="Return Policy"
              value={productData.returnPolicy}
              className="w-full p-2 rounded border focus:outline-themegreen"
              onChange={handleProductData}
            />
          </div>

          {/* Image Upload */}
          <div>
            <label htmlFor="images">Upload Product Images:</label>
            <div className="relative mt-2">
              <input
                key={inputKey}
                type="file"
                accept="image"
                multiple
                name="images"
                className="absolute inset-0 opacity-0 cursor-pointer z-10"
                onChange={handleUploadImages}
              />
              <div className="flex items-center justify-center gap-2 px-4 py-2 bg-gray-500 text-white rounded shadow cursor-pointer">
                <FaUpload className="text-lg" />
                <span>Choose Images</span>
              </div>
            </div>
            <div className="flex flex-wrap gap-5 mt-4">
              {images?.map((img, idx) => (
                <div
                  key={idx}
                  className="relative w-[120px] h-[150px] border border-gray-500 rounded"
                >
                  <img
                    src={img}
                    alt="product"
                    className="object-contain w-full h-full"
                  />
                  <button
                    type="button"
                    onClick={(e) => {
                      e.preventDefault();
                      setImages((prevImages) =>
                        prevImages.filter((url) => url !== img)
                      );
                      console.log(images);
                    }}
                    className="absolute top-[-8px] right-[-8px] text-white cursor-pointer border  rounded-full p-1 bg-red-500 "
                  >
                    <ImCross />
                  </button>
                </div>
              ))}
            </div>
          </div>

          <button
            type="button"
            className="text-center w-full bg-themegreen py-2 rounded text-white font-semibold transition hover:scale-[1.02] cursor-pointer active:scale-[0.98]"
            onClick={handleAddingProduct}
          >
            Add Product
          </button>
        </div>
      </div>
    </>
  );
};

export default AddProducts;
