import apiClient from "./apiClient";
import {
	Document,
	IndexSettings,
	IndexSettingsUpdate,
	SearchRequest,
	SearchResult,
} from "../types/core";
import {
	IndexListResponse,
	SuccessMessage,
	UpdateIndexSettingsResponse,
	IndexStats,
} from "../types/api";

export class SearchEngineAPI {
	// Index Management
	async createIndex(index: IndexSettings): Promise<SuccessMessage> {
		const response = await apiClient.post("/indexes", index);
		return response.data;
	}

	async listIndexes(): Promise<IndexListResponse> {
		const response = await apiClient.get("/indexes");
		return response.data;
	}

	async getIndex(name: string): Promise<IndexSettings> {
		const response = await apiClient.get(`/indexes/${name}`);
		return response.data;
	}

	async deleteIndex(name: string): Promise<SuccessMessage> {
		const response = await apiClient.delete(`/indexes/${name}`);
		return response.data;
	}

	async getIndexStats(name: string): Promise<IndexStats> {
		const response = await apiClient.get(`/indexes/${name}/stats`);
		return response.data;
	}

	async updateIndexSettings(
		name: string,
		settings: IndexSettingsUpdate
	): Promise<UpdateIndexSettingsResponse> {
		const response = await apiClient.patch(`/indexes/${name}/settings`, settings);
		return response.data;
	}

	// Document Management
	async addDocuments(
		indexName: string,
		documents: Document | Document[]
	): Promise<SuccessMessage> {
		const response = await apiClient.put(
			`/indexes/${indexName}/documents`,
			documents
		);
		return response.data;
	}

	async deleteAllDocuments(indexName: string): Promise<SuccessMessage> {
		const response = await apiClient.delete(`/indexes/${indexName}/documents`);
		return response.data;
	}

	// Search
	async search(
		indexName: string,
		request: SearchRequest
	): Promise<SearchResult> {
		const response = await apiClient.post(
			`/indexes/${indexName}/_search`,
			request
		);
		return response.data;
	}
}

export const searchAPI = new SearchEngineAPI(); 