import { useParams, Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import api from "../api/axios";

export default function ProductDetails() {
  const { id } = useParams();

  const { data, isLoading, error } = useQuery({
    queryKey: ["product", id],
    queryFn: async () => {
      const res = await api.get(`/products/${id}`);
      return res.data;
    },
  });

  if (isLoading)
    return (
      <div className="flex justify-center items-center h-96">
        <p className="text-gray-600 text-lg animate-pulse">
          Loading product details...
        </p>
      </div>
    );

  if (error || !data)
    return (
      <div className="flex justify-center items-center h-96">
        <p className="text-red-600 text-lg">Product not found.</p>
      </div>
    );

  const product = data.product;

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Back button */}
      <div className="mb-6">
        <Link
          to="/products"
          className="inline-block bg-indigo-600 text-white px-5 py-2 rounded-lg hover:bg-indigo-700 transition"
        >
          ← Back to Products
        </Link>
      </div>

      <div className="bg-white shadow-lg rounded-xl p-6 flex flex-col lg:flex-row gap-8">
        {/* Image */}
        <div className="w-full lg:w-1/2 flex justify-center">
          <img
            src={`http://localhost:3007/productsImage/${product?.image}`}
            alt={product.name}
            className="rounded-lg shadow-md w-full max-w-md object-cover"
          />
        </div>

        {/* Details */}
        <div className="w-full lg:w-1/2">
          <h1 className="text-3xl font-bold text-gray-800 mb-3">
            {product.name}
          </h1>
          <p className="text-2xl font-semibold text-red-600 mb-4">
            ${product.price}
          </p>

          <p className="text-gray-700 mb-6 leading-relaxed">
            {product.description || "No description available."}
          </p>

          <div className="mt-6">
            <button className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition font-medium">
              Add to Cart
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
