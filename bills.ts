import { NextRequest, NextResponse } from 'next/server';
import { D1Database } from '@cloudflare/workers-types';
import { v4 as uuidv4 } from 'uuid';

// Helper function to verify authorization
import { verifyAuth } from './auth-helpers';

// Get all bills for a user
export async function getBills(
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
    const status = url.searchParams.get('status');
    const category = url.searchParams.get('category');
    const sortBy = url.searchParams.get('sortBy') || 'due_date';
    const sortOrder = url.searchParams.get('sortOrder') || 'asc';
    
    // Build query
    let query = 'SELECT b.*, c.name as category_name, c.color as category_color, c.icon as category_icon, ' +
                'pm.name as payment_method_name, pm.type as payment_method_type ' +
                'FROM bills b ' +
                'LEFT JOIN categories c ON b.category_id = c.id ' +
                'LEFT JOIN payment_methods pm ON b.payment_method_id = pm.id ' +
                'WHERE b.user_id = ?';
    
    const queryParams = [userId];
    
    if (status) {
      query += ' AND b.status = ?';
      queryParams.push(status);
    }
    
    if (category) {
      query += ' AND b.category_id = ?';
      queryParams.push(category);
    }
    
    query += ` ORDER BY b.${sortBy} ${sortOrder}`;
    
    // Execute query
    const bills = await env.DB.prepare(query)
      .bind(...queryParams)
      .all();
    
    return NextResponse.json({ bills: bills.results });
  } catch (error) {
    console.error('Get bills error:', error);
    return NextResponse.json(
      { error: 'An error occurred while fetching bills' },
      { status: 500 }
    );
  }
}

// Get a single bill by ID
export async function getBill(
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

    // Get bill from database
    const bill = await env.DB.prepare(
      'SELECT b.*, c.name as category_name, c.color as category_color, c.icon as category_icon, ' +
      'pm.name as payment_method_name, pm.type as payment_method_type ' +
      'FROM bills b ' +
      'LEFT JOIN categories c ON b.category_id = c.id ' +
      'LEFT JOIN payment_methods pm ON b.payment_method_id = pm.id ' +
      'WHERE b.id = ? AND b.user_id = ?'
    )
      .bind(params.id, userId)
      .first();

    if (!bill) {
      return NextResponse.json(
        { error: 'Bill not found' },
        { status: 404 }
      );
    }

    // Get documents associated with this bill
    const documents = await env.DB.prepare(
      'SELECT id, file_name, file_type, file_size, file_path, thumbnail_path, created_at ' +
      'FROM documents ' +
      'WHERE bill_id = ? AND user_id = ?'
    )
      .bind(params.id, userId)
      .all();

    return NextResponse.json({ 
      bill,
      documents: documents.results
    });
  } catch (error) {
    console.error('Get bill error:', error);
    return NextResponse.json(
      { error: 'An error occurred while fetching the bill' },
      { status: 500 }
    );
  }
}

// Create a new bill
export async function createBill(
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
      name, 
      amount, 
      due_date, 
      category_id, 
      payment_method_id, 
      status, 
      recurrence, 
      recurrence_details, 
      notes 
    } = await request.json();

    // Validate input
    if (!name || !amount || !due_date || !status) {
      return NextResponse.json(
        { error: 'Name, amount, due date, and status are required' },
        { status: 400 }
      );
    }

    // Generate bill ID
    const billId = uuidv4();

    // Insert bill into database
    await env.DB.prepare(
      'INSERT INTO bills (id, user_id, name, amount, due_date, category_id, payment_method_id, status, recurrence, recurrence_details, notes) ' +
      'VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)'
    )
      .bind(
        billId, 
        userId, 
        name, 
        amount, 
        due_date, 
        category_id || null, 
        payment_method_id || null, 
        status, 
        recurrence || null, 
        recurrence_details ? JSON.stringify(recurrence_details) : null, 
        notes || null
      )
      .run();

    // Get the created bill
    const bill = await env.DB.prepare(
      'SELECT b.*, c.name as category_name, c.color as category_color, c.icon as category_icon, ' +
      'pm.name as payment_method_name, pm.type as payment_method_type ' +
      'FROM bills b ' +
      'LEFT JOIN categories c ON b.category_id = c.id ' +
      'LEFT JOIN payment_methods pm ON b.payment_method_id = pm.id ' +
      'WHERE b.id = ?'
    )
      .bind(billId)
      .first();

    return NextResponse.json({ 
      message: 'Bill created successfully',
      bill
    });
  } catch (error) {
    console.error('Create bill error:', error);
    return NextResponse.json(
      { error: 'An error occurred while creating the bill' },
      { status: 500 }
    );
  }
}

