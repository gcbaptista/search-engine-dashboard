"use client";

import React, {
  createContext,
  ReactNode,
  useContext,
  useReducer,
  useEffect,
  useCallback,
} from "react";
import { IndexSettings } from "../types/core";
import { IndexWithStats, SearchHistory } from "../types/dashboard";
import { SearchResult } from "../types/core";
import { IndexStats } from "../types/api";
import { searchAPI } from "../lib/searchEngineApi";

interface State {
  indexes: IndexWithStats[];
  indexNames: string[]; // Lightweight list of index names
  indexDetailsCache: Map<string, IndexSettings>; // Cache for loaded index details
  indexStatsCache: Map<string, IndexStats>; // Cache for loaded index stats
  indexHeaderFields: Map<string, string>; // Per-index header field preferences
  loadingIndexes: Set<string>; // Track which indexes are currently loading details
  loadingStats: Set<string>; // Track which indexes are currently loading stats
  currentIndex: string | null;
  searchResults: SearchResult | null;
  searchHistory: SearchHistory[];
  loading: boolean; // Global loading state
  error: string | null;
}

type Action =
  | { type: "SET_LOADING"; payload: boolean }
  | { type: "SET_ERROR"; payload: string | null }
  | { type: "SET_INDEX_NAMES"; payload: string[] }
  | {
      type: "SET_INDEX_DETAILS";
      payload: { name: string; details: IndexSettings };
    }
  | { type: "SET_INDEX_LOADING"; payload: { name: string; loading: boolean } }
  | {
      type: "SET_INDEX_STATS";
      payload: { name: string; stats: IndexStats };
    }
  | { type: "SET_STATS_LOADING"; payload: { name: string; loading: boolean } }
  | {
      type: "SET_INDEX_HEADER_FIELD";
      payload: { indexName: string; fieldName: string };
    }
  | { type: "SET_INDEXES"; payload: IndexWithStats[] } // Keep for backward compatibility
  | { type: "SET_CURRENT_INDEX"; payload: string }
  | { type: "SET_SEARCH_RESULTS"; payload: SearchResult }
  | { type: "ADD_SEARCH_HISTORY"; payload: SearchHistory }
  | { type: "CLEAR_SEARCH_RESULTS" }
  | { type: "UPDATE_INDEX"; payload: IndexSettings }
  | { type: "DELETE_INDEX"; payload: string };

const initialState: State = {
  indexes: [],
  indexNames: [],
  indexDetailsCache: new Map(),
  indexStatsCache: new Map(),
  indexHeaderFields: new Map(),
  loadingIndexes: new Set(),
  loadingStats: new Set(),
  currentIndex: null,
  searchResults: null,
  searchHistory: [],
  loading: false,
  error: null,
};

// localStorage key for persisting current index
const CURRENT_INDEX_KEY = "search-dashboard-current-index";
const HEADER_FIELDS_KEY = "search-dashboard-header-fields";

// Helper functions for localStorage
const saveCurrentIndexToStorage = (indexName: string | null) => {
  if (typeof window !== "undefined") {
    if (indexName) {
      localStorage.setItem(CURRENT_INDEX_KEY, indexName);
    } else {
      localStorage.removeItem(CURRENT_INDEX_KEY);
    }
  }
};

const loadCurrentIndexFromStorage = (): string | null => {
  if (typeof window !== "undefined") {
    return localStorage.getItem(CURRENT_INDEX_KEY);
  }
  return null;
};

const saveHeaderFieldsToStorage = (headerFields: Map<string, string>) => {
  if (typeof window !== "undefined") {
    const obj = Object.fromEntries(headerFields);
    localStorage.setItem(HEADER_FIELDS_KEY, JSON.stringify(obj));
  }
};

const loadHeaderFieldsFromStorage = (): Map<string, string> => {
  if (typeof window !== "undefined") {
    try {
      const stored = localStorage.getItem(HEADER_FIELDS_KEY);
      if (stored) {
        const obj = JSON.parse(stored);
        return new Map(Object.entries(obj));
      }
    } catch (error) {
      console.error("Failed to load header fields from storage:", error);
    }
  }
  return new Map();
};

