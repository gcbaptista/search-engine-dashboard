/**
 * Core API types for Go Search Engine
 */

export interface RankingCriterion {
	field: string;
	order: 'asc' | 'desc';
}

export interface IndexSettings {
	name: string;
	searchable_fields: string[];
	filterable_fields: string[];
	ranking_criteria: RankingCriterion[];
	min_word_size_for_1_typo: number;
	min_word_size_for_2_typos: number;
	fields_without_prefix_search: string[];
	no_typo_tolerance_fields?: string[]; // Fields for which typo tolerance is disabled (only exact matches)
	distinct_field?: string; // Field to use for deduplication to avoid returning duplicate documents
}

export interface IndexSettingsUpdate {
	fields_without_prefix_search?: string[];
	no_typo_tolerance_fields?: string[];
	distinct_field?: string;
}

export interface Document {
	uuid?: string;
	title: string;
	[key: string]: any; // Allow additional properties
}

export interface SearchRequest {
	query: string;
	filters?: Record<string, any>;
	page?: number;
	page_size?: number;
}

export interface HitInfo {
	num_typos: number;
	number_exact_words: number;
}

export interface SearchHit {
	document: Document;
	score: number;
	field_matches: Record<string, string[]>;
	hit_info: HitInfo;
}

export interface SearchResult {
	hits: SearchHit[];
	total: number;
	page: number;
	page_size: number;
	took: number; // milliseconds
} 