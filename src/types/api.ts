/**
 * API Response types for Go Search Engine
 */

export interface SuccessMessage {
	message: string;
}

export interface ErrorResponse {
	error: string;
}

export interface IndexListResponse {
	indexes: string[];
	count: number;
}

export interface UpdateIndexSettingsResponse {
	message: string;
	warning?: string;
}

export interface IndexStats {
	name: string;
	document_count: number;
	searchable_fields: string[];
	filterable_fields: string[];
	typo_settings: {
		min_word_size_for_1_typo: number;
		min_word_size_for_2_typos: number;
	};
	field_settings: {
		fields_without_prefix_search: string[];
		no_typo_tolerance_fields: string[];
		distinct_field: string;
	};
} 