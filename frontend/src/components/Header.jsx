import React from "react";
import { Link } from "react-router-dom";
import { Search } from "lucide-react";

export default function Header() {
  return (
    <header className="bg-white shadow-md sticky top-0 z-50">
      <nav className="flex items-center justify-between px-8 py-4">
        {/* Left: Logo + Links */}
        <div className="flex items-center space-x-8">
          <h1 className="text-2xl font-bold text-blue-600">Sports Center</h1>
          <div className="hidden md:flex space-x-6 font-medium text-gray-700">
            <Link to="/" className="hover:text-blue-600">
              Home
            </Link>
            <Link to="/products" className="hover:text-blue-600">
              Products
            </Link>
            <Link to="/about" className="hover:text-blue-600">
              About
            </Link>
          </div>
        </div>

        {/* Middle: Search bar */}
        <div className="flex items-center bg-gray-100 px-3 py-1 rounded-lg w-1/3">
          <Search className="text-gray-500" />
          <input
            type="text"
            placeholder="Search products..."
            className="w-full bg-transparent outline-none px-2"
          />
        </div>

        {/* Right: Sign In / Register */}
        <div className="flex items-center space-x-4">
          <Link
            to="/login"
            className="px-4 py-2 border border-blue-600 text-blue-600 rounded-lg hover:bg-blue-600 hover:text-white transition"
          >
            Sign In
          </Link>
          <Link
            to="/register"
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
          >
            Register
          </Link>
        </div>
      </nav>
    </header>
  );
}
