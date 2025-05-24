"use client";

import React, { useState } from "react";
import {
  Bars3Icon,
  BellIcon,
  Cog6ToothIcon,
  MagnifyingGlassIcon,
  ChevronDownIcon,
  CircleStackIcon,
} from "@heroicons/react/24/outline";
import { useSearchEngine } from "../../context/SearchEngineContext";

interface HeaderProps {
  onMenuClick: () => void;
  onNotificationsClick?: () => void;
  onSettingsClick?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  onMenuClick,
  onNotificationsClick,
  onSettingsClick,
}) => {
  const { state, dispatch } = useSearchEngine();
  const [indexDropdownOpen, setIndexDropdownOpen] = useState(false);

  const handleIndexSelect = (indexName: string) => {
    dispatch({ type: "SET_CURRENT_INDEX", payload: indexName });
    setIndexDropdownOpen(false);
  };

  return (
    <header className="gradient-bg shadow-lg sticky top-0 z-50">
      <div className="px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Left side - Logo */}
          <div className="flex items-center">
            <button
              onClick={onMenuClick}
              className="p-2 rounded-md text-white hover:bg-white/10 transition-colors lg:hidden"
            >
              <Bars3Icon className="h-6 w-6" />
            </button>

            <div className="flex items-center ml-2 lg:ml-0">
              <MagnifyingGlassIcon className="h-8 w-8 text-white mr-3" />
              <h1 className="text-xl font-bold bg-gradient-to-r from-white to-blue-100 bg-clip-text text-transparent">
                Search Engine Dashboard
              </h1>
            </div>
          </div>

          {/* Center - Index Selector (Algolia-inspired) */}
          <div className="hidden md:flex items-center">
            <div className="relative">
              <button
                onClick={() => setIndexDropdownOpen(!indexDropdownOpen)}
                className="flex items-center space-x-2 bg-white/10 hover:bg-white/20 backdrop-blur-sm rounded-lg px-4 py-2 text-white border border-white/20 transition-all duration-200"
              >
                <CircleStackIcon className="h-5 w-5" />
                <span className="text-sm font-medium">
                  {state.currentIndex ||
                    (state.indexNames.length > 0
                      ? "Select Index"
                      : "No Indexes")}
                </span>
                {state.indexNames.length > 0 && (
                  <ChevronDownIcon
                    className={`h-4 w-4 transition-transform duration-200 ${
                      indexDropdownOpen ? "rotate-180" : ""
                    }`}
                  />
                )}
              </button>

              {/* Dropdown */}
              {indexDropdownOpen && state.indexNames.length > 0 && (
                <div className="absolute top-full left-0 mt-2 w-64 bg-white rounded-lg shadow-xl border border-gray-200 py-2 z-50">
                  <div className="px-3 py-2 text-xs font-semibold text-gray-500 uppercase tracking-wider border-b border-gray-100">
                    Available Indexes
                  </div>
                  <div className="max-h-64 overflow-y-auto">
                    {state.indexNames.map((indexName) => (
                      <button
                        key={indexName}
                        onClick={() => handleIndexSelect(indexName)}
                        className={`w-full text-left px-3 py-3 text-sm hover:bg-gray-50 transition-colors ${
                          state.currentIndex === indexName
                            ? "bg-blue-50 text-blue-700 border-r-2 border-blue-500"
                            : "text-gray-700"
                        }`}
                      >
                        <div className="flex items-center space-x-3">
                          <CircleStackIcon
                            className={`h-4 w-4 ${
                              state.currentIndex === indexName
                                ? "text-blue-500"
                                : "text-gray-400"
                            }`}
                          />
                          <div>
                            <div className="font-medium">{indexName}</div>
                            {state.currentIndex === indexName && (
                              <div className="text-xs text-blue-600">
                                Currently selected
                              </div>
                            )}
                          </div>
                        </div>
                      </button>
                    ))}
                  </div>

                  {/* Footer */}
                  <div className="border-t border-gray-100 mt-2 pt-2 px-3">
                    <a
                      href="/indexes"
                      className="text-xs text-blue-600 hover:text-blue-800 font-medium"
                    >
                      Manage indexes →
                    </a>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Right side */}
          <div className="flex items-center space-x-4">
            <button
              onClick={onNotificationsClick}
              className="relative p-2 rounded-full text-white hover:bg-white/10 transition-colors"
            >
              <BellIcon className="h-6 w-6" />
              <span className="absolute -top-1 -right-1 h-4 w-4 bg-red-500 rounded-full flex items-center justify-center text-xs font-medium text-white">
                3
              </span>
            </button>

            <button
              onClick={onSettingsClick}
              className="p-2 rounded-full text-white hover:bg-white/10 transition-colors"
            >
              <Cog6ToothIcon className="h-6 w-6" />
            </button>

            <div className="h-8 w-8 rounded-full bg-gradient-to-r from-pink-500 to-purple-500 flex items-center justify-center text-white font-semibold text-sm">
              SE
            </div>
          </div>
        </div>
      </div>

      {/* Click outside handler */}
      {indexDropdownOpen && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => setIndexDropdownOpen(false)}
        />
      )}
    </header>
  );
};
