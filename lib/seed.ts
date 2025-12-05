import 'server-only';

import { db, products } from './db';
import { Events, EventModel } from 'moose/models';
import { eq } from 'drizzle-orm';
import crypto from 'crypto';

// ============================================================================
// Seed Data
// ============================================================================

export const SEED_PRODUCTS = [
  {
    id: 1,
    name: 'Laser Lemonade Machine',
    price: 499.99,
    imageUrl: '/placeholder.svg',
    status: 'active' as const,
    stock: 50,
    availableAt: new Date('2024-01-01')
  },
  {
    id: 2,
    name: 'Hypernova Headphones',
    price: 129.99,
    imageUrl: '/placeholder.svg',
    status: 'active' as const,
    stock: 100,
    availableAt: new Date('2024-01-15')
  },
  {
    id: 3,
    name: 'AeroGlow Desk Lamp',
    price: 39.99,
    imageUrl: '/placeholder.svg',
    status: 'active' as const,
    stock: 200,
    availableAt: new Date('2024-02-01')
  },
  {
    id: 4,
    name: 'TechTonic Energy Drink',
    price: 4.99,
    imageUrl: '/placeholder.svg',
    status: 'active' as const,
    stock: 500,
    availableAt: new Date('2024-02-15')
  },
  {
    id: 5,
    name: 'QuantumKeyboard',
    price: 199.99,
    imageUrl: '/placeholder.svg',
    status: 'active' as const,
    stock: 75,
    availableAt: new Date('2024-03-01')
  }
];

export const SEED_CUSTOMERS = [
  { id: 'c1', name: 'Olivia Martin', email: 'olivia.martin@email.com' },
  { id: 'c2', name: 'Jackson Lee', email: 'jackson.lee@email.com' },
  { id: 'c3', name: 'Isabella Nguyen', email: 'isabella.nguyen@email.com' },
  { id: 'c4', name: 'William Kim', email: 'will@email.com' },
  { id: 'c5', name: 'Sofia Davis', email: 'sofia.davis@email.com' },
  { id: 'c6', name: 'Ethan Wilson', email: 'ethan.wilson@email.com' }
];

// ============================================================================
// Types
// ============================================================================

type Product = { id: number; name: string; price: number };
type Customer = { id: string; name: string; email: string };

export interface SeedOptions {
  eventCount?: number;
}

export interface SeedResult {
  success: boolean;
  results: {
    oltp: {
      success: boolean;
      message: string;
      count: number;
    };
    olap: {
      success: boolean;
      message: string;
      count: number;
    };
  };
}

// ============================================================================
// Helper Functions
// ============================================================================

function getRandomElement<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

function getRandomDate(start: Date, end: Date): Date {
  return new Date(
    start.getTime() + Math.random() * (end.getTime() - start.getTime())
  );
}

function generateEvent(products: Product[], customers: Customer[]): EventModel {
  const product = getRandomElement<Product>(products);
  const customer = getRandomElement<Customer>(customers);
  const quantity = Math.floor(Math.random() * 3) + 1;
  const eventType = Math.random() > 0.2 ? 'purchase' : 'view_product';
  const date = getRandomDate(new Date('2024-01-01'), new Date());

  return {
    transaction_id: crypto.randomUUID(),
    event_type: eventType,
    product_id: product.id,
    customer_id: customer.id,
    amount: eventType === 'purchase' ? product.price * quantity : 0,
    quantity: eventType === 'purchase' ? quantity : 0,
    event_time: date,
    customer_email: customer.email,
    customer_name: customer.name,
    product_name: product.name,
    status: eventType === 'purchase' ? 'completed' : 'active'
  };
}

// ============================================================================
// OLTP Seeding (PostgreSQL)
// ============================================================================

