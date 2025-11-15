import React from "react";
import { Link } from "react-router-dom";

export default function ProductCard({ product }) {
  return (
    <div className="bg-gray-200 rounded-xl shadow-md hover:shadow-xl transition duration-300 p-4 flex flex-col items-center">
      <Link to={`/products/${product._id}`} className="w-full text-center">
        <img
          src={`http://localhost:3007/productsImage/${product?.image}`}
          alt={product.name}
          className="w-full h-56 object-cover rounded-lg mb-4"
        />
      </Link>

      <h3 className="text-3xl font-semibold text-black hover:text-gray-600 transition cursor-pointer">
        {product.name}
      </h3>
      <p className="text-orange-600 text-md font-medium mt-1 hover:cursor-pointer">${product.price}</p>
    </div>
  );
}