function searchEngineReducer(state: State, action: Action): State {
  switch (action.type) {
    case "SET_LOADING":
      return { ...state, loading: action.payload };
    case "SET_ERROR":
      return { ...state, error: action.payload, loading: false };
    case "SET_INDEX_NAMES":
      return {
        ...state,
        indexNames: action.payload,
        // Create basic index objects from names
        indexes: action.payload.map((name) => ({
          name,
          searchable_fields: [],
          filterable_fields: [],
          ranking_criteria: [],
          min_word_size_for_1_typo: 4,
          min_word_size_for_2_typos: 7,
          fields_without_prefix_search: [],
          distinct_field: undefined,
        })),
        loading: false,
      };
    case "SET_INDEX_DETAILS":
      const newCache = new Map(state.indexDetailsCache);
      newCache.set(action.payload.name, action.payload.details);
      const newLoadingIndexes = new Set(state.loadingIndexes);
      newLoadingIndexes.delete(action.payload.name);
      return {
        ...state,
        indexDetailsCache: newCache,
        loadingIndexes: newLoadingIndexes,
        // Update the indexes array with the new details
        indexes: state.indexes.map((index) =>
          index.name === action.payload.name
            ? { ...index, ...action.payload.details }
            : index
        ),
      };
    case "SET_INDEX_LOADING":
      const updatedLoadingIndexes = new Set(state.loadingIndexes);
      if (action.payload.loading) {
        updatedLoadingIndexes.add(action.payload.name);
      } else {
        updatedLoadingIndexes.delete(action.payload.name);
      }
      return {
        ...state,
        loadingIndexes: updatedLoadingIndexes,
      };
    case "SET_INDEX_STATS":
      const newStatsCache = new Map(state.indexStatsCache);
      newStatsCache.set(action.payload.name, action.payload.stats);
      return {
        ...state,
        indexStatsCache: newStatsCache,
      };
    case "SET_STATS_LOADING":
      const updatedLoadingStats = new Set(state.loadingStats);
      if (action.payload.loading) {
        updatedLoadingStats.add(action.payload.name);
      } else {
        updatedLoadingStats.delete(action.payload.name);
      }
      return {
        ...state,
        loadingStats: updatedLoadingStats,
      };
    case "SET_INDEX_HEADER_FIELD":
      const newHeaderFields = new Map(state.indexHeaderFields);
      newHeaderFields.set(action.payload.indexName, action.payload.fieldName);
      return {
        ...state,
        indexHeaderFields: newHeaderFields,
      };
    case "SET_INDEXES":
      return { ...state, indexes: action.payload, loading: false };
    case "SET_CURRENT_INDEX":
      // Save to localStorage when currentIndex changes
      saveCurrentIndexToStorage(action.payload);
      return { ...state, currentIndex: action.payload };
    case "SET_SEARCH_RESULTS":
      return { ...state, searchResults: action.payload, loading: false };
    case "ADD_SEARCH_HISTORY":
      return {
        ...state,
        searchHistory: [action.payload, ...state.searchHistory.slice(0, 49)],
      };
    case "CLEAR_SEARCH_RESULTS":
      return { ...state, searchResults: null };
    case "UPDATE_INDEX":
      return {
        ...state,
        indexes: state.indexes.map((index) =>
          index.name === action.payload.name
            ? { ...index, ...action.payload }
            : index
        ),
      };
    case "DELETE_INDEX":
      const filteredIndexes = state.indexes.filter(
        (index) => index.name !== action.payload
      );
      const filteredNames = state.indexNames.filter(
        (name) => name !== action.payload
      );
      const cleanedCache = new Map(state.indexDetailsCache);
      cleanedCache.delete(action.payload);
      const cleanedStatsCache = new Map(state.indexStatsCache);
      cleanedStatsCache.delete(action.payload);
      const cleanedHeaderFields = new Map(state.indexHeaderFields);
      cleanedHeaderFields.delete(action.payload);
      const cleanedLoading = new Set(state.loadingIndexes);
      cleanedLoading.delete(action.payload);
      const cleanedStatsLoading = new Set(state.loadingStats);
      cleanedStatsLoading.delete(action.payload);
      const newCurrentIndex =
        state.currentIndex === action.payload ? null : state.currentIndex;
      // Update localStorage if current index was deleted
      if (state.currentIndex === action.payload) {
        saveCurrentIndexToStorage(null);
      }
      // Update localStorage for header fields
      saveHeaderFieldsToStorage(cleanedHeaderFields);
      return {
        ...state,
        indexes: filteredIndexes,
        indexNames: filteredNames,
        indexDetailsCache: cleanedCache,
        indexStatsCache: cleanedStatsCache,
        indexHeaderFields: cleanedHeaderFields,
        loadingIndexes: cleanedLoading,
        loadingStats: cleanedStatsLoading,
        currentIndex: newCurrentIndex,
      };
    default:
      return state;
  }
}

