import { useRef, useState } from "react";
import { FaPlusCircle, FaUpload } from "react-icons/fa";
import { ImCross } from "react-icons/im";
import adminApis from "../../components/Store/adminApi";

const AddProducts = () => {
  const [thumbnail, setThumbnail] = useState();
  const [fileName, setFileName] = useState("");
  const imgRef = useRef(null);
  const [tags, setTags] = useState([]);
  const [tagsValue, setTagValue] = useState("");
  const [images, setImages] = useState([]);
  const [inputKey, setInputKey] = useState(Date.now());
  const [validsku, setValidsku] = useState(true);
  const [productData, setProductData] = useState({
    title: "",
    description: "",
    category: "",
    discountPercentage: 0,
    price: 0,
    stock: 0,
    tags: tags,
    sku: "",
    shippingInformation: "",
    returnPolicy: "",
    images,
    thumbnail,
  });

  const { addProduct } = adminApis();

  const handleFileUpload = (file) => {
    if (!file) return;
    if (!file.startsWith("image/")) {
      alert("Only images are supported.");
      return;
    }
    const reader = new FileReader();
    reader.readAsDataURL(file);
    return reader;
  };

  const uploadThumbnail = (e) => {
    const file = e.target.files[0];
    const reader = handleFileUpload(file);
    if (!reader) return;
    reader.onloadend = () => {
      setThumbnail(reader.result);
      setProductData((prev) => ({ ...prev, thumbnail: reader.result }));
      setFileName(file.name);
    };
  };

  const uploadImages = (e) => {
    const files = Array.from(e.target.files);
    if (files.length + images.length > 5) {
      alert("You cannot Upload more than 5 images");
      e.target.value = "";
      setInputKey(Date.now());
      return;
    }
    files.forEach((file) => {
      const reader = handleFileUpload(file);
      if (!reader) return;
      reader.onloadend = () => {
        const newImage = {
          id: Date.now() + Math.random(),
          data: reader.result,
        };
        setImages((prev) => {
          const updatedImages = [...prev, newImage];
          setProductData((data) => ({ ...data, images: updatedImages }));
          return updatedImages;
        });
      };
    });
    setInputKey(Date.now());
  };

  const clickRef = () => {
    if (imgRef.current) imgRef.current.click();
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
    try {
      const response = await addProduct(productData);

      if (response.success) {
        alert("Product Added successfully");
        setProductData({
          title: "",
          description: "",
          price: "",
          stock: "",
          tags: [],
          sku: "",
          shippingInformation: "",
          returnPolicy: "",
          images: [],
          thumbnail: "",
        });

        setThumbnail("");
        setImages([]);
        setTags([]);
        setTagValue("");
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

  console.log(productData);

  return (
    <div className="addProducts w-[95%] md:w-[75%] lg:w-[50%] mx-auto p-4 text-gray-900 dark:text-gray-300">
      {/* Thumbnail Upload */}
      <div className="flex flex-col items-center">
        <input
          type="file"
          accept="image/png"
          className="hidden"
          ref={imgRef}
          onChange={uploadThumbnail}
        />
        <div className="border relative border-gray-500 dark:border-white w-48 h-60 flex justify-center items-center">
          {thumbnail ? (
            <>
              <img
                src={thumbnail}
                alt={fileName}
                className="object-contain w-full h-full"
              />
              <button
                className="absolute top-[-8px] right-[-8px] text-white cursor-pointer border  rounded-full p-1 bg-red-500 "
                onClick={() => {
                  setThumbnail();
                  imgRef.current.value = "";
                }}
              >
                <ImCross />
              </button>
            </>
          ) : (
            <button onClick={clickRef} className="">
              <FaPlusCircle className="text-5xl text-gray-500 cursor-pointer" />
            </button>
          )}
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

        <form>
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
            <button onClick={addTags}>
              <FaPlusCircle className="text-2xl text-themegreen cursor-pointer" />
            </button>
          </div>
          <div className="flex flex-wrap gap-2 mt-2">
            {tags.map((item, idx) => (
              <span
                key={idx}
                className="flex items-center bg-gray-500 text-white px-2 py-1 rounded"
              >
                {item.startsWith("#") ? item : `#${item}`}
                <button
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
        </form>

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
              onChange={uploadImages}
              className="absolute inset-0 opacity-0 cursor-pointer z-10"
            />
            <div className="flex items-center justify-center gap-2 px-4 py-2 bg-gray-500 text-white rounded shadow cursor-pointer">
              <FaUpload className="text-lg" />
              <span>Choose Images</span>
            </div>
          </div>
          <div className="flex flex-wrap gap-5 mt-4">
            {images.map((img) => (
              <div
                key={img.id}
                className="relative w-[120px] h-[150px] border border-gray-500 rounded"
              >
                <img
                  src={img.data}
                  alt="product"
                  className="object-contain w-full h-full"
                />
                <button
                  onClick={(e) => {
                    e.preventDefault();
                    setImages(images.filter((i) => i.id !== img.id));
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
          className="text-center w-full bg-themegreen py-2 rounded text-white font-semibold transition hover:scale-[1.02] cursor-pointer active:scale-[0.98]"
          onClick={handleAddingProduct}
        >
          Add Product
        </button>
      </div>
    </div>
  );
};

export default AddProducts;
