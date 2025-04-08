import { NextRequest, NextResponse } from 'next/server';
import { D1Database } from '@cloudflare/workers-types';
import { v4 as uuidv4 } from 'uuid';

// Helper function to verify authorization
import { verifyAuth } from './auth-helpers';

// Get all integrations for a user
export async function getIntegrations(
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

    // Get integrations from database
    const integrations = await env.DB.prepare(
      'SELECT * FROM user_integrations WHERE user_id = ? ORDER BY type ASC'
    )
      .bind(userId)
      .all();

    // Parse details JSON for each integration
    const parsedIntegrations = integrations.results.map(integration => {
      try {
        return {
          ...integration,
          details: JSON.parse(integration.details)
        };
      } catch (e) {
        console.error('Error parsing integration details:', e);
        return integration;
      }
    });

    return NextResponse.json({ integrations: parsedIntegrations });
  } catch (error) {
    console.error('Get integrations error:', error);
    return NextResponse.json(
      { error: 'An error occurred while fetching integrations' },
      { status: 500 }
    );
  }
}

// Create a new integration
export async function createIntegration(
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
    const { type, details, status } = await request.json();

    // Validate input
    if (!type || !details) {
      return NextResponse.json(
        { error: 'Type and details are required' },
        { status: 400 }
      );
    }

    // Check if integration of this type already exists
    const existingIntegration = await env.DB.prepare(
      'SELECT * FROM user_integrations WHERE user_id = ? AND type = ?'
    )
      .bind(userId, type)
      .first();

    if (existingIntegration) {
      return NextResponse.json(
        { error: `Integration of type ${type} already exists` },
        { status: 409 }
      );
    }

    // Generate integration ID
    const integrationId = uuidv4();

    // Insert integration into database
    await env.DB.prepare(
      'INSERT INTO user_integrations (id, user_id, type, details, status) VALUES (?, ?, ?, ?, ?)'
    )
      .bind(integrationId, userId, type, JSON.stringify(details), status || 'pending')
      .run();

    // Get the created integration
    const integration = await env.DB.prepare(
      'SELECT * FROM user_integrations WHERE id = ?'
    )
      .bind(integrationId)
      .first();

    // Parse details JSON
    try {
      integration.details = JSON.parse(integration.details);
    } catch (e) {
      console.error('Error parsing integration details:', e);
    }

    return NextResponse.json({ 
      message: 'Integration created successfully',
      integration
    });
  } catch (error) {
    console.error('Create integration error:', error);
    return NextResponse.json(
      { error: 'An error occurred while creating the integration' },
      { status: 500 }
    );
  }
}

// Update an integration
export async function updateIntegration(
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

    // Check if integration exists and belongs to user
    const existingIntegration = await env.DB.prepare(
      'SELECT * FROM user_integrations WHERE id = ? AND user_id = ?'
    )
      .bind(params.id, userId)
      .first();

    if (!existingIntegration) {
      return NextResponse.json(
        { error: 'Integration not found' },
        { status: 404 }
      );
    }

    // Get request body
    const { details, status } = await request.json();

    // Update integration in database
    await env.DB.prepare(
      'UPDATE user_integrations SET details = ?, status = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ? AND user_id = ?'
    )
      .bind(JSON.stringify(details), status, params.id, userId)
      .run();

    // Get the updated integration
    const integration = await env.DB.prepare(
      'SELECT * FROM user_integrations WHERE id = ?'
    )
      .bind(params.id)
      .first();

    // Parse details JSON
    try {
      integration.details = JSON.parse(integration.details);
    } catch (e) {
      console.error('Error parsing integration details:', e);
    }

    return NextResponse.json({ 
      message: 'Integration updated successfully',
      integration
    });
  } catch (error) {
    console.error('Update integration error:', error);
    return NextResponse.json(
      { error: 'An error occurred while updating the integration' },
      { status: 500 }
    );
  }
}

// Delete an integration
export async function deleteIntegration(
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

    // Check if integration exists and belongs to user
    const existingIntegration = await env.DB.prepare(
      'SELECT * FROM user_integrations WHERE id = ? AND user_id = ?'
    )
      .bind(params.id, userId)
      .first();

    if (!existingIntegration) {
      return NextResponse.json(
        { error: 'Integration not found' },
        { status: 404 }
      );
    }

    // Delete integration from database
    await env.DB.prepare(
      'DELETE FROM user_integrations WHERE id = ? AND user_id = ?'
    )
      .bind(params.id, userId)
      .run();

    return NextResponse.json({ 
      message: 'Integration deleted successfully' 
    });
  } catch (error) {
    console.error('Delete integration error:', error);
    return NextResponse.json(
      { error: 'An error occurred while deleting the integration' },
      { status: 500 }
    );
  }
}

