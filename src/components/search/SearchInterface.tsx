import React from "react";
import {
  MagnifyingGlassIcon,
  FunnelIcon,
  CircleStackIcon,
} from "@heroicons/react/24/outline";
import { Filter } from "../../types/filters";

interface SearchInterfaceProps {
  selectedIndex: string | null;
  indexIsLoading: boolean;
  query: string;
  onQueryChange: (query: string) => void;
  onKeyPress: (e: React.KeyboardEvent) => void;
  filters: Filter[];
  onOpenFilterModal: () => void;
  onSearch: () => void;
  onClearFilters: () => void;
  loading: boolean;
  selectedIndexData: any;
}

export const SearchInterface: React.FC<SearchInterfaceProps> = ({
  selectedIndex,
  indexIsLoading,
  query,
  onQueryChange,
  onKeyPress,
  filters,
  onOpenFilterModal,
  onSearch,
  onClearFilters,
  loading,
  selectedIndexData,
}) => {
  return (
    <div className="gradient-card rounded-xl p-6">
      <div className="flex items-center space-x-4 mb-4">
        <div className="flex items-center space-x-2 text-sm text-gray-600">
          <CircleStackIcon className="h-4 w-4" />
          <span>
            Searching in:{" "}
            <span className="font-medium text-gray-900">{selectedIndex}</span>
          </span>
        </div>
        {indexIsLoading && (
          <div className="flex items-center space-x-2 text-sm text-blue-600">
            <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-blue-600"></div>
            <span>Loading index details...</span>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-4 mb-4">
        <div className="lg:col-span-3">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Search Query
          </label>
          <input
            type="text"
            value={query}
            onChange={(e) => onQueryChange(e.target.value)}
            onKeyPress={onKeyPress}
            placeholder="Enter your search query..."
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
        <div className="flex items-end">
          <button
            onClick={onOpenFilterModal}
            disabled={!selectedIndexData || indexIsLoading}
            className="btn-secondary w-full flex items-center justify-center space-x-2 py-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <FunnelIcon className="h-5 w-5" />
            <span>
              Filters
              {filters.length > 0 && (
                <span className="ml-1 bg-blue-100 text-blue-800 text-xs px-2 py-0.5 rounded-full">
                  {filters.length}
                </span>
              )}
            </span>
          </button>
        </div>
        <div className="flex items-end">
          <button
            onClick={onSearch}
            disabled={
              loading || !selectedIndex || !query.trim() || indexIsLoading
            }
            className="btn-primary w-full flex items-center justify-center space-x-2 py-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <MagnifyingGlassIcon className="h-5 w-5" />
            <span>
              {loading
                ? "Searching..."
                : indexIsLoading
                ? "Loading..."
                : "Search"}
            </span>
          </button>
        </div>
      </div>

      {filters.length > 0 && (
        <div className="flex justify-between items-center mb-4">
          <div className="flex flex-wrap gap-2">
            {filters.map((filter, index) => (
              <span key={index} className="chip-gray">
                {filter.field} {filter.operator} {filter.value}
              </span>
            ))}
          </div>
          <button
            onClick={onClearFilters}
            className="text-sm text-red-600 hover:text-red-800"
          >
            Clear all filters
          </button>
        </div>
      )}
    </div>
  );
};