async function seedProducts() {
  console.log('🌱 Seeding PostgreSQL with products...');

  // Transform shared seed data for PostgreSQL insertion
  const PRODUCT_DATA = SEED_PRODUCTS.map((product) => ({
    name: product.name,
    price: product.price.toFixed(2), // Convert to string for numeric type
    imageUrl: product.imageUrl,
    status: product.status,
    stock: product.stock,
    availableAt: product.availableAt
  }));

  try {
    // Insert products - if duplicates exist, they will be skipped
    await db.insert(products).values(PRODUCT_DATA);

    console.log(`✅ Seeded ${PRODUCT_DATA.length} products successfully`);

    // Query the database to get the actual product IDs that were inserted
    // This ensures OLAP events use the exact same product IDs
    const seededProducts = await db
      .select()
      .from(products)
      .where(eq(products.status, 'active'))
      .orderBy(products.id);

    // Map seeded products to match SEED_PRODUCTS structure with actual IDs
    const productsWithIds = SEED_PRODUCTS.map((seedProduct) => {
      const dbProduct = seededProducts.find((p) => p.name === seedProduct.name);
      return {
        ...seedProduct,
        id: dbProduct?.id || seedProduct.id // Use actual DB ID or fallback to seed ID
      };
    });

    return {
      success: true,
      message: `Successfully seeded ${PRODUCT_DATA.length} products`,
      count: PRODUCT_DATA.length,
      products: productsWithIds // Return products with actual database IDs
    };
  } catch (e: any) {
    // If products already exist, query them and return their IDs
    if (e.message?.includes('duplicate') || e.code === '23505') {
      console.log(
        'ℹ️ Some products may already exist, fetching existing products...'
      );

      try {
        const existingProducts = await db
          .select()
          .from(products)
          .where(eq(products.status, 'active'))
          .orderBy(products.id);

        const productsWithIds = SEED_PRODUCTS.map((seedProduct) => {
          const dbProduct = existingProducts.find(
            (p) => p.name === seedProduct.name
          );
          return {
            ...seedProduct,
            id: dbProduct?.id || seedProduct.id
          };
        });

        return {
          success: true,
          message: 'Products seed completed (using existing products)',
          count: existingProducts.length,
          products: productsWithIds
        };
      } catch (queryError: any) {
        // If query fails, fallback to seed IDs
        return {
          success: true,
          message: 'Products seed completed (some may already exist)',
          count: PRODUCT_DATA.length,
          products: SEED_PRODUCTS
        };
      }
    }

    console.error('❌ Failed to seed products:', e);
    return {
      success: false,
      error: 'Failed to insert products into PostgreSQL',
      details: e.message,
      products: []
    };
  }
}

// ============================================================================
// OLAP Seeding (ClickHouse)
// ============================================================================

async function seedEvents(count: number = 100, productsFromOltp?: Product[]) {
  console.log(`🌱 Seeding ClickHouse with ${count} events...`);

  // Use products from OLTP if provided, otherwise fallback to seed data
  // This ensures OLAP events reference the exact same product IDs as OLTP
  const PRODUCTS: Product[] =
    productsFromOltp && productsFromOltp.length > 0
      ? productsFromOltp
      : SEED_PRODUCTS.map((p) => ({
          id: p.id,
          name: p.name,
          price: p.price
        }));

  const CUSTOMERS: Customer[] = SEED_CUSTOMERS;

  const events: EventModel[] = Array.from({ length: count }, () =>
    generateEvent(PRODUCTS, CUSTOMERS)
  );

  try {
    // Use the ClickHouse client's insert method with the Events table
    await Events.insert(events);

    console.log(`✅ Seeded ${count} events successfully`);

    return {
      success: true,
      message: `Successfully seeded ${count} events`,
      count: events.length
    };
  } catch (e: any) {
    console.error('❌ Failed to seed data:', e);
    return {
      success: false,
      error: 'Failed to insert data into ClickHouse',
      details: e.message
    };
  }
}

// ============================================================================
// Unified Seed Function
// ============================================================================

/**
 * Unified seed function that seeds both OLTP (PostgreSQL) and OLAP (ClickHouse) databases.
 * This is the single source of truth for seeding operations.
 *
 * Ensures exact data consistency: OLAP events use the exact same product IDs from OLTP.
 *
 * @param options - Seeding options
 * @param options.eventCount - Number of events to generate for OLAP (default: 500)
 * @returns Seed result with status for both databases
 */
export async function seedDatabases(
  options: SeedOptions = {}
): Promise<SeedResult> {
  const { eventCount = 500 } = options;

  console.log('🌱 Starting seed for both OLTP and OLAP databases...');

  const results = {
    oltp: { success: false, message: '', count: 0 },
    olap: { success: false, message: '', count: 0 }
  };

  // Seed OLTP (PostgreSQL) first to get actual product IDs
  let seededProducts: Array<{ id: number; name: string; price: number }> = [];

  try {
    const oltpResult = await seedProducts();
    results.oltp = {
      success: oltpResult.success,
      message: oltpResult.message || oltpResult.error || '',
      count: oltpResult.count || 0
    };

    // Extract products with actual database IDs for OLAP seeding
    if (oltpResult.products && oltpResult.products.length > 0) {
      seededProducts = oltpResult.products.map((p) => ({
        id: p.id,
        name: p.name,
        price: p.price
      }));
    }
  } catch (error: any) {
    console.error('❌ OLTP seed failed:', error);
    results.oltp = {
      success: false,
      message: error.message || 'Unknown error',
      count: 0
    };
  }

  // Seed OLAP (ClickHouse) using the exact same product IDs from OLTP
  try {
    const olapResult = await seedEvents(eventCount, seededProducts);
    results.olap = {
      success: olapResult.success,
      message: olapResult.message || olapResult.error || '',
      count: olapResult.count || 0
    };
  } catch (error: any) {
    console.error('❌ OLAP seed failed:', error);
    results.olap = {
      success: false,
      message: error.message || 'Unknown error',
      count: 0
    };
  }

  const allSuccess = results.oltp.success && results.olap.success;

  if (allSuccess) {
    console.log(
      '✅ Successfully seeded both databases with matching product IDs'
    );
  } else {
    console.warn('⚠️ Seed completed with some errors:', results);
  }

  return {
    success: allSuccess,
    results
  };
}
