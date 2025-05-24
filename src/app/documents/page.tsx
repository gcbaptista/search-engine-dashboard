"use client";

import React, { useState } from "react";
import {
  CloudArrowUpIcon,
  DocumentIcon,
  PlusIcon,
  FilmIcon,
  CircleStackIcon,
  ArrowUpTrayIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon,
} from "@heroicons/react/24/outline";
import { useSearchEngine } from "../../context/SearchEngineContext";
import { searchAPI } from "../../lib/searchEngineApi";
import { Document } from "../../types/core";
import { EXAMPLE_MOVIE_DOCUMENT } from "../../types/examples";
import { MainLayout } from "../../components/Layout/MainLayout";

const DocumentUploadCard: React.FC<{
  selectedIndex: string | null;
  onUpload: (indexName: string, documents: Document[]) => void;
}> = ({ selectedIndex, onUpload }) => {
  // High-performance upload configuration
  const UPLOAD_CONFIG = {
    minBatchSize: 100, // Minimum documents per batch
    maxBatchSize: 1000, // Maximum documents per batch
    maxConcurrentBatches: 5, // Number of parallel batches
    batchGroupDelay: 10, // Milliseconds between batch groups
    targetRate: 5000, // Target docs/sec (for UI display)

    // Performance Notes:
    // - Increase maxBatchSize (up to 2000+) for larger documents/better network
    // - Increase maxConcurrentBatches (up to 10+) if backend can handle more load
    // - Reduce batchGroupDelay to 0-5ms for maximum speed (if backend is fast)
    // - Monitor backend performance and adjust accordingly
  };

  const [dialogOpen, setDialogOpen] = useState(false);
  const [documentText, setDocumentText] = useState("");
  const [fileImportDialog, setFileImportDialog] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [importing, setImporting] = useState(false);
  const [importProgress, setImportProgress] = useState<{
    total: number;
    processed: number;
    errors: string[];
    rate?: number; // Documents per second
    estimatedTimeRemaining?: number; // Seconds
  } | null>(null);

  const handleAddSampleData = async () => {
    if (!selectedIndex) {
      alert("Please select an index from the top navigation first");
      return;
    }

    const sampleMovies: Document[] = [
      {
        title: "The Lord of the Rings: The Fellowship of the Ring",
        cast: ["Elijah Wood", "Ian McKellen", "Viggo Mortensen"],
        genres: ["Fantasy", "Adventure"],
        year: 2001,
        rating: 8.8,
        director: "Peter Jackson",
        plot: "A meek Hobbit from the Shire and eight companions set out on a journey to destroy the powerful One Ring and save Middle-earth from the Dark Lord Sauron.",
        popularity: 95.5,
      },
      {
        title: "The Matrix",
        cast: ["Keanu Reeves", "Laurence Fishburne", "Carrie-Anne Moss"],
        genres: ["Action", "Sci-Fi"],
        year: 1999,
        rating: 8.7,
        director: "The Wachowskis",
        plot: "A computer programmer is led to fight an underground war against powerful computers who have constructed his entire reality with a system called the Matrix.",
        popularity: 92.0,
      },
      {
        title: "Inception",
        cast: ["Leonardo DiCaprio", "Marion Cotillard", "Tom Hardy"],
        genres: ["Action", "Thriller", "Sci-Fi"],
        year: 2010,
        rating: 8.8,
        director: "Christopher Nolan",
        plot: "A thief who steals corporate secrets through the use of dream-sharing technology is given the inverse task of planting an idea into the mind of a C.E.O.",
        popularity: 94.2,
      },
      {
        title: "The Dark Knight",
        cast: ["Christian Bale", "Heath Ledger", "Aaron Eckhart"],
        genres: ["Action", "Crime", "Drama"],
        year: 2008,
        rating: 9.0,
        director: "Christopher Nolan",
        plot: "When the menace known as the Joker wreaks havoc and chaos on the people of Gotham, Batman must accept one of the greatest psychological and physical tests of his ability to fight injustice.",
        popularity: 96.1,
      },
      {
        title: "Pulp Fiction",
        cast: ["John Travolta", "Samuel L. Jackson", "Uma Thurman"],
        genres: ["Crime", "Drama"],
        year: 1994,
        rating: 8.9,
        director: "Quentin Tarantino",
        plot: "The lives of two mob hitmen, a boxer, a gangster and his wife, and a pair of diner bandits intertwine in four tales of violence and redemption.",
        popularity: 88.7,
      },
    ];

    // Use the optimized upload function
    const startTime = Date.now();
    try {
      await searchAPI.addDocuments(selectedIndex, sampleMovies);
      const endTime = Date.now();
      const totalTime = (endTime - startTime) / 1000;
      const rate = sampleMovies.length / totalTime;

      console.log(
        `Sample data uploaded: ${
          sampleMovies.length
        } documents in ${totalTime.toFixed(1)}s (${Math.round(rate)} docs/sec)`
      );
      onUpload(selectedIndex, sampleMovies);
    } catch (error) {
      console.error("Sample data upload error:", error);
      alert("Failed to upload sample data. Please try again.");
    }
  };

  const handleManualUpload = () => {
    if (!selectedIndex || !documentText.trim()) {
      alert("Please select an index and enter document data");
      return;
    }

    try {
      const documents = JSON.parse(documentText);
      const docsArray = Array.isArray(documents) ? documents : [documents];
      onUpload(selectedIndex, docsArray);
      setDocumentText("");
      setDialogOpen(false);
    } catch (error) {
      alert("Invalid JSON format. Please check your document data.");
    }
  };

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && file.type === "application/json") {
      setSelectedFile(file);
    } else {
      alert("Please select a valid JSON file");
    }
  };

  const handleFileImport = async () => {
    if (!selectedIndex || !selectedFile) {
      alert("Please select an index and a JSON file");
      return;
    }

    setImporting(true);
    setImportProgress({
      total: 0,
      processed: 0,
      errors: [],
      rate: 0,
      estimatedTimeRemaining: 0,
    });

    try {
      const fileContent = await selectedFile.text();
      const parsedData = JSON.parse(fileContent);

      // Normalize to array
      const documents: Document[] = Array.isArray(parsedData)
        ? parsedData
        : [parsedData];

      setImportProgress({
        total: documents.length,
        processed: 0,
        errors: [],
        rate: 0,
        estimatedTimeRemaining: 0,
      });

      // Optimized for high throughput: larger batches, parallel processing
      const batchSize = Math.min(
        UPLOAD_CONFIG.maxBatchSize,
        Math.max(UPLOAD_CONFIG.minBatchSize, Math.ceil(documents.length / 20))
      ); // Dynamic batch size based on total documents
      const maxConcurrentBatches = UPLOAD_CONFIG.maxConcurrentBatches; // Process multiple batches in parallel

      const batches: Document[][] = [];
      for (let i = 0; i < documents.length; i += batchSize) {
        batches.push(documents.slice(i, i + batchSize));
      }

      console.log(
        `Processing ${documents.length} documents in ${batches.length} batches of ~${batchSize} documents each with ${maxConcurrentBatches} concurrent batches`
      );

      let processed = 0;
      const errors: string[] = [];
      const startTime = Date.now();

      // Process batches in parallel with concurrency control
      const processBatch = async (
        batch: Document[],
        batchIndex: number
      ): Promise<void> => {
        try {
          await searchAPI.addDocuments(selectedIndex, batch);
          processed += batch.length;

          // Update progress more frequently for better UX
          setImportProgress((prev) => {
            if (!prev) return null;
            const newProcessed = processed;
            const elapsed = (Date.now() - startTime) / 1000;
            const rate = newProcessed / elapsed;
            const remaining = prev.total - newProcessed;
            const estimatedTimeRemaining = rate > 0 ? remaining / rate : 0;

            console.log(
              `Batch ${batchIndex + 1}/${
                batches.length
              } completed. Rate: ${Math.round(rate)} docs/sec`
            );
            return {
              ...prev,
              processed: newProcessed,
              rate: Math.round(rate),
              estimatedTimeRemaining: Math.round(estimatedTimeRemaining),
            };
          });
        } catch (error) {
          const errorMsg = `Batch ${batchIndex + 1} (${
            batch.length
          } docs) failed: ${error}`;
          errors.push(errorMsg);
          console.error(errorMsg);
        }
      };

      // Process batches with controlled concurrency
      for (let i = 0; i < batches.length; i += maxConcurrentBatches) {
        const concurrentBatches = batches.slice(i, i + maxConcurrentBatches);
        const batchPromises = concurrentBatches.map((batch, index) =>
          processBatch(batch, i + index)
        );

        // Wait for this group of concurrent batches to complete before starting the next group
        await Promise.allSettled(batchPromises);

        // Small breathing room only between groups of concurrent batches
        if (i + maxConcurrentBatches < batches.length) {
          await new Promise((resolve) =>
            setTimeout(resolve, UPLOAD_CONFIG.batchGroupDelay)
          ); // Minimal configurable delay
        }
      }

      const endTime = Date.now();
      const totalTime = (endTime - startTime) / 1000;
      const finalRate = processed / totalTime;

      console.log(
        `Import completed: ${processed}/${
          documents.length
        } documents in ${totalTime.toFixed(1)}s (${Math.round(
          finalRate
        )} docs/sec)`
      );

      if (errors.length === 0) {
        alert(
          `Successfully imported ${processed} documents in ${totalTime.toFixed(
            1
          )} seconds!\nRate: ${Math.round(finalRate)} docs/sec`
        );
      } else {
        alert(
          `Imported ${processed}/${
            documents.length
          } documents in ${totalTime.toFixed(1)}s (${Math.round(
            finalRate
          )} docs/sec)\n${
            errors.length
          } batch errors occurred. Check console for details.`
        );
      }

      // Reset state
      setSelectedFile(null);
      setFileImportDialog(false);
      setImportProgress(null);

      // Reset file input
      const fileInput = document.getElementById(
        "file-input"
      ) as HTMLInputElement;
      if (fileInput) fileInput.value = "";
    } catch (error) {
      console.error("Import error:", error);
      alert("Failed to parse JSON file. Please check the file format.");
    } finally {
      setImporting(false);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();

    const files = Array.from(e.dataTransfer.files);
    const jsonFile = files.find(
      (file) => file.type === "application/json" || file.name.endsWith(".json")
    );

    if (jsonFile) {
      setSelectedFile(jsonFile);
      setFileImportDialog(true);
    } else {
      alert("Please drop a valid JSON file");
    }
  };

  return (
    <div className="gradient-card rounded-xl p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">
        Upload Documents
      </h3>

      {selectedIndex ? (
        <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
          <div className="flex items-center space-x-2 text-sm text-blue-800">
            <CircleStackIcon className="h-4 w-4" />
            <span>
              Uploading to: <span className="font-medium">{selectedIndex}</span>
            </span>
          </div>
        </div>
      ) : (
        <div className="mb-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
          <p className="text-sm text-yellow-800">
            Please select an index from the top navigation to upload documents.
          </p>
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <button
          onClick={() => setFileImportDialog(true)}
          disabled={!selectedIndex}
          className="btn-primary flex items-center justify-center space-x-2 py-3 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <ArrowUpTrayIcon className="h-5 w-5" />
          <span>Import JSON File</span>
        </button>

        <button
          onClick={handleAddSampleData}
          disabled={!selectedIndex}
          className="btn-secondary flex items-center justify-center space-x-2 py-3 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <FilmIcon className="h-5 w-5" />
          <span>Add Sample Movies</span>
        </button>

        <button
          onClick={() => setDialogOpen(true)}
          disabled={!selectedIndex}
          className="btn-secondary flex items-center justify-center space-x-2 py-3 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <PlusIcon className="h-5 w-5" />
          <span>Add Custom Document</span>
        </button>
      </div>

      {/* File Import Dialog */}
      {fileImportDialog && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-lg mx-4">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              Import JSON File
            </h2>

            {!importing ? (
              <>
                <div
                  className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-blue-500 transition-colors cursor-pointer"
                  onDragOver={handleDragOver}
                  onDrop={handleDrop}
                  onClick={() => document.getElementById("file-input")?.click()}
                >
                  <CloudArrowUpIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  {selectedFile ? (
                    <div>
                      <p className="text-green-600 font-medium">
                        {selectedFile.name}
                      </p>
                      <p className="text-sm text-gray-500 mt-1">
                        {(selectedFile.size / 1024).toFixed(1)} KB
                      </p>
                    </div>
                  ) : (
                    <div>
                      <p className="text-gray-600 mb-2">
                        Drag & drop a JSON file here, or click to select
                      </p>
                      <p className="text-xs text-gray-500">
                        Supports single document or array of documents
                      </p>
                    </div>
                  )}
                </div>

                <input
                  id="file-input"
                  type="file"
                  accept=".json,application/json"
                  onChange={handleFileSelect}
                  className="hidden"
                />

                {selectedFile && (
                  <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                    <div className="flex items-start space-x-2">
                      <CheckCircleIcon className="h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0" />
                      <div className="text-sm">
                        <p className="text-blue-800 font-medium">
                          File ready for high-speed import
                        </p>
                        <p className="text-blue-600">
                          Documents will be uploaded using parallel processing
                          with large batches for maximum throughput (target:
                          5000+ docs/sec).
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                <div className="flex justify-end space-x-3 mt-6">
                  <button
                    onClick={() => {
                      setFileImportDialog(false);
                      setSelectedFile(null);
                    }}
                    className="btn-secondary"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleFileImport}
                    disabled={!selectedFile}
                    className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Import Documents
                  </button>
                </div>
              </>
            ) : (
              <div className="text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  Importing Documents...
                </h3>

                {importProgress && (
                  <div className="space-y-3">
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                        style={{
                          width: `${
                            (importProgress.processed / importProgress.total) *
                            100
                          }%`,
                        }}
                      ></div>
                    </div>
                    <div className="flex justify-between items-center text-sm text-gray-600">
                      <span>
                        {importProgress.processed.toLocaleString()} /{" "}
                        {importProgress.total.toLocaleString()} documents
                        processed
                      </span>
                      {importProgress.rate && importProgress.rate > 0 && (
                        <span className="font-medium text-blue-600">
                          {importProgress.rate.toLocaleString()} docs/sec
                        </span>
                      )}
                    </div>
                    {importProgress.estimatedTimeRemaining &&
                      importProgress.estimatedTimeRemaining > 0 && (
                        <div className="text-xs text-gray-500 text-center">
                          Estimated time remaining:{" "}
                          {importProgress.estimatedTimeRemaining}s
                        </div>
                      )}

                    {importProgress.errors.length > 0 && (
                      <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                        <div className="flex items-start space-x-2">
                          <ExclamationTriangleIcon className="h-5 w-5 text-yellow-600 mt-0.5 flex-shrink-0" />
                          <div className="text-sm">
                            <p className="text-yellow-800 font-medium">
                              {importProgress.errors.length} batch error(s)
                              occurred
                            </p>
                            <p className="text-yellow-700">
                              Import will continue with remaining documents.
                            </p>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Custom Document Dialog */}
      {dialogOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-2xl mx-4 max-h-[80vh] overflow-y-auto">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              Add Custom Document
            </h2>
            <p className="text-gray-600 mb-4">
              Enter your document data in JSON format. You can add a single
              document or an array of documents.
            </p>
            <textarea
              rows={10}
              placeholder={JSON.stringify(EXAMPLE_MOVIE_DOCUMENT, null, 2)}
              value={documentText}
              onChange={(e) => setDocumentText(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 font-mono text-sm"
            />
            <div className="flex justify-end space-x-3 mt-4">
              <button
                onClick={() => setDialogOpen(false)}
                className="btn-secondary"
              >
                Cancel
              </button>
              <button onClick={handleManualUpload} className="btn-primary">
                Upload Document
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const DocumentStatsCard: React.FC = () => {
  const { state } = useSearchEngine();

  return (
    <div className="gradient-card rounded-xl p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">
        Document Statistics
      </h3>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: "Total Docs", value: "1.2K", color: "blue" },
          { label: "Added Today", value: "156", color: "green" },
          { label: "Pending", value: "23", color: "orange" },
          { label: "Failed", value: "2", color: "red" },
        ].map((stat, index) => (
          <div key={index} className="text-center">
            <div className="text-2xl font-bold text-gray-900">{stat.value}</div>
            <div className="text-sm text-gray-600">{stat.label}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

const RecentDocumentsCard: React.FC = () => {
  const recentDocs = [
    {
      title: "The Matrix",
      index: "movies",
      uploadedAt: "2 minutes ago",
      status: "success",
    },
    {
      title: "Inception",
      index: "movies",
      uploadedAt: "5 minutes ago",
      status: "success",
    },
    {
      title: "The Dark Knight",
      index: "movies",
      uploadedAt: "10 minutes ago",
      status: "success",
    },
    {
      title: "Pulp Fiction",
      index: "movies",
      uploadedAt: "15 minutes ago",
      status: "pending",
    },
  ];

  return (
    <div className="gradient-card rounded-xl p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">
        Recent Documents
      </h3>
      <div className="space-y-3">
        {recentDocs.map((doc, index) => (
          <div
            key={index}
            className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
          >
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-purple-500 to-purple-600 flex items-center justify-center">
                <DocumentIcon className="h-5 w-5 text-white" />
              </div>
              <div>
                <p className="font-medium text-gray-900">{doc.title}</p>
                <p className="text-sm text-gray-500">Index: {doc.index}</p>
              </div>
            </div>
            <div className="text-right">
              <span
                className={`chip-${
                  doc.status === "success"
                    ? "green"
                    : doc.status === "pending"
                    ? "orange"
                    : "red"
                }`}
              >
                {doc.status}
              </span>
              <p className="text-xs text-gray-500 mt-1">{doc.uploadedAt}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

const DangerZoneCard: React.FC<{
  selectedIndex: string | null;
  onSuccess: (message: string) => void;
  onError: (message: string) => void;
}> = ({ selectedIndex, onSuccess, onError }) => {
  const [isDeleting, setIsDeleting] = useState(false);
  const [confirmDialog, setConfirmDialog] = useState(false);
  const [confirmText, setConfirmText] = useState("");

  const handleDeleteAllDocuments = async () => {
    if (!selectedIndex) {
      onError("Please select an index first");
      return;
    }

    if (confirmText !== `DELETE ALL FROM ${selectedIndex}`) {
      onError("Please type the exact confirmation text");
      return;
    }

    setIsDeleting(true);
    try {
      const startTime = Date.now();
      await searchAPI.deleteAllDocuments(selectedIndex);
      const endTime = Date.now();
      const totalTime = (endTime - startTime) / 1000;

      onSuccess(
        `Successfully deleted all documents from "${selectedIndex}" in ${totalTime.toFixed(
          1
        )}s`
      );
      setConfirmDialog(false);
      setConfirmText("");
    } catch (error) {
      console.error("Delete all documents error:", error);
      onError("Failed to delete all documents. Please try again.");
    } finally {
      setIsDeleting(false);
    }
  };

  const openConfirmDialog = () => {
    if (!selectedIndex) {
      onError("Please select an index from the top navigation first");
      return;
    }
    setConfirmDialog(true);
    setConfirmText("");
  };

  const closeConfirmDialog = () => {
    setConfirmDialog(false);
    setConfirmText("");
  };

  return (
    <>
      <div className="border border-red-200 rounded-xl p-6 bg-red-50">
        <h3 className="text-lg font-semibold text-red-900 mb-2">Danger Zone</h3>
        <p className="text-sm text-red-700 mb-4">
          Destructive actions that cannot be undone. Use with extreme caution.
        </p>

        <div className="p-4 bg-white border border-red-200 rounded-lg">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <h4 className="text-md font-medium text-gray-900 mb-1">
                Delete All Documents
              </h4>
              <p className="text-sm text-gray-600 mb-3">
                Remove all documents from the "{selectedIndex || "selected"}"
                index. This action cannot be undone.
              </p>
              {selectedIndex ? (
                <div className="mb-3 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                  <div className="flex items-center space-x-2 text-sm text-yellow-800">
                    <ExclamationTriangleIcon className="h-4 w-4" />
                    <span>
                      This will permanently delete all documents in{" "}
                      <span className="font-medium">{selectedIndex}</span>
                    </span>
                  </div>
                </div>
              ) : (
                <div className="mb-3 p-3 bg-gray-50 border border-gray-200 rounded-lg">
                  <p className="text-sm text-gray-600">
                    Select an index from the top navigation to enable this
                    action.
                  </p>
                </div>
              )}
            </div>
            <button
              onClick={openConfirmDialog}
              disabled={!selectedIndex || isDeleting}
              className="ml-4 px-4 py-2 bg-red-600 hover:bg-red-700 disabled:bg-gray-300 disabled:cursor-not-allowed text-white text-sm font-medium rounded-lg transition-colors"
            >
              {isDeleting ? "Deleting..." : "Delete All Documents"}
            </button>
          </div>
        </div>
      </div>

      {/* Confirmation Dialog */}
      {confirmDialog && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-md mx-4">
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center">
                <ExclamationTriangleIcon className="h-6 w-6 text-red-600" />
              </div>
              <h2 className="text-xl font-semibold text-gray-900">
                Confirm Deletion
              </h2>
            </div>

            <div className="mb-4">
              <p className="text-gray-600 mb-3">
                This will permanently delete <strong>ALL documents</strong> from
                the index:
              </p>
              <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                <p className="font-medium text-red-900">{selectedIndex}</p>
              </div>
            </div>

            <div className="mb-4">
              <p className="text-sm text-gray-600 mb-2">
                To confirm, type the following text exactly:
              </p>
              <div className="p-2 bg-gray-100 rounded border font-mono text-sm mb-2">
                DELETE ALL FROM {selectedIndex}
              </div>
              <input
                type="text"
                value={confirmText}
                onChange={(e) => setConfirmText(e.target.value)}
                placeholder="Type confirmation text here..."
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                autoFocus
              />
            </div>

            <div className="flex justify-end space-x-3">
              <button
                onClick={closeConfirmDialog}
                disabled={isDeleting}
                className="px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteAllDocuments}
                disabled={
                  isDeleting ||
                  confirmText !== `DELETE ALL FROM ${selectedIndex}`
                }
                className="px-4 py-2 bg-red-600 hover:bg-red-700 disabled:bg-gray-300 disabled:cursor-not-allowed text-white rounded-lg transition-colors"
              >
                {isDeleting ? (
                  <div className="flex items-center space-x-2">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    <span>Deleting...</span>
                  </div>
                ) : (
                  "Delete All Documents"
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default function DocumentsPage() {
  const { state } = useSearchEngine();
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  // Use the globally selected index
  const selectedIndex = state.currentIndex;

  const handleUpload = async (indexName: string, documents: Document[]) => {
    try {
      await searchAPI.addDocuments(indexName, documents);
      setSuccess(
        `Successfully uploaded ${documents.length} document(s) to ${indexName}`
      );
      setTimeout(() => setSuccess(null), 5000);
    } catch (error) {
      setError("Failed to upload documents. Please try again.");
      console.error("Upload error:", error);
    }
  };

  return (
    <MainLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Document Management
          </h1>
          <p className="text-gray-600">
            {selectedIndex
              ? `Upload and manage documents in the "${selectedIndex}" index`
              : "Select an index from the top navigation to manage documents"}
          </p>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <div className="flex justify-between items-center">
              <p className="text-red-800">{error}</p>
              <button
                onClick={() => setError(null)}
                className="text-red-600 hover:text-red-800"
              >
                ×
              </button>
            </div>
          </div>
        )}

        {success && (
          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <div className="flex justify-between items-center">
              <p className="text-green-800">{success}</p>
              <button
                onClick={() => setSuccess(null)}
                className="text-green-600 hover:text-green-800"
              >
                ×
              </button>
            </div>
          </div>
        )}

        {!selectedIndex ? (
          <div className="gradient-card rounded-xl p-12 text-center">
            <CircleStackIcon className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Select an Index
            </h3>
            <p className="text-gray-600 mb-4">
              Choose an index from the dropdown in the top navigation to start
              managing documents
            </p>
            <a href="/indexes" className="btn-primary">
              View Available Indexes
            </a>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <DocumentUploadCard
                selectedIndex={selectedIndex}
                onUpload={handleUpload}
              />
              <DocumentStatsCard />
            </div>

            <RecentDocumentsCard />
            <DangerZoneCard
              selectedIndex={selectedIndex}
              onSuccess={setSuccess}
              onError={setError}
            />
          </>
        )}
      </div>
    </MainLayout>
  );
}
