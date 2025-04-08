import { NextRequest, NextResponse } from 'next/server';
import { D1Database } from '@cloudflare/workers-types';
import { v4 as uuidv4 } from 'uuid';

// Helper function to verify authorization
import { verifyAuth } from './auth-helpers';

// Get all documents for a user
export async function getDocuments(
  request: NextRequest,
  env: { DB: D1Database }
) {
  try {
    // Verify authentication
    const userId = await verifyAuth(request);
    if (!userId) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Get query parameters
    const url = new URL(request.url);
    const billId = url.searchParams.get('billId');
    
    // Build query
    let query = 'SELECT d.*, b.name as bill_name FROM documents d LEFT JOIN bills b ON d.bill_id = b.id WHERE d.user_id = ?';
    const queryParams = [userId];
    
    if (billId) {
      query += ' AND d.bill_id = ?';
      queryParams.push(billId);
    }
    
    query += ' ORDER BY d.created_at DESC';
    
    // Execute query
    const documents = await env.DB.prepare(query)
      .bind(...queryParams)
      .all();
    
    return NextResponse.json({ documents: documents.results });
  } catch (error) {
    console.error('Get documents error:', error);
    return NextResponse.json(
      { error: 'An error occurred while fetching documents' },
      { status: 500 }
    );
  }
}

// Get a single document by ID
export async function getDocument(
  request: NextRequest,
  env: { DB: D1Database },
  { params }: { params: { id: string } }
) {
  try {
    // Verify authentication
    const userId = await verifyAuth(request);
    if (!userId) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Get document from database
    const document = await env.DB.prepare(
      'SELECT d.*, b.name as bill_name FROM documents d LEFT JOIN bills b ON d.bill_id = b.id WHERE d.id = ? AND d.user_id = ?'
    )
      .bind(params.id, userId)
      .first();

    if (!document) {
      return NextResponse.json(
        { error: 'Document not found' },
        { status: 404 }
      );
    }

    // Parse OCR data if available
    if (document.ocr_data) {
      try {
        document.ocr_data = JSON.parse(document.ocr_data);
      } catch (e) {
        console.error('Error parsing OCR data:', e);
      }
    }

    return NextResponse.json({ document });
  } catch (error) {
    console.error('Get document error:', error);
    return NextResponse.json(
      { error: 'An error occurred while fetching the document' },
      { status: 500 }
    );
  }
}

// Create a new document
export async function createDocument(
  request: NextRequest,
  env: { DB: D1Database }
) {
  try {
    // Verify authentication
    const userId = await verifyAuth(request);
    if (!userId) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Get request body
    const { 
      bill_id, 
      file_name, 
      file_type, 
      file_size, 
      file_path, 
      thumbnail_path 
    } = await request.json();

    // Validate input
    if (!file_name || !file_type || !file_size || !file_path) {
      return NextResponse.json(
        { error: 'File name, type, size, and path are required' },
        { status: 400 }
      );
    }

    // If bill_id is provided, check if it exists and belongs to user
    if (bill_id) {
      const bill = await env.DB.prepare(
        'SELECT * FROM bills WHERE id = ? AND user_id = ?'
      )
        .bind(bill_id, userId)
        .first();

      if (!bill) {
        return NextResponse.json(
          { error: 'Bill not found' },
          { status: 404 }
        );
      }
    }

    // Generate document ID
    const documentId = uuidv4();

    // Insert document into database
    await env.DB.prepare(
      'INSERT INTO documents (id, user_id, bill_id, file_name, file_type, file_size, file_path, thumbnail_path) ' +
      'VALUES (?, ?, ?, ?, ?, ?, ?, ?)'
    )
      .bind(
        documentId, 
        userId, 
        bill_id || null, 
        file_name, 
        file_type, 
        file_size, 
        file_path, 
        thumbnail_path || null
      )
      .run();

    // Get the created document
    const document = await env.DB.prepare(
      'SELECT * FROM documents WHERE id = ?'
    )
      .bind(documentId)
      .first();

    return NextResponse.json({ 
      message: 'Document created successfully',
      document
    });
  } catch (error) {
    console.error('Create document error:', error);
    return NextResponse.json(
      { error: 'An error occurred while creating the document' },
      { status: 500 }
    );
  }
}

