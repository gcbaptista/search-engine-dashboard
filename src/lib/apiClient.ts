import axios from "axios";

const apiClient = axios.create({
	baseURL: "/api/proxy",
	headers: {
		"Content-Type": "application/json",
	},
	timeout: 10000,
});

// Request interceptor for logging
apiClient.interceptors.request.use((config) => {
	console.log(`API Request: ${config.method?.toUpperCase()} ${config.url}`);
	return config;
});

// Response interceptor for error handling
apiClient.interceptors.response.use(
	(response) => response,
	(error) => {
		console.error("API Error:", error.response?.data || error.message);
		return Promise.reject(error);
	}
);

export default apiClient; 