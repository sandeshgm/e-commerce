import React from "react";
import { Link } from "react-router-dom";

export default function ProductCard({ product }) {
  return (
    <div className="bg-white rounded-xl shadow-md hover:shadow-xl transition duration-300 p-4 flex flex-col items-center">
      <Link to={`/products/${product._id}`} className="w-full text-center">
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-56 object-cover rounded-lg mb-4"
        />
        <h3 className="text-lg font-semibold text-gray-800 hover:text-blue-600 transition">
          {product.name}
        </h3>
        <p className="text-blue-600 text-md font-medium mt-1">
          ${product.price}
        </p>
      </Link>
    </div>
  );
}
