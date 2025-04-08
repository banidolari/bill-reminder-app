import { NextRequest, NextResponse } from 'next/server';
import { D1Database } from '@cloudflare/workers-types';
import { v4 as uuidv4 } from 'uuid';

// Helper function to verify authorization
import { verifyAuth } from './auth-helpers';

// Get all categories for a user
export async function getCategories(
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

    // Get categories from database
    const categories = await env.DB.prepare(
      'SELECT * FROM categories WHERE user_id = ? ORDER BY name ASC'
    )
      .bind(userId)
      .all();

    return NextResponse.json({ categories: categories.results });
  } catch (error) {
    console.error('Get categories error:', error);
    return NextResponse.json(
      { error: 'An error occurred while fetching categories' },
      { status: 500 }
    );
  }
}

// Create a new category
export async function createCategory(
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
    const { name, color, icon } = await request.json();

    // Validate input
    if (!name) {
      return NextResponse.json(
        { error: 'Category name is required' },
        { status: 400 }
      );
    }

    // Generate category ID
    const categoryId = uuidv4();

    // Insert category into database
    await env.DB.prepare(
      'INSERT INTO categories (id, user_id, name, color, icon) VALUES (?, ?, ?, ?, ?)'
    )
      .bind(categoryId, userId, name, color || '#6B7280', icon || 'folder')
      .run();

    // Get the created category
    const category = await env.DB.prepare(
      'SELECT * FROM categories WHERE id = ?'
    )
      .bind(categoryId)
      .first();

    return NextResponse.json({ 
      message: 'Category created successfully',
      category
    });
  } catch (error) {
    console.error('Create category error:', error);
    return NextResponse.json(
      { error: 'An error occurred while creating the category' },
      { status: 500 }
    );
  }
}

// Update a category
export async function updateCategory(
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

    // Check if category exists and belongs to user
    const existingCategory = await env.DB.prepare(
      'SELECT * FROM categories WHERE id = ? AND user_id = ?'
    )
      .bind(params.id, userId)
      .first();

    if (!existingCategory) {
      return NextResponse.json(
        { error: 'Category not found' },
        { status: 404 }
      );
    }

    // Get request body
    const { name, color, icon } = await request.json();

    // Validate input
    if (!name) {
      return NextResponse.json(
        { error: 'Category name is required' },
        { status: 400 }
      );
    }

    // Update category in database
    await env.DB.prepare(
      'UPDATE categories SET name = ?, color = ?, icon = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ? AND user_id = ?'
    )
      .bind(name, color || '#6B7280', icon || 'folder', params.id, userId)
      .run();

    // Get the updated category
    const category = await env.DB.prepare(
      'SELECT * FROM categories WHERE id = ?'
    )
      .bind(params.id)
      .first();

    return NextResponse.json({ 
      message: 'Category updated successfully',
      category
    });
  } catch (error) {
    console.error('Update category error:', error);
    return NextResponse.json(
      { error: 'An error occurred while updating the category' },
      { status: 500 }
    );
  }
}

// Delete a category
export async function deleteCategory(
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

    // Check if category exists and belongs to user
    const existingCategory = await env.DB.prepare(
      'SELECT * FROM categories WHERE id = ? AND user_id = ?'
    )
      .bind(params.id, userId)
      .first();

    if (!existingCategory) {
      return NextResponse.json(
        { error: 'Category not found' },
        { status: 404 }
      );
    }

    // Check if category is used by any bills
    const billsWithCategory = await env.DB.prepare(
      'SELECT COUNT(*) as count FROM bills WHERE category_id = ?'
    )
      .bind(params.id)
      .first();

    if (billsWithCategory.count > 0) {
      // Update bills to use default "Other" category
      const otherCategory = await env.DB.prepare(
        'SELECT id FROM categories WHERE name = ? AND user_id = ?'
      )
        .bind('Other', userId)
        .first();

      if (otherCategory) {
        await env.DB.prepare(
          'UPDATE bills SET category_id = ? WHERE category_id = ?'
        )
          .bind(otherCategory.id, params.id)
          .run();
      } else {
        // If "Other" category doesn't exist, set category_id to null
        await env.DB.prepare(
          'UPDATE bills SET category_id = NULL WHERE category_id = ?'
        )
          .bind(params.id)
          .run();
      }
    }

    // Delete category from database
    await env.DB.prepare(
      'DELETE FROM categories WHERE id = ? AND user_id = ?'
    )
      .bind(params.id, userId)
      .run();

    return NextResponse.json({ 
      message: 'Category deleted successfully' 
    });
  } catch (error) {
    console.error('Delete category error:', error);
    return NextResponse.json(
      { error: 'An error occurred while deleting the category' },
      { status: 500 }
    );
  }
}

// Get category statistics
export async function getCategoryStatistics(
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
    
    // Get total amount by category
    const categoryStats = await env.DB.prepare(
      'SELECT c.id, c.name, c.color, c.icon, ' +
      'SUM(b.amount) as total, ' +
      'COUNT(b.id) as bill_count, ' +
      'SUM(CASE WHEN b.status = "paid" THEN b.amount ELSE 0 END) as paid, ' +
      'SUM(CASE WHEN b.status = "unpaid" THEN b.amount ELSE 0 END) as unpaid ' +
      'FROM categories c ' +
      'LEFT JOIN bills b ON c.id = b.category_id AND b.due_date >= ? ' +
      'WHERE c.user_id = ? ' +
      'GROUP BY c.id ' +
      'ORDER BY total DESC'
    )
      .bind(startDateStr, userId)
      .all();
    
    // Calculate percentages
    const totalAmount = categoryStats.results.reduce((sum, cat) => sum + (cat.total || 0), 0);
    
    const categoriesWithPercentage = categoryStats.results.map(cat => ({
      ...cat,
      percentage: totalAmount > 0 ? Math.round((cat.total / totalAmount) * 100) : 0
    }));
    
    return NextResponse.json({
      categories: categoriesWithPercentage,
      totalAmount
    });
  } catch (error) {
    console.error('Get category statistics error:', error);
    return NextResponse.json(
      { error: 'An error occurred while fetching category statistics' },
      { status: 500 }
    );
  }
}
