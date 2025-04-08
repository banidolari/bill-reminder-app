'use client';

import { useState } from 'react';
import { FiFile, FiDownload, FiTrash2, FiEye, FiEdit, FiImage } from 'react-icons/fi';

// Mock data for bill documents
const mockDocuments = [
  { id: '1', billId: '1', fileName: 'electricity_bill_april.jpg', fileType: 'image/jpeg', fileSize: 1240000, uploadDate: '2025-04-07T10:30:00Z', thumbnailUrl: '/placeholder-image.jpg' },
  { id: '2', billId: '3', fileName: 'rent_receipt_may.pdf', fileType: 'application/pdf', fileSize: 580000, uploadDate: '2025-04-05T14:15:00Z', thumbnailUrl: '/placeholder-pdf.jpg' },
  { id: '3', billId: '4', fileName: 'netflix_invoice.png', fileType: 'image/png', fileSize: 950000, uploadDate: '2025-04-02T09:45:00Z', thumbnailUrl: '/placeholder-image.jpg' },
];

export default function DocumentsManager() {
  const [documents, setDocuments] = useState(mockDocuments);
  const [selectedDocument, setSelectedDocument] = useState(null);
  const [viewMode, setViewMode] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const formatFileSize = (bytes) => {
    if (bytes < 1024) return bytes + ' B';
    else if (bytes < 1048576) return (bytes / 1024).toFixed(1) + ' KB';
    else return (bytes / 1048576).toFixed(1) + ' MB';
  };

  const handleViewDocument = (document) => {
    setSelectedDocument(document);
    setViewMode(true);
  };

  const handleDeleteDocument = (id) => {
    if (window.confirm('Are you sure you want to delete this document?')) {
      setDocuments(documents.filter(doc => doc.id !== id));
      setSuccess('Document deleted successfully');
      
      // Clear success message after 3 seconds
      setTimeout(() => {
        setSuccess('');
      }, 3000);
    }
  };

  const handleProcessOCR = async (id) => {
    setIsLoading(true);
    setError('');
    setSuccess('');
    
    try {
      // This would be an API call in a real app
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      setSuccess('Document processed with OCR successfully');
      
      // Clear success message after 3 seconds
      setTimeout(() => {
        setSuccess('');
      }, 3000);
    } catch (err) {
      setError('Failed to process document with OCR');
      
      // Clear error message after 3 seconds
      setTimeout(() => {
        setError('');
      }, 3000);
    } finally {
      setIsLoading(false);
    }
  };

  const closeViewer = () => {
    setSelectedDocument(null);
    setViewMode(false);
  };

  return (
    <div className="space-y-6">
      <div className="md:flex md:items-center md:justify-between">
        <div className="flex-1 min-w-0">
          <h2 className="text-2xl font-bold leading-7 text-gray-900 sm:text-3xl sm:truncate">
            Bill Documents
          </h2>
          <p className="mt-1 text-sm text-gray-500">
            View and manage your bill documents and scanned images.
          </p>
        </div>
        <div className="mt-4 flex md:mt-0 md:ml-4">
          <a
            href="/bills/scan"
            className="ml-3 inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            <FiImage className="-ml-1 mr-2 h-5 w-5" />
            Scan New Bill
          </a>
        </div>
      </div>

      {error && (
        <div className="bg-red-50 border-l-4 border-red-400 p-4">
          <div className="flex">
            <div className="ml-3">
              <p className="text-sm text-red-700">{error}</p>
            </div>
          </div>
        </div>
      )}

      {success && (
        <div className="bg-green-50 border-l-4 border-green-400 p-4">
          <div className="flex">
            <div className="ml-3">
              <p className="text-sm text-green-700">{success}</p>
            </div>
          </div>
        </div>
      )}

      {/* Document List */}
      <div className="bg-white shadow overflow-hidden sm:rounded-md">
        <ul className="divide-y divide-gray-200">
          {documents.length > 0 ? (
            documents.map((document) => (
              <li key={document.id}>
                <div className="px-4 py-4 flex items-center sm:px-6">
                  <div className="min-w-0 flex-1 sm:flex sm:items-center sm:justify-between">
                    <div className="flex items-center">
                      <div className="flex-shrink-0">
                        {document.fileType.startsWith('image/') ? (
                          <div className="h-12 w-12 rounded-md bg-blue-100 flex items-center justify-center">
                            <FiImage className="h-6 w-6 text-blue-600" />
                          </div>
                        ) : (
                          <div className="h-12 w-12 rounded-md bg-red-100 flex items-center justify-center">
                            <FiFile className="h-6 w-6 text-red-600" />
                          </div>
                        )}
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">{document.fileName}</div>
                        <div className="text-sm text-gray-500">
                          {formatFileSize(document.fileSize)} • Uploaded on {new Date(document.uploadDate).toLocaleDateString()}
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="ml-5 flex-shrink-0 flex space-x-2">
                    <button
                      type="button"
                      onClick={() => handleViewDocument(document)}
                      className="text-blue-600 hover:text-blue-900"
                      title="View Document"
                    >
                      <FiEye className="h-5 w-5" />
                    </button>
                    <button
                      type="button"
                      onClick={() => handleProcessOCR(document.id)}
                      disabled={isLoading}
                      className={`text-green-600 hover:text-green-900 ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
                      title="Process with OCR"
                    >
                      <FiEdit className="h-5 w-5" />
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDeleteDocument(document.id)}
                      className="text-red-600 hover:text-red-900"
                      title="Delete Document"
                    >
                      <FiTrash2 className="h-5 w-5" />
                    </button>
                    <a
                      href="#"
                      className="text-gray-600 hover:text-gray-900"
                      title="Download Document"
                    >
                      <FiDownload className="h-5 w-5" />
                    </a>
                  </div>
                </div>
              </li>
            ))
          ) : (
            <li className="px-4 py-5 text-center text-gray-500">
              No documents found. Scan a bill or upload a document to get started.
            </li>
          )}
        </ul>
      </div>

      {/* Document Viewer Modal */}
      {viewMode && selectedDocument && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 transition-opacity" aria-hidden="true">
              <div className="absolute inset-0 bg-gray-500 opacity-75" onClick={closeViewer}></div>
            </div>

            <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>

            <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-4xl sm:w-full">
              <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                <div className="sm:flex sm:items-start">
                  <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left w-full">
                    <h3 className="text-lg leading-6 font-medium text-gray-900" id="modal-title">
                      {selectedDocument.fileName}
                    </h3>
                    <div className="mt-4 bg-gray-100 rounded-lg p-2 flex justify-center">
                      {selectedDocument.fileType.startsWith('image/') ? (
                        <img
                          src={selectedDocument.thumbnailUrl}
                          alt={selectedDocument.fileName}
                          className="max-h-96 object-contain"
                        />
                      ) : (
                        <div className="h-96 w-full flex items-center justify-center">
                          <div className="text-center">
                            <FiFile className="h-16 w-16 text-gray-400 mx-auto" />
                            <p className="mt-2 text-sm text-gray-500">
                              Preview not available for this file type
                            </p>
                            <button
                              type="button"
                              className="mt-4 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                            >
                              <FiDownload className="-ml-1 mr-2 h-5 w-5" />
                              Download to View
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
              <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                <button
                  type="button"
                  onClick={closeViewer}
                  className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
