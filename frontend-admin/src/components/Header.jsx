import React, { useContext, useState, useEffect, useRef } from "react";
import { useMutation } from "@tanstack/react-query";
import { toast } from "react-toastify";
import { CartContext } from "../context/CartProvider";
import { AuthContext } from "../context/AuthProvider";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";

export default function Header() {
  const { cart } = useContext(CartContext);
  const { authUser, setAuthUser } = useContext(AuthContext);
  const navigate = useNavigate();

  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);

  // Dropdown state
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const dropdownRef = useRef(null);
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // React Query mutation for logout API call
  const logoutMutation = useMutation({
    mutationFn: async () => {
      const res = await api.post("auth/logout");
      return res.data;
    },
    onSuccess: (data) => {
      toast.success(data.message || "Logged out successfully");
      setAuthUser(null);
      setDropdownOpen(false);
      navigate("/");
    },
    onError: (error) => {
      toast.error(
        error.response?.data?.message || "Logout failed. Please try again."
      );
    },
  });

  const handleLogout = () => {
    logoutMutation.mutate();
  };

  // Protect navigation for Cart & Orders
  const handleProtectedNavigation = (e, path) => {
    e.preventDefault();
    if (!authUser) {
      navigate("/login", { state: { from: path } });
      return;
    }
    navigate(path);
  };

  return (
    <header className="bg-white shadow-md sticky top-0 z-50">
      <nav className="flex items-center px-8 py-4">
        <div>
          <h1
            className="text-2xl font-bold text-blue-600 cursor-pointer"
            onClick={() => navigate("/")}
          >
            Sports Center
          </h1>
        </div>

        <div className="flex mx-auto space-x-8 font-medium text-gray-700 items-center">
          <a href="/" className="hover:text-blue-600">
            Home
          </a>
          <a href="/products" className="hover:text-blue-600">
            Products
          </a>
          <a href="/about" className="hover:text-blue-600">
            About
          </a>

          <a
            href="/orders"
            onClick={(e) => handleProtectedNavigation(e, "/order")}
            className="hover:text-blue-600 cursor-pointer"
          >
            Orders
          </a>

          <a
            href="/cart"
            onClick={(e) => handleProtectedNavigation(e, "/cart")}
            className="relative hover:text-blue-600 cursor-pointer"
            aria-label="Cart"
          >
            {/* Cart */}
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6 inline-block"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M3 3h2l.4 2M7 13h10l4-8H5.4"
              />
              <circle cx={7} cy={21} r={1} />
              <circle cx={17} cy={21} r={1} />
            </svg>

            {totalItems > 0 && (
              <span className="absolute -top-2 -right-2 bg-red-600 text-white rounded-full text-xs w-5 h-5 flex items-center justify-center">
                {totalItems}
              </span>
            )}
          </a>
        </div>

        <div className="ml-auto relative" ref={dropdownRef}>
          {authUser ? (
            <>
              <button
                onClick={() => setDropdownOpen(!dropdownOpen)}
                aria-expanded={dropdownOpen}
                className="text-gray-700 hover:text-blue-600 font-medium"
              >
                {authUser.name || "Profile"}
              </button>
              {dropdownOpen && (
                <div className="absolute right-0 mt-2 w-32 bg-white border border-gray-200 rounded shadow-lg z-50">
                  <button
                    onClick={handleLogout}
                    disabled={logoutMutation.isLoading}
                    className="block w-full text-left px-4 py-2 text-gray-700 hover:bg-red-100"
                  >
                    {logoutMutation.isLoading ? "Logging out..." : "Logout"}
                  </button>
                </div>
              )}
            </>
          ) : (
            <button
              onClick={() => navigate("/login")}
              className="text-gray-700 hover:text-blue-600 font-medium"
            >
              Login
            </button>
          )}
        </div>
      </nav>
    </header>
  );
}
