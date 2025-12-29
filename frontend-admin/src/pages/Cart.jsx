import React, { useContext } from "react";
import { CartContext } from "../context/CartProvider";
import { useMutation } from "@tanstack/react-query";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthProvider";
import Header from "../components/Header";
import axios from "../api/axios"; // your axios instance

export default function Cart() {
  const { cart, addToCart, decrementQuantity, removeFromCart, clearCart } =
    useContext(CartContext);
  const { authUser, token } = useContext(AuthContext); 
  const navigate = useNavigate();


  console.log("Auth User", authUser);
  console.log("Token", token);

  
  const mutation = useMutation({
    mutationFn: async (products) => {
      console.log("Sending order to backend...", products);

      // Send token in Authorization header as Bearer token
      const res = await axios.post(
        "/order/createOrder",
        { products },
        {
          headers: {
            Authorization: `Bearer ${token}`, 
          },
          withCredentials: true, 
        }
      );

      console.log("Response from backend:", res.data);
      return res.data;
    },
    onSuccess: (data) => {
      console.log("Order success:", data);
      toast.success(data.message);
      clearCart();

      // Redirect after short delay
      setTimeout(() => {
        navigate("/order");
      }, 300);

      if (data.url) {
        // Redirect to payment gateway if URL provided
        window.location.href = data.url;
      }
    },
    onError: (error) => {
      console.error("Order error:", error);
      toast.error(
        error.response?.data?.message ||
          "Order creation failed. Please try again."
      );
    },
  });

  const handleOrder = () => {
    console.log("handleOrder clicked, authUser:", authUser, "cart:", cart);

    if (!authUser || !token) {
      toast.error("Please login first.");
      navigate("/login");
      return;
    }

    if (cart.length === 0) {
      toast.info("Your cart is empty.");
      return;
    }

    const products = cart.map((item) => ({
      product: item._id,
      quantity: item.quantity,
    }));

    console.log("Submitting order products:", products);
    mutation.mutate(products);
  };

  const handleDelete = (productId) => {
    removeFromCart(productId);
  };

  const handleIncrement = (productId) => {
    const product = cart.find((item) => item._id === productId);
    if (product) {
      addToCart(product);
    }
  };

  const handleDecrement = (productId) => {
    decrementQuantity(productId);
  };

  const totalPrice = cart
    .reduce((acc, curr) => acc + curr.quantity * curr.price, 0)
    .toFixed(2);

  return (
    <>
      <Header />

      <div className="container mx-auto p-6">
        <div className="w-full md:w-3/4 mx-auto">
          <h2 className="text-xl font-semibold mb-4">Your cart items:</h2>

          {cart.length === 0 ? (
            <p className="text-gray-600 text-center text-lg py-10">
              Your cart is empty 🛒
            </p>
          ) : (
            <ul>
              {cart.map((product) => (
                <li
                  key={product._id}
                  className="flex items-center justify-between p-4 border-b"
                >
                  {/* Product Info */}
                  <div className="flex items-center space-x-4">
                    <img
                      src={`http://localhost:3007/productsImage/${product.image}`}
                      alt={product.name}
                      className="w-16 h-16 object-cover rounded"
                    />

                    <div>
                      <h3 className="font-medium">{product.name}</h3>
                      <p className="text-sm text-gray-600">
                        ${Number(product.price).toFixed(2)} × {product.quantity}{" "}
                        ={" "}
                        <span className="font-medium">
                          $
                          {(Number(product.price) * product.quantity).toFixed(
                            2
                          )}
                        </span>
                      </p>
                    </div>
                  </div>

                  {/* Quantity Actions */}
                  <div className="flex items-center space-x-3">
                    <button
                      className="bg-gray-200 px-2 py-1 rounded hover:bg-gray-300"
                      onClick={() => handleDecrement(product._id)}
                      aria-label="Decrease quantity"
                    >
                      -
                    </button>

                    <span className="px-3 py-1 text-sm bg-gray-100 rounded-md">
                      {product.quantity}
                    </span>

                    <button
                      className="bg-gray-200 px-2 py-1 rounded hover:bg-gray-300"
                      onClick={() => handleIncrement(product._id)}
                      aria-label="Increase quantity"
                    >
                      +
                    </button>

                    <button
                      className="text-red-600 hover:text-red-800"
                      onClick={() => handleDelete(product._id)}
                      aria-label="Remove item"
                    >
                      ✖
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          )}

          {/* Total + Order button */}
          {cart.length > 0 && (
            <div className="mt-4 flex justify-between items-center">
              <p className="text-lg font-medium text-red-700">
                Total: ${totalPrice}
              </p>
              <button
                className="bg-blue-500 text-white px-6 py-2 rounded hover:bg-blue-600"
                onClick={handleOrder}
                disabled={mutation.isLoading}
              >
                {mutation.isLoading ? "Processing..." : "Proceed to payment"}
              </button>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
