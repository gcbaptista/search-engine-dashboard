/**
 * Dashboard-specific types and extensions
 */

import { IndexSettings } from './core';

export interface IndexWithStats extends IndexSettings {
	document_count?: number;
	size_bytes?: number;
	created_at?: string;
	last_updated?: string;
}

export interface SearchHistory {
	id: string;
	timestamp: string;
	index_name: string;
	query: string;
	filters: Record<string, any>;
	result_count: number;
	response_time: number;
}

export interface IndexStatistics {
	name: string;
	document_count: number;
	size_bytes: number;
	total_searches: number;
	avg_response_time: number;
	popular_queries: { query: string; count: number }[];
} 