// Update a bill
export async function updateBill(
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

    // Check if bill exists and belongs to user
    const existingBill = await env.DB.prepare(
      'SELECT * FROM bills WHERE id = ? AND user_id = ?'
    )
      .bind(params.id, userId)
      .first();

    if (!existingBill) {
      return NextResponse.json(
        { error: 'Bill not found' },
        { status: 404 }
      );
    }

    // Get request body
    const { 
      name, 
      amount, 
      due_date, 
      category_id, 
      payment_method_id, 
      status, 
      recurrence, 
      recurrence_details, 
      notes 
    } = await request.json();

    // Update bill in database
    await env.DB.prepare(
      'UPDATE bills SET ' +
      'name = ?, amount = ?, due_date = ?, category_id = ?, payment_method_id = ?, ' +
      'status = ?, recurrence = ?, recurrence_details = ?, notes = ?, updated_at = CURRENT_TIMESTAMP ' +
      'WHERE id = ? AND user_id = ?'
    )
      .bind(
        name, 
        amount, 
        due_date, 
        category_id || null, 
        payment_method_id || null, 
        status, 
        recurrence || null, 
        recurrence_details ? JSON.stringify(recurrence_details) : null, 
        notes || null,
        params.id,
        userId
      )
      .run();

    // Get the updated bill
    const bill = await env.DB.prepare(
      'SELECT b.*, c.name as category_name, c.color as category_color, c.icon as category_icon, ' +
      'pm.name as payment_method_name, pm.type as payment_method_type ' +
      'FROM bills b ' +
      'LEFT JOIN categories c ON b.category_id = c.id ' +
      'LEFT JOIN payment_methods pm ON b.payment_method_id = pm.id ' +
      'WHERE b.id = ?'
    )
      .bind(params.id)
      .first();

    return NextResponse.json({ 
      message: 'Bill updated successfully',
      bill
    });
  } catch (error) {
    console.error('Update bill error:', error);
    return NextResponse.json(
      { error: 'An error occurred while updating the bill' },
      { status: 500 }
    );
  }
}

// Delete a bill
export async function deleteBill(
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

    // Check if bill exists and belongs to user
    const existingBill = await env.DB.prepare(
      'SELECT * FROM bills WHERE id = ? AND user_id = ?'
    )
      .bind(params.id, userId)
      .first();

    if (!existingBill) {
      return NextResponse.json(
        { error: 'Bill not found' },
        { status: 404 }
      );
    }

    // Delete bill from database
    await env.DB.prepare(
      'DELETE FROM bills WHERE id = ? AND user_id = ?'
    )
      .bind(params.id, userId)
      .run();

    return NextResponse.json({ 
      message: 'Bill deleted successfully' 
    });
  } catch (error) {
    console.error('Delete bill error:', error);
    return NextResponse.json(
      { error: 'An error occurred while deleting the bill' },
      { status: 500 }
    );
  }
}

// Get bill statistics
export async function getBillStatistics(
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
    const timeRange = url.searchParams.get('timeRange') || '30d'; // Default to 30 days
    
    // Calculate date range
    let startDate;
    const now = new Date();
    
    if (timeRange === '7d') {
      startDate = new Date(now);
      startDate.setDate(now.getDate() - 7);
    } else if (timeRange === '30d') {
      startDate = new Date(now);
      startDate.setDate(now.getDate() - 30);
    } else if (timeRange === '90d') {
      startDate = new Date(now);
      startDate.setDate(now.getDate() - 90);
    } else if (timeRange === '1y') {
      startDate = new Date(now);
      startDate.setFullYear(now.getFullYear() - 1);
    } else {
      startDate = new Date(now);
      startDate.setDate(now.getDate() - 30); // Default to 30 days
    }
    
    const startDateStr = startDate.toISOString().split('T')[0];
    
    // Get total bills amount
    const totalResult = await env.DB.prepare(
      'SELECT SUM(amount) as total FROM bills WHERE user_id = ? AND due_date >= ?'
    )
      .bind(userId, startDateStr)
      .first();
    
    // Get paid bills amount
    const paidResult = await env.DB.prepare(
      'SELECT SUM(amount) as total FROM bills WHERE user_id = ? AND status = ? AND due_date >= ?'
    )
      .bind(userId, 'paid', startDateStr)
      .first();
    
    // Get unpaid bills amount
    const unpaidResult = await env.DB.prepare(
      'SELECT SUM(amount) as total FROM bills WHERE user_id = ? AND status = ? AND due_date >= ?'
    )
      .bind(userId, 'unpaid', startDateStr)
      .first();
    
    // Get bills by category
    const categoriesResult = await env.DB.prepare(
      'SELECT c.id, c.name, c.color, c.icon, SUM(b.amount) as total ' +
      'FROM bills b ' +
      'JOIN categories c ON b.category_id = c.id ' +
      'WHERE b.user_id = ? AND b.due_date >= ? ' +
      'GROUP BY c.id ' +
      'ORDER BY total DESC'
    )
      .bind(userId, startDateStr)
      .all();
    
    // Get bills by month
    const monthlyResult = await env.DB.prepare(
      'SELECT strftime("%Y-%m", due_date) as month, SUM(amount) as total, ' +
      'SUM(CASE WHEN status = "paid" THEN amount ELSE 0 END) as paid, ' +
      'SUM(CASE WHEN status = "unpaid" THEN amount ELSE 0 END) as unpaid ' +
      'FROM bills ' +
      'WHERE user_id = ? AND due_date >= ? ' +
      'GROUP BY month ' +
      'ORDER BY month'
    )
      .bind(userId, startDateStr)
      .all();
    
    return NextResponse.json({
      total: totalResult.total || 0,
      paid: paidResult.total || 0,
      unpaid: unpaidResult.total || 0,
      categories: categoriesResult.results,
      monthly: monthlyResult.results
    });
  } catch (error) {
    console.error('Get bill statistics error:', error);
    return NextResponse.json(
      { error: 'An error occurred while fetching bill statistics' },
      { status: 500 }
    );
  }
}
