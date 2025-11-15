import React, { useContext, useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { AuthContext } from "../context/AuthProvider";
import { toast, Bounce } from "react-toastify";
import Header from "../components/Header";
import api from "../api/axios";

const STATUS_COLOR = {
  pending: "bg-yellow-500",
  cancelled: "bg-red-500",
  completed: "bg-green-500",
};

export default function Orders() {
  const { authUser } = useContext(AuthContext);
  const [page, setPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(8);

  // Fetch orders with pagination
  const { data, isLoading, refetch } = useQuery({
    queryKey: ["orders", page, rowsPerPage],
    queryFn: async () => {
      const res = await api.get("/order/getOrder", {
        params: { page, limit: rowsPerPage },
      });
      return res.data;
    },
    enabled: !!authUser,
  });

  // Delete order mutation
  const mutation = useMutation({
    mutationFn: async (orderId) => {
      const res = await api.delete(`/order/${orderId}`);
      return res.data;
    },

    onSuccess: (data) => {
      toast.success(data.message, { transition: Bounce });
      refetch();
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || "Delete failed");
    },
  });

  const handleChangePage = (newPage) => {
    if (
      newPage >= 1 &&
      newPage <= Math.ceil((data?.data?.total ?? 1) / rowsPerPage)
    ) {
      setPage(newPage);
    }
  };

  const handleChangeRowsPerPage = (e) => {
    setRowsPerPage(parseInt(e.target.value, 10));
    setPage(1);
  };

  if (!authUser) {
    return (
      <>
        <Header />
        <div className="container mx-auto p-6 text-center">
          <p>Please log in to view your orders.</p>
        </div>
      </>
    );
  }

  return (
    <>
      <Header />
      <div className="container mx-auto p-6">
        <h1 className="text-2xl font-semibold mb-4">Your Orders</h1>
        <div className="overflow-x-auto bg-white shadow-md rounded-lg p-4">
          <table className="min-w-full border border-gray-200">
            <thead>
              <tr className="bg-gray-100 text-gray-700">
                <th className="py-2 px-4 text-left border-b">S.No</th>
                <th className="py-2 px-4 text-left border-b">Order ID</th>
                <th className="py-2 px-4 text-left border-b">Total Price</th>
                <th className="py-2 px-4 text-left border-b">Status</th>
                <th className="py-2 px-4 text-left border-b">Products</th>
                <th className="py-2 px-4 text-left border-b">Action</th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                Array(rowsPerPage)
                  .fill(null)
                  .map((_, idx) => (
                    <tr key={idx}>
                      <td colSpan="6" className="py-4 px-4">
                        <div className="h-5 bg-gray-200 rounded animate-pulse"></div>
                      </td>
                    </tr>
                  ))
              ) : data?.data?.data?.length > 0 ? (
                data.data.data.map((order, index) => (
                  <tr key={order._id} className="hover:bg-gray-50">
                    <td className="py-2 px-4 border-b">
                      {(page - 1) * rowsPerPage + index + 1}
                    </td>
                    <td className="py-2 px-4 border-b break-all">
                      {order._id}
                    </td>
                    <td className="py-2 px-4 border-b">
                      ${order.totalPrice.toFixed(2)}
                    </td>
                    <td className="py-2 px-4 border-b">
                      <span
                        className={`text-white py-1 px-2 rounded-full text-sm ${
                          STATUS_COLOR[order.status]
                        }`}
                      >
                        {order.status}
                      </span>
                    </td>
                    <td className="py-2 px-4 border-b max-w-xs">
                      <ul className="list-disc pl-5 max-h-24 overflow-auto">
                        {order.products.map(({ product, quantity }, idx) => (
                          <li key={product._id + "-" + idx}>
                            {product.name} × {quantity}
                          </li>
                        ))}
                      </ul>
                    </td>
                    <td className="py-2 px-4 border-b">
                      <button
                        onClick={() => mutation.mutate(order._id)}
                        className="bg-red-600 px-3 py-1 rounded text-white hover:bg-red-700"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" className="text-center py-4">
                    No orders found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="flex items-center justify-between mt-4">
          <div>
            <label className="text-gray-700">
              Rows per page:
              <select
                className="ml-2 border border-gray-300 rounded-md p-1"
                value={rowsPerPage}
                onChange={handleChangeRowsPerPage}
              >
                {[8, 16, 24].map((size) => (
                  <option key={size} value={size}>
                    {size}
                  </option>
                ))}
              </select>
            </label>
          </div>
          <div>
            <span className="text-gray-700 mr-2">
              Page {page} of {Math.ceil((data?.data?.total ?? 1) / rowsPerPage)}
            </span>
            <button
              onClick={() => handleChangePage(page - 1)}
              disabled={page === 1}
              className="p-2 border border-gray-300 rounded-l-md text-gray-700 hover:bg-gray-100 disabled:text-gray-300"
            >
              Prev
            </button>
            <button
              onClick={() => handleChangePage(page + 1)}
              disabled={
                page === Math.ceil((data?.data?.total ?? 1) / rowsPerPage)
              }
              className="p-2 border border-gray-300 rounded-r-md text-gray-700 hover:bg-gray-100 disabled:text-gray-300"
            >
              Next
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
