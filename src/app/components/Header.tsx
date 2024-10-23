// src/app/components/Header.tsx
"use client";

import React from "react";

interface HeaderProps {
  toggleLocations: () => void;
  showLocations: boolean;
}

const Header: React.FC<HeaderProps> = ({ toggleLocations, showLocations }) => {
  return (
    <header className="bg-white p-4 shadow-md">
      <h1 className="text-2xl font-bold">WanderTravel</h1>
      <button
        onClick={toggleLocations}
        className="mt-2 p-2 bg-gray-300 rounded"
      >
        {showLocations ? "Hide" : "Show "}
      </button>
    </header>
  );
};

export default Header;