/**
 * Example data and fixtures
 */

import { IndexSettings, Document } from './core';

export const EXAMPLE_MOVIE_INDEX: IndexSettings = {
	name: 'movies',
	searchable_fields: ['title', 'cast', 'plot', 'genres'],
	filterable_fields: ['year', 'rating', 'director', 'genres'],
	ranking_criteria: [
		{field: 'popularity', order: 'desc'},
		{field: 'rating', order: 'desc'},
	],
	min_word_size_for_1_typo: 4,
	min_word_size_for_2_typos: 7,
	fields_without_prefix_search: [],
	distinct_field: 'title',
};

export const EXAMPLE_MOVIE_DOCUMENT: Document = {
	title: 'The Lord of the Rings: The Fellowship of the Ring',
	cast: ['Elijah Wood', 'Ian McKellen', 'Viggo Mortensen'],
	genres: ['Fantasy', 'Adventure'],
	year: 2001,
	rating: 8.8,
	director: 'Peter Jackson',
	plot: 'A meek Hobbit from the Shire and eight companions set out on a journey to destroy the powerful One Ring and save Middle-earth from the Dark Lord Sauron.',
	popularity: 95.5,
}; 