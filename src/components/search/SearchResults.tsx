import React from "react";
import { MagnifyingGlassIcon, ClockIcon } from "@heroicons/react/24/outline";
import { SearchResult, IndexSettings } from "../../types/core";
import { SearchResultCard } from "./SearchResultCard";

interface SearchResultsProps {
  loading: boolean;
  searchResults: SearchResult | null;
  indexSettings?: IndexSettings; // Pass index settings for field ordering
  onDocumentClick?: (document: any) => void;
}

export const SearchResults: React.FC<SearchResultsProps> = ({
  loading,
  searchResults,
  indexSettings,
  onDocumentClick,
}) => {
  if (loading) {
    return (
      <div className="gradient-card rounded-xl p-8 text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
        <p className="text-gray-600">Searching...</p>
      </div>
    );
  }

  if (!searchResults) {
    return (
      <div className="gradient-card rounded-xl p-12 text-center">
        <MagnifyingGlassIcon className="h-16 w-16 text-gray-400 mx-auto mb-4" />
        <h3 className="text-lg font-semibold text-gray-900 mb-2">
          Ready to search
        </h3>
        <p className="text-gray-600">
          Enter a query and click search to find documents
        </p>
      </div>
    );
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold text-gray-900">Search Results</h2>
        <div className="flex items-center space-x-2 text-sm text-gray-600">
          <ClockIcon className="h-4 w-4" />
          <span>
            {searchResults.hits?.length || 0} results in {searchResults.took}ms
          </span>
        </div>
      </div>

      {searchResults.hits && searchResults.hits.length > 0 ? (
        <div>
          {searchResults.hits.map((hit, index) => (
            <SearchResultCard
              key={index}
              hit={hit}
              onDocumentClick={() => onDocumentClick?.(hit.document)}
              indexSettings={indexSettings}
            />
          ))}
        </div>
      ) : (
        <div className="gradient-card rounded-xl p-12 text-center">
          <MagnifyingGlassIcon className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            No results found
          </h3>
          <p className="text-gray-600">
            Try adjusting your search query or filters
          </p>
        </div>
      )}
    </div>
  );
};
