"use client";
import React from "react";
import {
  FiRefreshCw,
  FiBookmark,
  FiInfo,
  FiMoreHorizontal,
  FiSearch,
} from "react-icons/fi";

export default function Header() {
  return (
    <header className="flex items-center justify-between px-5 py-2 bg-white border-b shadow-sm">
      {/* Title */}
      <h1 className="text-lg font-medium text-gray-800">
        California Healthcare Policy
      </h1>

      {/* Right Controls */}
      <div className="flex items-center gap-3">
        {/* Explore Results */}
        <button className="flex items-center gap-1 h-9 px-3 text-sm font-medium text-blue-600 bg-blue-50 border border-blue-200 rounded-md hover:bg-blue-100 transition-colors">
          ✦ Explore results
        </button>

        {/* Icon buttons */}
        <button className="p-2 rounded-md hover:bg-gray-100 text-gray-500">
          <FiRefreshCw size={16} />
        </button>
        <button className="p-2 rounded-md hover:bg-gray-100 text-gray-500">
          <FiBookmark size={16} />
        </button>
        <button className="p-2 rounded-md hover:bg-gray-100 text-gray-500">
          <FiInfo size={16} />
        </button>
        <button className="p-2 rounded-md hover:bg-gray-100 text-gray-500">
          <FiMoreHorizontal size={18} />
        </button>

        {/* Search */}
        <div className="relative">
          <input
            type="text"
            placeholder="Search..."
            className="w-48 h-9 pl-9 pr-3 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-400"
          />
          <FiSearch
            size={16}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
          />
        </div>

        {/* + New */}
        <button className="h-9 px-4 bg-blue-500 text-white text-sm font-medium rounded-md shadow-sm hover:bg-blue-600 transition-colors">
          + New
        </button>
      </div>
    </header>
  );
}
