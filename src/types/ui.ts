/**
 * UI state and component types
 */

import { Filter } from './filters';

export interface PaginationState {
	page: number;
	pageSize: number;
	total: number;
}

export interface LoadingState {
	isLoading: boolean;
	error?: string | null;
}

export interface SearchFormState {
	query: string;
	filters: Filter[];
	page: number;
	pageSize: number;
}

export const DEFAULT_PAGE_SIZE = 10;
export const MAX_PAGE_SIZE = 100;
export const DEFAULT_PAGINATION: PaginationState = {
	page: 1,
	pageSize: DEFAULT_PAGE_SIZE,
	total: 0,
}; 