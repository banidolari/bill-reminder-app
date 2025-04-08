import { NextRequest, NextResponse } from 'next/server';
import { D1Database } from '@cloudflare/workers-types';
import { v4 as uuidv4 } from 'uuid';

// Helper function to verify authorization
import { verifyAuth } from './auth-helpers';

// Get all payment methods for a user
export async function getPaymentMethods(
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

    // Get payment methods from database
    const paymentMethods = await env.DB.prepare(
      'SELECT * FROM payment_methods WHERE user_id = ? ORDER BY is_default DESC, name ASC'
    )
      .bind(userId)
      .all();

    return NextResponse.json({ paymentMethods: paymentMethods.results });
  } catch (error) {
    console.error('Get payment methods error:', error);
    return NextResponse.json(
      { error: 'An error occurred while fetching payment methods' },
      { status: 500 }
    );
  }
}

// Create a new payment method
export async function createPaymentMethod(
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
    const { name, type, details, is_default } = await request.json();

    // Validate input
    if (!name || !type || !details) {
      return NextResponse.json(
        { error: 'Name, type, and details are required' },
        { status: 400 }
      );
    }

    // Generate payment method ID
    const paymentMethodId = uuidv4();

    // If this is set as default, unset any existing default
    if (is_default) {
      await env.DB.prepare(
        'UPDATE payment_methods SET is_default = 0 WHERE user_id = ?'
      )
        .bind(userId)
        .run();
    }

    // Insert payment method into database
    await env.DB.prepare(
      'INSERT INTO payment_methods (id, user_id, name, type, details, is_default) VALUES (?, ?, ?, ?, ?, ?)'
    )
      .bind(paymentMethodId, userId, name, type, JSON.stringify(details), is_default ? 1 : 0)
      .run();

    // Get the created payment method
    const paymentMethod = await env.DB.prepare(
      'SELECT * FROM payment_methods WHERE id = ?'
    )
      .bind(paymentMethodId)
      .first();

    // Parse details JSON
    if (paymentMethod.details) {
      paymentMethod.details = JSON.parse(paymentMethod.details);
    }

    return NextResponse.json({ 
      message: 'Payment method created successfully',
      paymentMethod
    });
  } catch (error) {
    console.error('Create payment method error:', error);
    return NextResponse.json(
      { error: 'An error occurred while creating the payment method' },
      { status: 500 }
    );
  }
}

// Update a payment method
export async function updatePaymentMethod(
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

    // Check if payment method exists and belongs to user
    const existingPaymentMethod = await env.DB.prepare(
      'SELECT * FROM payment_methods WHERE id = ? AND user_id = ?'
    )
      .bind(params.id, userId)
      .first();

    if (!existingPaymentMethod) {
      return NextResponse.json(
        { error: 'Payment method not found' },
        { status: 404 }
      );
    }

    // Get request body
    const { name, type, details, is_default } = await request.json();

    // Validate input
    if (!name || !type || !details) {
      return NextResponse.json(
        { error: 'Name, type, and details are required' },
        { status: 400 }
      );
    }

    // If this is set as default, unset any existing default
    if (is_default) {
      await env.DB.prepare(
        'UPDATE payment_methods SET is_default = 0 WHERE user_id = ?'
      )
        .bind(userId)
        .run();
    }

    // Update payment method in database
    await env.DB.prepare(
      'UPDATE payment_methods SET name = ?, type = ?, details = ?, is_default = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ? AND user_id = ?'
    )
      .bind(name, type, JSON.stringify(details), is_default ? 1 : 0, params.id, userId)
      .run();

    // Get the updated payment method
    const paymentMethod = await env.DB.prepare(
      'SELECT * FROM payment_methods WHERE id = ?'
    )
      .bind(params.id)
      .first();

    // Parse details JSON
    if (paymentMethod.details) {
      paymentMethod.details = JSON.parse(paymentMethod.details);
    }

    return NextResponse.json({ 
      message: 'Payment method updated successfully',
      paymentMethod
    });
  } catch (error) {
    console.error('Update payment method error:', error);
    return NextResponse.json(
      { error: 'An error occurred while updating the payment method' },
      { status: 500 }
    );
  }
}

// Delete a payment method
export async function deletePaymentMethod(
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

    // Check if payment method exists and belongs to user
    const existingPaymentMethod = await env.DB.prepare(
      'SELECT * FROM payment_methods WHERE id = ? AND user_id = ?'
    )
      .bind(params.id, userId)
      .first();

    if (!existingPaymentMethod) {
      return NextResponse.json(
        { error: 'Payment method not found' },
        { status: 404 }
      );
    }

    // Check if payment method is used by any bills
    const billsWithPaymentMethod = await env.DB.prepare(
      'SELECT COUNT(*) as count FROM bills WHERE payment_method_id = ?'
    )
      .bind(params.id)
      .first();

    if (billsWithPaymentMethod.count > 0) {
      // Update bills to remove this payment method
      await env.DB.prepare(
        'UPDATE bills SET payment_method_id = NULL WHERE payment_method_id = ?'
      )
        .bind(params.id)
        .run();
    }

    // Delete payment method from database
    await env.DB.prepare(
      'DELETE FROM payment_methods WHERE id = ? AND user_id = ?'
    )
      .bind(params.id, userId)
      .run();

    // If this was the default payment method, set another one as default
    if (existingPaymentMethod.is_default) {
      const anotherPaymentMethod = await env.DB.prepare(
        'SELECT id FROM payment_methods WHERE user_id = ? LIMIT 1'
      )
        .bind(userId)
        .first();

      if (anotherPaymentMethod) {
        await env.DB.prepare(
          'UPDATE payment_methods SET is_default = 1 WHERE id = ?'
        )
          .bind(anotherPaymentMethod.id)
          .run();
      }
    }

    return NextResponse.json({ 
      message: 'Payment method deleted successfully' 
    });
  } catch (error) {
    console.error('Delete payment method error:', error);
    return NextResponse.json(
      { error: 'An error occurred while deleting the payment method' },
      { status: 500 }
    );
  }
}

// Get payment method statistics
export async function getPaymentMethodStatistics(
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
    
    // Get total amount by payment method
    const paymentMethodStats = await env.DB.prepare(
      'SELECT pm.id, pm.name, pm.type, ' +
      'SUM(b.amount) as total, ' +
      'COUNT(b.id) as bill_count, ' +
      'SUM(CASE WHEN b.status = "paid" THEN b.amount ELSE 0 END) as paid, ' +
      'SUM(CASE WHEN b.status = "unpaid" THEN b.amount ELSE 0 END) as unpaid ' +
      'FROM payment_methods pm ' +
      'LEFT JOIN bills b ON pm.id = b.payment_method_id AND b.due_date >= ? ' +
      'WHERE pm.user_id = ? ' +
      'GROUP BY pm.id ' +
      'ORDER BY total DESC'
    )
      .bind(startDateStr, userId)
      .all();
    
    // Calculate percentages
    const totalAmount = paymentMethodStats.results.reduce((sum, pm) => sum + (pm.total || 0), 0);
    
    const paymentMethodsWithPercentage = paymentMethodStats.results.map(pm => ({
      ...pm,
      percentage: totalAmount > 0 ? Math.round((pm.total / totalAmount) * 100) : 0
    }));
    
    return NextResponse.json({
      paymentMethods: paymentMethodsWithPercentage,
      totalAmount
    });
  } catch (error) {
    console.error('Get payment method statistics error:', error);
    return NextResponse.json(
      { error: 'An error occurred while fetching payment method statistics' },
      { status: 500 }
    );
  }
}
