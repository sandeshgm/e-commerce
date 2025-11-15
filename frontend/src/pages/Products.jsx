import { useState } from "react";
import ProductCard from "../components/ProductCard";
import { useQuery } from "@tanstack/react-query";
import api from "../api/axios";
import Header from "../components/Header";  // import your header here
import { useNavigate } from "react-router-dom";

const Products = () => {
  const [page, setPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(8);
  const [order, setOrder] = useState("");
  const [search, setSearch] = useState("");
  const navigate = useNavigate();

  // Handle page and sort changes
  const handlePageChange = (newPage) => {
    setPage(newPage);
  };

  const handleRowsChange = (e) => {
    setRowsPerPage(Number(e.target.value));
    setPage(1);
  };

  const handleOrderChange = (e) => {
    setOrder(e.target.value);
    setPage(1);
  };

  const handleSearchChange = (e) => {
    setSearch(e.target.value);
    setPage(1);
  };

  // Fetch products
  const { data, isLoading } = useQuery({
    queryKey: ["products", { order, page, rowsPerPage, search }],
    queryFn: async () => {
      const res = await api.get("/products", {
        params: {
          order,
          page,
          limit: rowsPerPage,
          search,
        },
      });
      return res.data;
    },
  });

  const totalPages = data ? Math.ceil(data.total / rowsPerPage) : 0;

  // Loader component
  const Loader = () => (
    <div className="animate-pulse space-y-4">
      <div className="w-full h-60 bg-gray-300 rounded-lg"></div>
      <div className="h-4 bg-gray-300 rounded w-3/4"></div>
      <div className="h-4 bg-gray-300 rounded w-1/2"></div>
    </div>
  );

  return (
    <>
      {/* Add Header here */}
      <Header />

      <div className="container mx-auto px-4 py-6 bg-blue-50">
        {/* Top Bar */}
        <div className="w-full bg-gray-300 border-b border-gray-400 shadow-lg py-6 px-8">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-6">
            {/* Remove the Home Button here */}

            {/* Search bar */}
            <div className="w-full sm:w-1/2">
              <label
                htmlFor="search"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Search
              </label>
              <input
                id="search"
                type="text"
                value={search}
                onChange={handleSearchChange}
                placeholder="Search products..."
                className="w-full p-3 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            {/* Sort dropdown */}
            <div className="w-full sm:w-1/3">
              <label
                htmlFor="order"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Sort By
              </label>
              <select
                id="order"
                value={order}
                onChange={handleOrderChange}
                className="w-full p-3 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-indigo-500"
              >
                <option value="">None</option>
                <option value="asc">Price: Low → High</option>
                <option value="desc">Price: High → Low</option>
              </select>
            </div>
          </div>
        </div>

        {/* Product grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 bg-blue-200">
          {isLoading ? (
            Array.from({ length: rowsPerPage }).map((_, i) => (
              <div key={i} className="w-full max-w-xs mx-auto">
                <Loader />
              </div>
            ))
          ) : data?.products?.length > 0 ? (
            data.products.map((product) => (
              <div key={product._id} className="w-full max-w-xs mx-auto">
                <ProductCard product={product} />
              </div>
            ))
          ) : (
            <p className="text-center text-gray-600 col-span-full">
              No products found.
            </p>
          )}
        </div>

        {/* Pagination */}
        <div className="mt-8 flex flex-col sm:flex-row justify-between items-center gap-4">
          <div>
            <span className="text-gray-600">
              Total: {data?.total ?? 0} Products
            </span>
          </div>

          {/* Page numbers */}
          <div className="flex items-center space-x-2">
            <button
              onClick={() => handlePageChange(page - 1)}
              disabled={page === 1}
              className={`px-3 py-1 border rounded-md ${
                page === 1
                  ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                  : "bg-white hover:bg-gray-100"
              }`}
            >
              Prev
            </button>

            {Array.from({ length: totalPages }, (_, i) => (
              <button
                key={i + 1}
                onClick={() => handlePageChange(i + 1)}
                className={`px-3 py-1 border rounded-md ${
                  page === i + 1
                    ? "bg-indigo-500 text-white"
                    : "bg-white hover:bg-gray-100"
                }`}
              >
                {i + 1}
              </button>
            ))}

            <button
              onClick={() => handlePageChange(page + 1)}
              disabled={page === totalPages}
              className={`px-3 py-1 border rounded-md ${
                page === totalPages
                  ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                  : "bg-white hover:bg-gray-100"
              }`}
            >
              Next
            </button>
          </div>

          {/* Rows per page */}
          <select
            value={rowsPerPage}
            onChange={handleRowsChange}
            className="p-2 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-indigo-500"
          >
            <option value={8}>8</option>
            <option value={12}>12</option>
            <option value={16}>16</option>
          </select>
        </div>
      </div>
    </>
  );
};

export default Products;
