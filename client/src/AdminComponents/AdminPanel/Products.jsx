import { useState } from "react";
import useStore from "../../components/Store/Store";
import { FaTrash, FaEdit } from "react-icons/fa";
import adminApis from "../../components/Store/adminApi";
import noProductIcon from "../../assets/noProducts.png";
import { NavLink } from "react-router-dom";
import EditProduct from "./EditProduct";

const Products = () => {
  const { allProducts } = useStore();
  const { removeProducts } = adminApis();
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [edit, setEdit] = useState(false);
  const [deleteProducts, setDeleteProducts] = useState([]);
  const [editProduct, setEditProduct] = useState(null);
  const [openEdit, setOpenEdit] = useState(false);
  const productsPerPage = 10;

  const filteredProducts = allProducts?.filter(
    (product) =>
      product?.title.toLowerCase().includes(search.toLowerCase()) ||
      product?.sku.includes(search)
  );

  const onClose = ()=>{
    setOpenEdit(!openEdit)
  }

  const selectAllProduct = (e) => {
    if (deleteProducts.length !== filteredProducts.length && e.target.checked) {
      setDeleteProducts([...filteredProducts]);
    } else {
      setDeleteProducts([]);
    }
  };

  const addToDeleteProductList = (product) => {
    const checkProductExist = deleteProducts.filter(
      (item) => item.productID === product?.productID
    );

    if (checkProductExist.length > 0) {
      const updatedList = deleteProducts.filter(
        (item) => item.productID !== product?.productID
      );

      console.log(deleteProducts);
      setDeleteProducts(updatedList);
    } else {
      // Add the product
      setDeleteProducts([...deleteProducts, product]);
    }
  };

  const checkProductSelected = (product) => {
    const checkProductExist = deleteProducts.filter(
      (item) => item.productID === product?.productID
    );

    if (checkProductExist?.length > 0) {
      return true;
    } else {
      return false;
    }
  };

  const totalPages = Math.ceil(filteredProducts.length / productsPerPage);
  const start = (currentPage - 1) * productsPerPage;
  const end = start + productsPerPage;
  const visibleProducts = filteredProducts.slice(start, end);

  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  const getPageNumbers = () => {
    const pages = [];
    pages.push(1);

    const startPage = Math.max(currentPage - 1, 2);
    const endPage = Math.min(currentPage + 2, totalPages - 1);

    if (startPage > 2) pages.push("...");

    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }

    if (endPage < totalPages - 1) pages.push("...");

    if (totalPages > 1) pages.push(totalPages);

    return pages;
  };

  // Edit products APIs
  const handleDeletingProducts = async () => {
    try {
      const response = await removeProducts(deleteProducts);

      alert(response?.message);
    } catch (error) {
      console.log(error.message);
    }
  };

  if (!allProducts) {
    return <div>Loading...</div>;
  }

  if (allProducts?.length == 0) {
    return (
      <>
        <div className="m-auto text-themegreen text-center">
          <img className="m-auto" src={noProductIcon} />
          <p className="font-semibold text-2xl">
            No products to show.{" "}
            <NavLink className="hover:underline" to="/admin/addProduct">
              Add some products
            </NavLink>{" "}
          </p>
        </div>
      </>
    );
  }

  return (
    <div className="w-full px-4 py-6 grid">
      {/* Search bar */}
      <div className="mb-4 w-full flex justify-end gap-4">
        <div className="">
          <button
            className="bg-themegreen hover:bg-transparent transition align-middle cursor-pointer hover:text-themegreen border text-md h-10 px-5 border-themegreen text-white rounded"
            onClick={() => {
              setEdit(!edit);
              setDeleteProducts([]);
            }}
          >
            {edit ? "Cancel" : "Edit"}
          </button>
          <button
            className={` bg-red-600 hover:scale-[110%] active:scale-[95%] transition cursor-pointer text-md h-10 border border-red-600 px-3 mx-3 align-middle text-white rounded ${
              !deleteProducts.length > 0 && "hidden"
            } `}
            onClick={handleDeletingProducts}
          >
            <FaTrash />
          </button>
        </div>
        <div className="w-[60%] sm:w-[50%] md:w-[30%]">
          <input
            type="text"
            placeholder="Search for products"
            className="w-full p-2 border rounded shadow-sm focus:outline-none bg-white"
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      {/* Scrollable Table */}
      <div className="overflow-x-auto grid place-items-end">
        <table className="min-w-[800px] w-[80%] border border-gray-300 text-sm text-left">
          <thead className="bg-gray-700 text-white text-center">
            <tr>
              <th
                className={`p-3 border ${
                  !edit && "hidden"
                } border-gray-300 text-center`}
              >
                <input
                  type="checkbox"
                  checked={
                    allProducts?.length > 0
                      ? deleteProducts.length == allProducts?.length
                      : false
                  }
                  onChange={selectAllProduct}
                />
              </th>
              <th className="p-3 border border-gray-300">Image</th>
              <th className="p-3 border border-gray-300">Name</th>
              <th className="p-3 border border-gray-300">SKU</th>
              <th className="p-3 border border-gray-300">Price</th>
              <th className="p-3 border border-gray-300">Stock</th>
              <th className="p-3 border border-gray-300">Updated</th>
              <th className="p-3 border border-gray-300">Actions</th>
            </tr>
          </thead>
          <tbody>
            {visibleProducts?.map((product, idx) => (
              <tr
                key={idx}
                className="text-center border-t text-sm dark:text-white border-gray-200"
              >
                <td
                  className={`p-2 border border-gray-300 ${!edit && "hidden"} `}
                >
                  <input
                    type="checkbox"
                    checked={checkProductSelected(product)}
                    onChange={() => addToDeleteProductList(product)}
                  />
                </td>
                <td className="p-2 border border-gray-300">
                  <img
                    src={product?.thumbnail?.displayPath}
                    alt={product?.title}
                    className="w-16 h-16 object-cover mx-auto"
                  />
                </td>
                <td className="p-2 border border-gray-300">{product?.title}</td>
                <td className="p-2 border border-gray-300">{product?.sku}</td>
                <td className="p-2 border border-gray-300">
                  ₹{product?.price}
                </td>
                <td className="p-2 border border-gray-300">{product?.stock}</td>
                <td className="p-2 border border-gray-300">
                  {new Date(product?.updatedAt).toLocaleString("en-IN", {
                    timeZone: "Asia/Kolkata",
                    dateStyle: "medium",
                    timeStyle: "short",
                  }) || "Dates not available"}
                </td>
                <td className="p-2 border border-gray-300">
                  <div className="flex items-center justify-center gap-3">
                    <button className="text-blue-600 cursor-pointer hover:text-blue-800" onClick={()=>{
                      setEditProduct(product)
                      onClose();
                    }}>
                      <FaEdit />
                    </button>
                    <button className="text-sm cursor-pointer dark:text-gray-200 hover:underline">
                      Details
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="pagination flex gap-2 mt-6 flex-wrap justify-center">
        <button
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className="px-3 py-1 border rounded disabled:opacity-50 cursor-pointer dark:bg-white"
        >
          Prev
        </button>

        {getPageNumbers().map((page, index) =>
          page === "..." ? (
            <span key={index} className="px-3 py-1 dark:text-white">
              ...
            </span>
          ) : (
            <button
              key={index}
              onClick={() => handlePageChange(page)}
              className={`px-3 py-1 border rounded cursor-pointer ${
                page === currentPage
                  ? "bg-themegreen text-white"
                  : "dark:bg-white"
              }`}
            >
              {page}
            </button>
          )
        )}

        <button
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="px-3 py-1 border rounded cursor-pointer disabled:opacity-50 dark:bg-white"
        >
          Next
        </button>
      </div>
      <div className={`${openEdit ? "block" : "hidden" }`}>
        <EditProduct product={editProduct} onClose={onClose} />
      </div>
    </div>
  );
};

export default Products;