const SearchEngineContext = createContext<{
  state: State;
  dispatch: React.Dispatch<Action>;
  loadIndexDetails: (indexName: string) => Promise<IndexSettings | null>;
  getIndexDetails: (indexName: string) => IndexSettings | null;
  isIndexLoading: (indexName: string) => boolean;
  loadIndexStats: (indexName: string) => Promise<IndexStats | null>;
  getIndexStats: (indexName: string) => IndexStats | null;
  isStatsLoading: (indexName: string) => boolean;
  setIndexHeaderField: (indexName: string, fieldName: string) => void;
  getIndexHeaderField: (indexName: string) => string | null;
}>({} as any);

export const useSearchEngine = () => {
  const context = useContext(SearchEngineContext);
  if (!context) {
    throw new Error(
      "useSearchEngine must be used within a SearchEngineProvider"
    );
  }
  return context;
};

interface SearchEngineProviderProps {
  children: ReactNode;
}

export const SearchEngineProvider: React.FC<SearchEngineProviderProps> = ({
  children,
}) => {
  const [state, dispatch] = useReducer(searchEngineReducer, initialState);

  // Smart function to load index details on demand
  const loadIndexDetails = useCallback(
    async (indexName: string): Promise<IndexSettings | null> => {
      // Check if already cached
      if (state.indexDetailsCache.has(indexName)) {
        return state.indexDetailsCache.get(indexName)!;
      }

      // Check if already loading
      if (state.loadingIndexes.has(indexName)) {
        // Wait for the current loading to complete
        return new Promise((resolve) => {
          const checkLoading = () => {
            if (!state.loadingIndexes.has(indexName)) {
              resolve(state.indexDetailsCache.get(indexName) || null);
            } else {
              setTimeout(checkLoading, 100);
            }
          };
          checkLoading();
        });
      }

      try {
        dispatch({
          type: "SET_INDEX_LOADING",
          payload: { name: indexName, loading: true },
        });
        const details = await searchAPI.getIndex(indexName);
        dispatch({
          type: "SET_INDEX_DETAILS",
          payload: { name: indexName, details },
        });
        return details;
      } catch (error) {
        console.error(`Error loading details for index ${indexName}:`, error);
        dispatch({
          type: "SET_INDEX_LOADING",
          payload: { name: indexName, loading: false },
        });
        return null;
      }
    },
    [state.indexDetailsCache, state.loadingIndexes]
  );

  // Helper function to get cached index details
  const getIndexDetails = useCallback(
    (indexName: string): IndexSettings | null => {
      return state.indexDetailsCache.get(indexName) || null;
    },
    [state.indexDetailsCache]
  );

  // Helper function to check if index is loading
  const isIndexLoading = useCallback(
    (indexName: string): boolean => {
      return state.loadingIndexes.has(indexName);
    },
    [state.loadingIndexes]
  );

  // Smart function to load index stats on demand
  const loadIndexStats = useCallback(
    async (indexName: string): Promise<IndexStats | null> => {
      // Check if already cached
      if (state.indexStatsCache.has(indexName)) {
        return state.indexStatsCache.get(indexName)!;
      }

      // Check if already loading
      if (state.loadingStats.has(indexName)) {
        // Wait for the current loading to complete
        return new Promise((resolve) => {
          const checkLoading = () => {
            if (!state.loadingStats.has(indexName)) {
              resolve(state.indexStatsCache.get(indexName) || null);
            } else {
              setTimeout(checkLoading, 100);
            }
          };
          checkLoading();
        });
      }

      // Mark as loading
      dispatch({
        type: "SET_STATS_LOADING",
        payload: { name: indexName, loading: true },
      });

      try {
        const stats = await searchAPI.getIndexStats(indexName);
        dispatch({
          type: "SET_INDEX_STATS",
          payload: { name: indexName, stats },
        });
        return stats;
      } catch (error) {
        console.error(`Error loading stats for index ${indexName}:`, error);
        return null;
      } finally {
        dispatch({
          type: "SET_STATS_LOADING",
          payload: { name: indexName, loading: false },
        });
      }
    },
    [state.indexStatsCache, state.loadingStats, dispatch]
  );

  // Helper function to get cached index stats
  const getIndexStats = useCallback(
    (indexName: string): IndexStats | null => {
      return state.indexStatsCache.get(indexName) || null;
    },
    [state.indexStatsCache]
  );

  // Helper function to check if stats are loading
  const isStatsLoading = useCallback(
    (indexName: string): boolean => {
      return state.loadingStats.has(indexName);
    },
    [state.loadingStats]
  );

  // Header field management functions
  const setIndexHeaderField = useCallback(
    (indexName: string, fieldName: string) => {
      dispatch({
        type: "SET_INDEX_HEADER_FIELD",
        payload: { indexName, fieldName },
      });
      // Save to localStorage
      const newHeaderFields = new Map(state.indexHeaderFields);
      newHeaderFields.set(indexName, fieldName);
      saveHeaderFieldsToStorage(newHeaderFields);
    },
    [state.indexHeaderFields, dispatch]
  );

  const getIndexHeaderField = useCallback(
    (indexName: string): string | null => {
      return state.indexHeaderFields.get(indexName) || null;
    },
    [state.indexHeaderFields]
  );

  // Load only index names on startup (fast!)
  useEffect(() => {
    const loadIndexNames = async () => {
      try {
        dispatch({ type: "SET_LOADING", payload: true });
        const response = await searchAPI.listIndexes();
        dispatch({ type: "SET_INDEX_NAMES", payload: response.indexes });

        // Try to restore saved index from localStorage
        const savedIndex = loadCurrentIndexFromStorage();
        let indexToSelect: string | null = null;

        if (savedIndex && response.indexes.includes(savedIndex)) {
          // Saved index still exists, use it
          indexToSelect = savedIndex;
        } else if (response.indexes.length > 0) {
          // Saved index doesn't exist or no saved index, use first available
          indexToSelect = response.indexes[0];
        }

        if (indexToSelect) {
          dispatch({ type: "SET_CURRENT_INDEX", payload: indexToSelect });
        }

        // Automatically start loading details for all indexes (smart progressive loading)
        if (response.indexes.length > 0) {
          loadAllIndexDetailsProgressively(response.indexes);
        }
      } catch (error) {
        console.error("Error loading index names:", error);
        dispatch({ type: "SET_ERROR", payload: "Failed to load indexes" });
      }
    };

    loadIndexNames();
  }, []);

  // Load header fields from localStorage on mount
  useEffect(() => {
    const savedHeaderFields = loadHeaderFieldsFromStorage();
    savedHeaderFields.forEach((fieldName, indexName) => {
      dispatch({
        type: "SET_INDEX_HEADER_FIELD",
        payload: { indexName, fieldName },
      });
    });
  }, []);

  // Smart progressive loading of all index details
  const loadAllIndexDetailsProgressively = useCallback(
    async (indexNames: string[]) => {
      // Load details progressively with small delays to avoid overwhelming the backend
      for (let i = 0; i < indexNames.length; i++) {
        const indexName = indexNames[i];

        // Skip if already cached
        if (
          !state.indexDetailsCache.has(indexName) &&
          !state.loadingIndexes.has(indexName)
        ) {
          try {
            await loadIndexDetails(indexName);

            // Small delay between requests to be nice to the backend
            if (i < indexNames.length - 1) {
              await new Promise((resolve) => setTimeout(resolve, 100));
            }
          } catch (error) {
            console.error(
              `Failed to load details for index ${indexName}:`,
              error
            );
          }
        }
      }
    },
    [loadIndexDetails, state.indexDetailsCache, state.loadingIndexes]
  );

  return (
    <SearchEngineContext.Provider
      value={{
        state,
        dispatch,
        loadIndexDetails,
        getIndexDetails,
        isIndexLoading,
        loadIndexStats,
        getIndexStats,
        isStatsLoading,
        setIndexHeaderField,
        getIndexHeaderField,
      }}
    >
      {children}
    </SearchEngineContext.Provider>
  );
};
