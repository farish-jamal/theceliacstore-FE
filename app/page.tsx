import React from "react";
import Header from "./components/layout/Header";
import Navbar from "./components/navbar/Navbar";

const HomePage = () => {
  return (
    <div className="flex flex-col min-h-screen bg-gray-100">
      <Header />
      <Navbar />
    </div>
  );
};

export default HomePage;
