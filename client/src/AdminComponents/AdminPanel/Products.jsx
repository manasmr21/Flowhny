import {  useState } from "react";
import useStore from "../../components/Store/Store";
import { FaTrash, FaEdit } from "react-icons/fa";

const Products = () => {
  const { allProducts } = useStore();
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [deleteProducts, setDeleteProducts] = useState([]);
  const productsPerPage = 10;

  const filteredProducts = allProducts.filter(
    (product) =>
      product.title.toLowerCase().includes(search.toLowerCase()) ||
      product.sku.includes(search)
  );

  const selectAllProduct = (e) => {
    if (deleteProducts.length !== filteredProducts.length && e.target.checked) { 
      setDeleteProducts([...filteredProducts]);
    } else {
      setDeleteProducts([]);
    }
  };

  const addToDeleteProductList = (product) => {
    const checkProductExist = deleteProducts.filter(
      (item) => item.id === product.id
    );

    if (checkProductExist.length > 0) {
      const updatedList = deleteProducts.filter(
        (item) => item.id !== product.id
      );
      setDeleteProducts(updatedList);
    } else {
      // Add the product
      setDeleteProducts([...deleteProducts, product]);
    }
  };

  const checkProductSelected = (product) => {
    const checkProductExist = deleteProducts.filter(
      (item) => item.id === product.id
    );

    if (checkProductExist.length > 0) {
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

  return (
    <div className="w-full px-4 py-6">
      {/* Search bar */}
      <div className="mb-4 flex justify-end">
        <div className="w-full sm:w-[50%] md:w-[30%]">
          <input
            type="text"
            placeholder="Search for products"
            className="w-full p-2 border rounded shadow-sm focus:outline-none bg-white"
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      {/* Scrollable Table */}
      <div className="overflow-x-auto">
        <table className="min-w-[800px] w-full border border-gray-300 text-sm text-left">
          <thead className="bg-gray-700 text-white text-center">
            <tr>
              <th className="p-3 border border-gray-300 text-center">
                <input
                  type="checkbox"
                  className="cursor-pointer"
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
                <td className="p-2 border border-gray-300">
                  <input
                    type="checkbox"
                    checked={checkProductSelected(product)}
                    onChange={() => addToDeleteProductList(product)}
                  />
                </td>
                <td className="p-2 border border-gray-300">
                  <img
                    src={product.thumbnail}
                    alt={product.title}
                    className="w-16 h-16 object-cover mx-auto"
                  />
                </td>
                <td className="p-2 border border-gray-300">{product.title}</td>
                <td className="p-2 border border-gray-300">{product.sku}</td>
                <td className="p-2 border border-gray-300">${product.price}</td>
                <td className="p-2 border border-gray-300">{product.stock}</td>
                <td className="p-2 border border-gray-300">
                  {product.updatedAt || "20/07/2025"}
                </td>
                <td className="p-2 border border-gray-300">
                  <div className="flex items-center justify-center gap-3">
                    <button className="text-red-600 cursor-pointer hover:text-red-800">
                      <FaTrash />
                    </button>
                    <button className="text-blue-600 cursor-pointer hover:text-blue-800">
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
    </div>
  );
};

export default Products;
