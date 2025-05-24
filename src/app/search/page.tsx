"use client";

import React, { useState, useEffect } from "react";
import { useSearchEngine } from "../../context/SearchEngineContext";
import { searchAPI } from "../../lib/searchEngineApi";
import { SearchRequest } from "../../types/core";
import { Filter } from "../../types/filters";
import { MainLayout } from "../../components/Layout/MainLayout";
import {
  FilterModal,
  SearchInterface,
  SearchResults,
  EmptyStates,
} from "../../components/search";

export default function SearchPage() {
  const { state, dispatch, loadIndexDetails, getIndexDetails, isIndexLoading } =
    useSearchEngine();
  const [query, setQuery] = useState("");
  const [filters, setFilters] = useState<Filter[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);

  // Use the globally selected index from the header
  const selectedIndex = state.currentIndex;

  // Load index details when global index changes
  useEffect(() => {
    if (
      selectedIndex &&
      !getIndexDetails(selectedIndex) &&
      !isIndexLoading(selectedIndex)
    ) {
      loadIndexDetails(selectedIndex);
    }
  }, [selectedIndex, getIndexDetails, isIndexLoading, loadIndexDetails]);

  const handleSearch = async () => {
    if (!selectedIndex || !query.trim()) {
      setError("Please select an index and enter a search query");
      return;
    }

    // Ensure we have index details before searching
    const indexDetails = getIndexDetails(selectedIndex);
    if (!indexDetails && !isIndexLoading(selectedIndex)) {
      setError("Loading index details... Please try again in a moment.");
      loadIndexDetails(selectedIndex);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const searchRequest: SearchRequest = {
        query: query,
        page_size: 20,
        filters: filters
          .filter((f) => f.field && f.value) // Only require field and value, operator can be empty string
          .reduce((acc, filter) => {
            // Handle operator by appending to field name as suffix
            const operator = filter.operator || "";
            if (operator === "") {
              // Direct field match for equals - just field name
              acc[filter.field] = filter.value;
            } else {
              // Operator-based match - append operator to field name
              acc[filter.field + operator] = filter.value;
            }
            return acc;
          }, {} as Record<string, any>),
      };

      console.log("Search request:", searchRequest); // Debug log to verify filters

      const result = await searchAPI.search(selectedIndex, searchRequest);
      dispatch({ type: "SET_SEARCH_RESULTS", payload: result });

      // Add to search history
      dispatch({
        type: "ADD_SEARCH_HISTORY",
        payload: {
          id: Date.now().toString(),
          query,
          index_name: selectedIndex,
          timestamp: new Date().toISOString(),
          filters: filters.reduce((acc, filter) => {
            if (filter.field && filter.value) {
              const operator = filter.operator || "";
              if (operator === "") {
                acc[filter.field] = filter.value;
              } else {
                acc[filter.field + operator] = filter.value;
              }
            }
            return acc;
          }, {} as Record<string, any>),
          result_count: result.hits?.length || 0,
          response_time: result.took,
        },
      });
    } catch (error) {
      setError("Search failed. Please try again.");
      console.error("Search error:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleClearFilters = () => {
    setFilters([]);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  // Get selected index details (might be null if not loaded yet)
  const selectedIndexData = getIndexDetails(selectedIndex || "");
  const indexIsLoading = isIndexLoading(selectedIndex || "");

  const availableFields = selectedIndexData
    ? selectedIndexData.filterable_fields
    : [];

  // Get all available fields for header field selection (searchable + filterable)
  const allAvailableFields = selectedIndexData
    ? [
        ...new Set([
          ...selectedIndexData.searchable_fields,
          ...selectedIndexData.filterable_fields,
        ]),
      ]
    : [];

  return (
    <MainLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Search Documents
          </h1>
          <p className="text-gray-600">
            {selectedIndex
              ? `Search through documents in the "${selectedIndex}" index`
              : "Select an index from the top navigation to start searching"}
          </p>
        </div>

        <EmptyStates
          loading={state.loading}
          indexNames={state.indexNames}
          selectedIndex={selectedIndex}
        />

        {selectedIndex && (
          <>
            <SearchInterface
              selectedIndex={selectedIndex}
              indexIsLoading={indexIsLoading}
              query={query}
              onQueryChange={setQuery}
              onKeyPress={handleKeyPress}
              filters={filters}
              onOpenFilterModal={() => setIsFilterModalOpen(true)}
              onSearch={handleSearch}
              onClearFilters={handleClearFilters}
              loading={loading}
              selectedIndexData={selectedIndexData}
            />

            {error && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <div className="flex justify-between items-center">
                  <p className="text-red-800">{error}</p>
                  <button
                    onClick={() => setError(null)}
                    className="text-red-600 hover:text-red-800"
                  >
                    ×
                  </button>
                </div>
              </div>
            )}

            <SearchResults
              loading={loading}
              searchResults={state.searchResults}
              indexSettings={selectedIndexData || undefined}
              onDocumentClick={(document) =>
                console.log("Document clicked:", document)
              }
            />

            <FilterModal
              isOpen={isFilterModalOpen}
              onClose={() => setIsFilterModalOpen(false)}
              availableFields={availableFields}
              filters={filters}
              onFiltersChange={setFilters}
            />
          </>
        )}
      </div>
    </MainLayout>
  );
}
