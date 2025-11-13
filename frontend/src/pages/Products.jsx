import { useState } from "react";
import ProductCard from "../components/ProductCard";
import { useQuery } from "@tanstack/react-query";
import api from "../api/axios";

const Products = () => {
  const [page, setPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(4);
  const [order, setOrder] = useState("");

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

  // Fetch products
  const { data, isLoading } = useQuery({
    queryKey: ["products", { order, page, rowsPerPage }],
    queryFn: async () => {
      const res = await api.get("/products", {
        params: {
          order,
          page,
          limit: rowsPerPage,
        },
      });
      return res.data;
    },
  });

  const totalPages = data ? Math.ceil(data.total / rowsPerPage) : 0;

  // Simple skeleton loader (custom)
  const Loader = () => (
    <div className="animate-pulse space-y-4">
      <div className="w-full h-60 bg-gray-300 rounded-lg"></div>
      <div className="h-4 bg-gray-300 rounded w-3/4"></div>
      <div className="h-4 bg-gray-300 rounded w-1/2"></div>
    </div>
  );

  return (
    <div className="container mx-auto px-4 py-6">
      {/* Sort dropdown */}
      <div className="mb-6">
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
          className="w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-indigo-500"
        >
          <option value="">None</option>
          <option value="asc">Price: Low → High</option>
          <option value="desc">Price: High → Low</option>
        </select>
      </div>

      {/* Product grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
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
          <option value={4}>4</option>
          <option value={8}>8</option>
          <option value={12}>12</option>
        </select>
      </div>
    </div>
  );
};

export default Products;
