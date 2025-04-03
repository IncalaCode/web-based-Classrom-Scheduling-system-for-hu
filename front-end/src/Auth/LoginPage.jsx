import React from "react";
import { useLoginForm } from "../hooks/useLoginForm";

const roles = [
  { name: "Department Head" },
  { name: "Facilitator" },
  { name: "Admin" },
  { name: "Instructor" },
  { name: "Student" },
  { name: "Lab Assistant" },
];

const LoginPage = () => {
  const {
    activeTab,
    setActiveTab,
    formData,
    errors,
    loading,
    successMessage,
    handleInputChange,
    handleSubmit,
  } = useLoginForm();

  return (
    <div
      className="flex justify-center items-center h-screen bg-cover bg-center"
      style={{ backgroundImage: "url('https://imgs.search.brave.com/6LwEU6XKuShO-hAQOUenxiKKYUGYj-UK7FE2RihxMdw/rs:fit:500:0:0:0/g:ce/aHR0cHM6Ly9tZWRp/YS5nZXR0eWltYWdl/cy5jb20vaWQvMTgy/Njc1NzQyL3Bob3Rv/L2Jvb2tzLmpwZz9z/PTYxMng2MTImdz0w/Jms9MjAmYz05aVhS/ZE1zM3NOMjVpSHll/NWtBRkJxRDRUcjFJ/VlI0SVk4Z1hHOGJr/VE1VPQ')" }}
    >
      <div className="absolute inset-0 bg-black opacity-30"></div>
      
      {!activeTab ? (
        <div className="relative z-10 w-full max-w-7xl px-4">
          <h2 className="text-white text-5xl font-bold mb-16 text-center">Login As</h2>
          <div className="grid grid-cols-3 gap-10">
            {roles.map((role, index) => (
              <button
                key={index}
                onClick={() => setActiveTab(role.name.toLowerCase().replace(" ", ""))}
                className="p-8 w-full h-48  bg-opacity-5 backdrop-filter backdrop-blur-sm border border-white border-opacity-15 rounded-xl flex flex-col justify-center items-center text-white hover:bg-opacity-15 transition transform hover:scale-105 hover:shadow-2xl"
              >
                <span className="text-2xl font-medium">{role.name}</span>
              </button>
            ))}
          </div>
        </div>
      ) : (
        <div className="relative z-10 backdrop-blur-md p-10 rounded-lg shadow-xl w-[400px] flex flex-col items-center border border-white border-opacity-20">
          <button 
            onClick={() => setActiveTab(null)} 
            className="absolute top-4 left-4 text-white hover:text-gray-300"
          >
            ← Back
          </button>
          
          <h2 className="text-white text-3xl font-bold mb-2">Login</h2>
          <p className="text-white text-lg mb-6">
            {roles.find(r => r.name.toLowerCase().replace(" ", "") === activeTab)?.name}
          </p>
          
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
      )}
    </div>
  );
};

export default LoginPage;
