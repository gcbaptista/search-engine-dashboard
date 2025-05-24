/**
 * Filter types for search functionality
 */

export type FilterOperator =
	| '_exact'
	| '_ne'
	| '_gt'
	| '_gte'
	| '_lt'
	| '_lte'
	| '_contains'
	| '_ncontains'
	| '_contains_any_of';

export interface Filter {
	field: string;
	operator: FilterOperator | '';
	value: any;
}

export const FILTER_OPERATORS: { value: FilterOperator | ''; label: string }[] = [
	{value: '', label: 'Equals'},
	{value: '_ne', label: 'Not equals'},
	{value: '_gt', label: 'Greater than'},
	{value: '_gte', label: 'Greater than or equal'},
	{value: '_lt', label: 'Less than'},
	{value: '_lte', label: 'Less than or equal'},
	{value: '_contains', label: 'Contains'},
	{value: '_ncontains', label: 'Does not contain'},
	{value: '_contains_any_of', label: 'Contains any of'},
]; 