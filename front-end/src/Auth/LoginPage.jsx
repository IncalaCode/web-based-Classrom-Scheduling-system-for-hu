import React from "react";
import { useLoginForm } from "../hooks/useLoginForm";

const LoginPage = () => {
  const {
    errors,
    loading,
    successMessage,
    formData,
    handleInputChange,
    handleSubmit,
  } = useLoginForm();

  return (
    <div
      className="flex justify-center items-center h-screen bg-cover bg-center"
      style={{ backgroundImage: "url('https://imgs.search.brave.com/6LwEU6XKuShO-hAQOUenxiKKYUGYj-UK7FE2RihxMdw/rs:fit:500:0:0:0/g:ce/aHR0cHM6Ly9tZWRp/YS5nZXR0eWltYWdl/cy5jb20vaWQvMTgy/Njc1NzQyL3Bob3Rv/L2Jvb2tzLmpwZz9z/PTYxMng2MTImdz0w/Jms9MjAmYz05aVhS/ZE1zM3NOMjVpSHll/NWtBRkJxRDRUcjFJ/VlI0SVk4Z1hHOGJr/VE1VPQ')" }}
    >
      <div className="absolute inset-0 bg-black opacity-30"></div>
      <div className="relative z-10 backdrop-blur-md p-10 rounded-lg shadow-xl w-[400px] flex flex-col items-center border border-white border-opacity-20">
        <h2 className="text-white text-3xl font-bold mb-2">Login</h2>
        {successMessage && (
          <div className="w-full mb-4 p-3 rounded bg-green-500 bg-opacity-50 backdrop-blur-sm text-white">
            {successMessage}
          </div>
        )}
        {errors.auth && (
          <div className="w-full mb-4 p-3 rounded bg-red-500 bg-opacity-50 backdrop-blur-sm text-white">
            {errors.auth}
          </div>
        )}
        <form onSubmit={handleSubmit} className="w-full">
          <div className="mb-4">
            <input
              type="email"
              name="email"
              placeholder="Email Address"
              value={formData.email}
              onChange={handleInputChange}
              className="w-full p-3 rounded  bg-opacity-10 backdrop-blur-sm text-white placeholder-white placeholder-opacity-70 focus:outline-none focus:ring-2 focus:ring-white focus:ring-opacity-30 border border-white border-opacity-20"
            />
            {errors.email && (
              <p className="text-red-300 mt-1">{errors.email}</p>
            )}
          </div>
          <div className="mb-6">
            <input
              type="password"
              name="password"
              placeholder="Password"
              value={formData.password}
              onChange={handleInputChange}
              className="w-full p-3 rounded  bg-opacity-10 backdrop-blur-sm text-white placeholder-white placeholder-opacity-70 focus:outline-none focus:ring-2 focus:ring-white focus:ring-opacity-30 border border-white border-opacity-20"
            />
            {errors.password && (
              <p className="text-red-300 mt-1">{errors.password}</p>
            )}
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full p-3  bg-opacity-30 backdrop-blur-sm rounded text-white hover:bg-opacity-40 transition transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed border border-white border-opacity-20"
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;
