import React from "react";
import Header from "../components/Header";

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      {/* Hero Section */}
      <section
        className="flex flex-col items-center justify-center text-center bg-cover bg-center h-[85vh] text-white px-6"
        style={{
          backgroundImage: "url('img/bannerImage.jpg')",
        }}
      >
        <div className="bg-black/50 p-10 rounded-2xl">
          <h1 className="text-5xl font-extrabold mb-4">Welcome to Sports Center</h1>
          <p className="text-lg max-w-xl mb-6">
            Discover the latest products, unbeatable deals, and premium quality
            items all in one place.
          </p>
          <a
            href="/products"
            className="bg-blue-600 hover:bg-blue-700 px-6 py-3 rounded-lg font-semibold text-white transition"
          >
            Shop Now
          </a>
        </div>
      </section>

      {/* Optional Footer Section */}
      <footer className="bg-gray-900 text-gray-300 py-6 text-center">
        <p>© {new Date().getFullYear()} ShopEase. All rights reserved.</p>
      </footer>
    </div>
  );
}