// Update a document
export async function updateDocument(
  request: NextRequest,
  env: { DB: D1Database },
  { params }: { params: { id: string } }
) {
  try {
    // Verify authentication
    const userId = await verifyAuth(request);
    if (!userId) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Check if document exists and belongs to user
    const existingDocument = await env.DB.prepare(
      'SELECT * FROM documents WHERE id = ? AND user_id = ?'
    )
      .bind(params.id, userId)
      .first();

    if (!existingDocument) {
      return NextResponse.json(
        { error: 'Document not found' },
        { status: 404 }
      );
    }

    // Get request body
    const { 
      bill_id, 
      file_name, 
      ocr_processed, 
      ocr_data 
    } = await request.json();

    // If bill_id is provided, check if it exists and belongs to user
    if (bill_id) {
      const bill = await env.DB.prepare(
        'SELECT * FROM bills WHERE id = ? AND user_id = ?'
      )
        .bind(bill_id, userId)
        .first();

      if (!bill) {
        return NextResponse.json(
          { error: 'Bill not found' },
          { status: 404 }
        );
      }
    }

    // Update document in database
    await env.DB.prepare(
      'UPDATE documents SET ' +
      'bill_id = ?, file_name = ?, ocr_processed = ?, ocr_data = ?, updated_at = CURRENT_TIMESTAMP ' +
      'WHERE id = ? AND user_id = ?'
    )
      .bind(
        bill_id || null, 
        file_name || existingDocument.file_name, 
        ocr_processed !== undefined ? (ocr_processed ? 1 : 0) : existingDocument.ocr_processed, 
        ocr_data ? JSON.stringify(ocr_data) : existingDocument.ocr_data,
        params.id,
        userId
      )
      .run();

    // Get the updated document
    const document = await env.DB.prepare(
      'SELECT * FROM documents WHERE id = ?'
    )
      .bind(params.id)
      .first();

    // Parse OCR data if available
    if (document.ocr_data) {
      try {
        document.ocr_data = JSON.parse(document.ocr_data);
      } catch (e) {
        console.error('Error parsing OCR data:', e);
      }
    }

    return NextResponse.json({ 
      message: 'Document updated successfully',
      document
    });
  } catch (error) {
    console.error('Update document error:', error);
    return NextResponse.json(
      { error: 'An error occurred while updating the document' },
      { status: 500 }
    );
  }
}

// Delete a document
export async function deleteDocument(
  request: NextRequest,
  env: { DB: D1Database },
  { params }: { params: { id: string } }
) {
  try {
    // Verify authentication
    const userId = await verifyAuth(request);
    if (!userId) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Check if document exists and belongs to user
    const existingDocument = await env.DB.prepare(
      'SELECT * FROM documents WHERE id = ? AND user_id = ?'
    )
      .bind(params.id, userId)
      .first();

    if (!existingDocument) {
      return NextResponse.json(
        { error: 'Document not found' },
        { status: 404 }
      );
    }

    // Delete document from database
    await env.DB.prepare(
      'DELETE FROM documents WHERE id = ? AND user_id = ?'
    )
      .bind(params.id, userId)
      .run();

    return NextResponse.json({ 
      message: 'Document deleted successfully' 
    });
  } catch (error) {
    console.error('Delete document error:', error);
    return NextResponse.json(
      { error: 'An error occurred while deleting the document' },
      { status: 500 }
    );
  }
}

// Process document with OCR
export async function processDocumentOCR(
  request: NextRequest,
  env: { DB: D1Database },
  { params }: { params: { id: string } }
) {
  try {
    // Verify authentication
    const userId = await verifyAuth(request);
    if (!userId) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Check if document exists and belongs to user
    const existingDocument = await env.DB.prepare(
      'SELECT * FROM documents WHERE id = ? AND user_id = ?'
    )
      .bind(params.id, userId)
      .first();

    if (!existingDocument) {
      return NextResponse.json(
        { error: 'Document not found' },
        { status: 404 }
      );
    }

    // In a real application, this would call an OCR service
    // For this demo, we'll simulate OCR processing with mock data
    const mockOcrData = {
      text: "ACME Utilities\nInvoice #12345\nDate: 2025-04-01\nDue Date: 2025-04-15\nAmount Due: $85.50\nService Period: March 2025",
      extracted: {
        vendor: "ACME Utilities",
        invoice_number: "12345",
        issue_date: "2025-04-01",
        due_date: "2025-04-15",
        amount: 85.50,
        service_period: "March 2025"
      },
      confidence: 0.92
    };

    // Update document with OCR data
    await env.DB.prepare(
      'UPDATE documents SET ocr_processed = 1, ocr_data = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?'
    )
      .bind(JSON.stringify(mockOcrData), params.id)
      .run();

    return NextResponse.json({ 
      message: 'Document processed successfully',
      ocr_data: mockOcrData
    });
  } catch (error) {
    console.error('Process document OCR error:', error);
    return NextResponse.json(
      { error: 'An error occurred while processing the document' },
      { status: 500 }
    );
  }
}