// Sync an integration (e.g., scan email or Dropbox for bills)
export async function syncIntegration(
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

    // Check if integration exists and belongs to user
    const existingIntegration = await env.DB.prepare(
      'SELECT * FROM user_integrations WHERE id = ? AND user_id = ?'
    )
      .bind(params.id, userId)
      .first();

    if (!existingIntegration) {
      return NextResponse.json(
        { error: 'Integration not found' },
        { status: 404 }
      );
    }

    // Parse details JSON
    let details;
    try {
      details = JSON.parse(existingIntegration.details);
    } catch (e) {
      console.error('Error parsing integration details:', e);
      details = {};
    }

    // In a real application, this would connect to the external service
    // For this demo, we'll simulate finding bills with mock data
    let syncResults;
    const now = new Date();
    
    if (existingIntegration.type === 'email') {
      // Simulate finding bills in email
      syncResults = {
        scanned: 15,
        found: 3,
        bills: [
          {
            subject: "Your Electric Bill for April 2025",
            from: "billing@acmeutilities.com",
            date: new Date(now.getTime() - 2 * 24 * 60 * 60 * 1000).toISOString(),
            extracted: {
              vendor: "ACME Utilities",
              amount: 85.50,
              due_date: "2025-04-15"
            }
          },
          {
            subject: "Internet Service Invoice #INV-8765",
            from: "billing@fastinternet.com",
            date: new Date(now.getTime() - 3 * 24 * 60 * 60 * 1000).toISOString(),
            extracted: {
              vendor: "Fast Internet",
              amount: 59.99,
              due_date: "2025-04-18"
            }
          },
          {
            subject: "Your Netflix Subscription",
            from: "info@netflix.com",
            date: new Date(now.getTime() - 1 * 24 * 60 * 60 * 1000).toISOString(),
            extracted: {
              vendor: "Netflix",
              amount: 15.99,
              due_date: "2025-04-22"
            }
          }
        ]
      };
    } else if (existingIntegration.type === 'dropbox') {
      // Simulate finding bills in Dropbox
      syncResults = {
        scanned: 25,
        found: 2,
        bills: [
          {
            filename: "water_bill_april_2025.pdf",
            path: "/Bills/water_bill_april_2025.pdf",
            size: 1250000,
            modified: new Date(now.getTime() - 5 * 24 * 60 * 60 * 1000).toISOString(),
            extracted: {
              vendor: "City Water Department",
              amount: 45.75,
              due_date: "2025-04-28"
            }
          },
          {
            filename: "car_insurance_q2_2025.pdf",
            path: "/Bills/car_insurance_q2_2025.pdf",
            size: 2340000,
            modified: new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000).toISOString(),
            extracted: {
              vendor: "Safe Auto Insurance",
              amount: 320.00,
              due_date: "2025-05-15"
            }
          }
        ]
      };
    } else {
      syncResults = {
        scanned: 0,
        found: 0,
        bills: []
      };
    }

    // Update integration with last sync time
    await env.DB.prepare(
      'UPDATE user_integrations SET last_sync = CURRENT_TIMESTAMP, updated_at = CURRENT_TIMESTAMP WHERE id = ?'
    )
      .bind(params.id)
      .run();

    return NextResponse.json({ 
      message: 'Integration synced successfully',
      results: syncResults
    });
  } catch (error) {
    console.error('Sync integration error:', error);
    return NextResponse.json(
      { error: 'An error occurred while syncing the integration' },
      { status: 500 }
    );
  }
}

// Connect to smart assistant (Google Assistant or Alexa)
export async function connectSmartAssistant(
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
    const { assistant_type, device_name } = await request.json();

    // Validate input
    if (!assistant_type || !['google_assistant', 'alexa'].includes(assistant_type)) {
      return NextResponse.json(
        { error: 'Valid assistant_type (google_assistant or alexa) is required' },
        { status: 400 }
      );
    }

    // Check if integration of this type already exists
    const existingIntegration = await env.DB.prepare(
      'SELECT * FROM user_integrations WHERE user_id = ? AND type = ?'
    )
      .bind(userId, assistant_type)
      .first();

    if (existingIntegration) {
      // Update existing integration
      const details = {
        device_name: device_name || 'Unknown Device',
        connected_at: new Date().toISOString(),
        connection_id: uuidv4().substring(0, 8)
      };

      await env.DB.prepare(
        'UPDATE user_integrations SET details = ?, status = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?'
      )
        .bind(JSON.stringify(details), 'active', existingIntegration.id)
        .run();

      // Get the updated integration
      const integration = await env.DB.prepare(
        'SELECT * FROM user_integrations WHERE id = ?'
      )
        .bind(existingIntegration.id)
        .first();

      // Parse details JSON
      try {
        integration.details = JSON.parse(integration.details);
      } catch (e) {
        console.error('Error parsing integration details:', e);
      }

      return NextResponse.json({ 
        message: 'Smart assistant connection updated',
        integration
      });
    } else {
      // Create new integration
      const integrationId = uuidv4();
      const details = {
        device_name: device_name || 'Unknown Device',
        connected_at: new Date().toISOString(),
        connection_id: uuidv4().substring(0, 8)
      };

      await env.DB.prepare(
        'INSERT INTO user_integrations (id, user_id, type, details, status) VALUES (?, ?, ?, ?, ?)'
      )
        .bind(integrationId, userId, assistant_type, JSON.stringify(details), 'active')
        .run();

      // Get the created integration
      const integration = await env.DB.prepare(
        'SELECT * FROM user_integrations WHERE id = ?'
      )
        .bind(integrationId)
        .first();

      // Parse details JSON
      try {
        integration.details = JSON.parse(integration.details);
      } catch (e) {
        console.error('Error parsing integration details:', e);
      }

      return NextResponse.json({ 
        message: 'Smart assistant connected successfully',
        integration
      });
    }
  } catch (error) {
    console.error('Connect smart assistant error:', error);
    return NextResponse.json(
      { error: 'An error occurred while connecting to smart assistant' },
      { status: 500 }
    );
  }
}
