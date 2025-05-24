/**
 * Component prop types
 */

import { IndexSettings, Document, SearchResult } from './core';
import { IndexWithStats } from './dashboard';
import { Filter } from './filters';

export interface IndexListProps {
	indexes: IndexWithStats[];
	onEdit: (index: IndexSettings) => void;
	onDelete: (indexName: string) => void;
	onView: (indexName: string) => void;
	loading?: boolean;
}

export interface IndexFormProps {
	index?: IndexSettings;
	onSubmit: (index: IndexSettings) => Promise<void>;
	onCancel: () => void;
	loading?: boolean;
}

export interface DocumentUploadProps {
	indexName: string;
	onUpload: (documents: Document | Document[]) => Promise<void>;
	loading?: boolean;
}

export interface SearchInterfaceProps {
	indexName: string;
	availableFields: {
		searchable: string[];
		filterable: string[];
	};
	onSearch?: (results: SearchResult) => void;
}

export interface SearchResultsProps {
	results: SearchResult;
	onDocumentClick?: (document: Document) => void;
	onExport?: () => void;
	loading?: boolean;
}

export interface FilterPanelProps {
	availableFields: string[];
	filters: Filter[];
	onFiltersChange: (filters: Filter[]) => void;
} 