import React from "react";
import { FunnelIcon, XMarkIcon } from "@heroicons/react/24/outline";
import { Filter, FILTER_OPERATORS } from "../../types/filters";

interface FilterModalProps {
  isOpen: boolean;
  onClose: () => void;
  availableFields: string[];
  filters: Filter[];
  onFiltersChange: (filters: Filter[]) => void;
}

export const FilterModal: React.FC<FilterModalProps> = ({
  isOpen,
  onClose,
  availableFields,
  filters,
  onFiltersChange,
}) => {
  const addFilter = () => {
    const newFilter: Filter = {
      field: availableFields[0] || "",
      operator: "",
      value: "",
    };
    onFiltersChange([...filters, newFilter]);
  };

  const updateFilter = (index: number, field: keyof Filter, value: any) => {
    const newFilters = [...filters];
    newFilters[index] = { ...newFilters[index], [field]: value };
    onFiltersChange(newFilters);
  };

  const removeFilter = (index: number) => {
    onFiltersChange(filters.filter((_, i) => i !== index));
  };

  const clearAllFilters = () => {
    onFiltersChange([]);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl max-w-4xl w-full max-h-[80vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-900">Search Filters</h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 p-2"
            >
              <XMarkIcon className="h-6 w-6" />
            </button>
          </div>

          <div className="mb-4 flex justify-between items-center">
            <button
              onClick={addFilter}
              className="btn-secondary flex items-center space-x-2"
            >
              <FunnelIcon className="h-4 w-4" />
              <span>Add Filter</span>
            </button>
            {filters.length > 0 && (
              <button
                onClick={clearAllFilters}
                className="text-sm text-red-600 hover:text-red-800"
              >
                Clear all filters
              </button>
            )}
          </div>

          {filters.map((filter, index) => (
            <div key={index} className="mb-4 p-4 bg-gray-50 rounded-lg">
              <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 items-end">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Field
                  </label>
                  <select
                    value={filter.field}
                    onChange={(e) =>
                      updateFilter(index, "field", e.target.value)
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    {availableFields.map((field) => (
                      <option key={field} value={field}>
                        {field}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Operator
                  </label>
                  <select
                    value={filter.operator}
                    onChange={(e) =>
                      updateFilter(index, "operator", e.target.value)
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    {FILTER_OPERATORS.map((op) => (
                      <option key={op.value} value={op.value}>
                        {op.label}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Value
                  </label>
                  <input
                    type="text"
                    value={filter.value}
                    onChange={(e) =>
                      updateFilter(index, "value", e.target.value)
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                <div>
                  <button
                    onClick={() => removeFilter(index)}
                    className="btn-danger flex items-center space-x-2 w-full"
                  >
                    <XMarkIcon className="h-4 w-4" />
                    <span>Remove</span>
                  </button>
                </div>
              </div>
            </div>
          ))}

          {filters.length === 0 && (
            <div className="text-center py-12 text-gray-500">
              <FunnelIcon className="h-12 w-12 text-gray-300 mx-auto mb-4" />
              <p>No filters applied.</p>
              <p className="text-sm">
                Click "Add Filter" to add search filters.
              </p>
            </div>
          )}

          <div className="flex justify-end space-x-3 mt-6 pt-4 border-t">
            <button
              onClick={onClose}
              className="px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50"
            >
              Cancel
            </button>
            <button onClick={onClose} className="btn-primary">
              Apply Filters
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
