import React, { useState } from "react";
import { ChevronDownIcon, ChevronUpIcon } from "@heroicons/react/24/outline";
import { IndexSettings } from "../../types/core";

interface SearchResultCardProps {
  hit: any;
  indexSettings?: IndexSettings; // Index configuration for field ordering
  onDocumentClick?: () => void;
}

export const SearchResultCard: React.FC<SearchResultCardProps> = ({
  hit,
  indexSettings,
  onDocumentClick,
}) => {
  const { document, score, field_matches, hit_info } = hit;
  const [isExpanded, setIsExpanded] = useState(false);
  const [expandedArrays, setExpandedArrays] = useState<Set<string>>(new Set());

  // Helper function to highlight matched text
  const highlightText = (
    text: string,
    fieldName: string
  ): string | React.ReactNode => {
    if (!field_matches || !field_matches[fieldName]) {
      return text;
    }

    const matches = field_matches[fieldName];
    if (!matches || matches.length === 0) {
      return text;
    }

    // Create a regex pattern from all matches
    const escapedMatches = matches.map((match: string) =>
      match.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")
    );
    const pattern = new RegExp(`(${escapedMatches.join("|")})`, "gi");

    // Split text and highlight matches
    const parts = text.split(pattern);
    return (
      <>
        {parts.map((part, index) => {
          const isMatch = matches.some(
            (match: string) => match.toLowerCase() === part.toLowerCase()
          );
          return isMatch ? (
            <mark
              key={index}
              className="bg-yellow-200 text-yellow-900 px-1 rounded"
            >
              {part}
            </mark>
          ) : (
            part
          );
        })}
      </>
    );
  };

  // Toggle array expansion for specific field
  const toggleArrayExpansion = (fieldName: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const newExpanded = new Set(expandedArrays);
    if (newExpanded.has(fieldName)) {
      newExpanded.delete(fieldName);
    } else {
      newExpanded.add(fieldName);
    }
    setExpandedArrays(newExpanded);
  };

  // Algolia-style array renderer
  const renderAlgoliaArray = (
    arr: any[],
    fieldName: string,
    hasMatches: boolean
  ): React.ReactNode => {
    const isExpanded = expandedArrays.has(fieldName);
    const maxVisibleItems = 3; // Show first 3 items horizontally

    if (isExpanded) {
      // Vertical expanded view
      return (
        <div className="space-y-1">
          {arr.map((item, index) => (
            <div
              key={index}
              className="inline-block bg-blue-50 text-blue-800 px-2 py-1 rounded text-xs mr-1 mb-1"
            >
              {hasMatches && typeof item === "string"
                ? highlightText(item, fieldName)
                : String(item)}
            </div>
          ))}
          <button
            onClick={(e) => toggleArrayExpansion(fieldName, e)}
            className="text-xs text-blue-600 hover:text-blue-800 font-medium ml-2"
          >
            Show less
          </button>
        </div>
      );
    }

    // Horizontal collapsed view
    const visibleItems = arr.slice(0, maxVisibleItems);
    const hiddenCount = arr.length - maxVisibleItems;

    return (
      <div className="flex items-center flex-wrap">
        {visibleItems.map((item, index) => (
          <span
            key={index}
            className="inline-block bg-blue-50 text-blue-800 px-2 py-1 rounded text-xs mr-1 mb-1"
          >
            {hasMatches && typeof item === "string"
              ? highlightText(item, fieldName)
              : String(item)}
          </span>
        ))}
        {hiddenCount > 0 && (
          <button
            onClick={(e) => toggleArrayExpansion(fieldName, e)}
            className="text-xs text-blue-600 hover:text-blue-800 font-medium"
          >
            +{hiddenCount} more
          </button>
        )}
        {arr.length <= maxVisibleItems && arr.length > 1 && (
          <span className="text-xs text-gray-500 ml-1">{arr.length} items</span>
        )}
      </div>
    );
  };

  // Helper function to format values with highlighting
  const formatValueWithHighlight = (
    value: any,
    fieldName: string
  ): React.ReactNode => {
    if (value === null || value === undefined) {
      return <span className="text-gray-400 italic text-xs">null</span>;
    }

    if (Array.isArray(value)) {
      if (value.length === 0) {
        return (
          <span className="text-gray-400 italic text-xs">empty array</span>
        );
      }
      return renderAlgoliaArray(value, fieldName, true);
    } else if (typeof value === "object") {
      return renderObjectValue(value);
    } else if (typeof value === "string") {
      return <span className="text-sm">{highlightText(value, fieldName)}</span>;
    } else {
      return <span className="text-sm">{String(value)}</span>;
    }
  };

  // Helper function to render object values in a more readable way
  const renderObjectValue = (obj: any): React.ReactNode => {
    if (obj === null || obj === undefined) {
      return <span className="text-gray-400 italic text-xs">null</span>;
    }

    const entries = Object.entries(obj);
    if (entries.length === 0) {
      return <span className="text-gray-400 italic text-xs">{"{}"}</span>;
    }

    return (
      <div className="text-xs bg-gray-50 border border-gray-200 rounded p-2 mt-1">
        {entries.map(([key, val], index) => (
          <div key={key} className="flex items-start space-x-2 mb-1 last:mb-0">
            <span className="font-semibold text-gray-700 min-w-0 flex-shrink-0">
              {key}:
            </span>
            <span className="text-gray-600 min-w-0 flex-1">
              {formatValueForDisplay(val)}
            </span>
          </div>
        ))}
      </div>
    );
  };

  // Helper function to format value without highlighting for display
  const formatValueForDisplay = (value: any): string | React.ReactNode => {
    if (value === null || value === undefined) {
      return "null";
    }
    if (Array.isArray(value)) {
      if (value.length === 0) return "[]";
      return renderAlgoliaArray(value, "", false);
    } else if (typeof value === "object") {
      // For nested objects, just show a summary
      const keys = Object.keys(value);
      if (keys.length === 0) return "{}";
      if (keys.length <= 2) {
        return `{${keys.join(", ")}}`;
      }
      return `{${keys.slice(0, 2).join(", ")} +${keys.length - 2} more}`;
    } else {
      return String(value);
    }
  };

  // Function to order fields according to the specified priority
  const getOrderedFields = (): string[] => {
    const documentFields = Object.keys(document).filter(
      (field) => document[field] !== null && document[field] !== undefined
    );

    if (!indexSettings) {
      // Fallback: alphabetical order
      return documentFields.sort();
    }

    const orderedFields: string[] = [];
    const usedFields = new Set<string>();

    // 1. Searchable fields (by order of definition)
    if (indexSettings.searchable_fields) {
      indexSettings.searchable_fields.forEach((field) => {
        if (documentFields.includes(field) && !usedFields.has(field)) {
          orderedFields.push(field);
          usedFields.add(field);
        }
      });
    }

    // 2. Distinct field
    if (
      indexSettings.distinct_field &&
      documentFields.includes(indexSettings.distinct_field) &&
      !usedFields.has(indexSettings.distinct_field)
    ) {
      orderedFields.push(indexSettings.distinct_field);
      usedFields.add(indexSettings.distinct_field);
    }

    // 3. Ranking fields
    if (indexSettings.ranking_criteria) {
      indexSettings.ranking_criteria.forEach((criterion) => {
        if (
          documentFields.includes(criterion.field) &&
          !usedFields.has(criterion.field)
        ) {
          orderedFields.push(criterion.field);
          usedFields.add(criterion.field);
        }
      });
    }

    // 4. Filterable fields
    if (indexSettings.filterable_fields) {
      indexSettings.filterable_fields.forEach((field) => {
        if (documentFields.includes(field) && !usedFields.has(field)) {
          orderedFields.push(field);
          usedFields.add(field);
        }
      });
    }

    // 5. Rest by alphabetical order (ascending)
    const remainingFields = documentFields
      .filter((field) => !usedFields.has(field))
      .sort();

    orderedFields.push(...remainingFields);

    return orderedFields;
  };

  const orderedFields = getOrderedFields();

  // Show first few fields by default, rest in expanded view
  const visibleFields = isExpanded ? orderedFields : orderedFields.slice(0, 6);
  const hiddenFieldsCount = orderedFields.length - visibleFields.length;

  return (
    <div
      className="gradient-card rounded-xl p-6 mb-4 cursor-pointer hover:shadow-lg transition-shadow"
      onClick={onDocumentClick}
    >
      {/* Score and hit info */}
      <div className="flex justify-between items-start mb-4">
        <div className="flex-1">
        </div>
        <div className="flex items-center space-x-3 text-sm text-gray-500">
          <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs font-medium">
            Score: {score.toFixed(2)}
          </span>
          {hit_info && (
            <span className="text-xs">
              {hit_info.num_typos > 0 && `${hit_info.num_typos} typos`}
              {hit_info.number_exact_words > 0 &&
                ` • ${hit_info.number_exact_words} exact`}
            </span>
          )}
        </div>
      </div>

      {/* All fields in order */}
      {orderedFields.length > 0 && (
        <div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 items-start">
            {visibleFields.map((fieldName) => {
              const value = document[fieldName];
              // Check if this field has matches and should be highlighted
              const hasMatches =
                field_matches &&
                field_matches[fieldName] &&
                field_matches[fieldName].length > 0;

              return (
                <div key={fieldName} className="text-sm break-inside-avoid flex items-start space-x-2">
                  <span className="font-bold text-gray-600 text-xs flex-shrink-0">
                    {fieldName}:
                  </span>
                  <div className="text-gray-700 flex-1 min-w-0">
                    {hasMatches
                      ? formatValueWithHighlight(value, fieldName)
                      : formatValueForDisplay(value)}
                  </div>
                </div>
              );
            })}
          </div>

          {hiddenFieldsCount > 0 && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                setIsExpanded(!isExpanded);
              }}
              className="mt-3 text-sm text-blue-600 hover:text-blue-800 font-medium flex items-center"
            >
              {isExpanded ? (
                <>
                  <ChevronUpIcon className="h-4 w-4 mr-1" />
                  Show fewer fields
                </>
              ) : (
                <>
                  <ChevronDownIcon className="h-4 w-4 mr-1" />
                  Show {hiddenFieldsCount} more fields
                </>
              )}
            </button>
          )}
        </div>
      )}
    </div>
  );
};
