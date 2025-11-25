import { Events, EventModel } from '@/olap/index';
import crypto from 'crypto';

// Mock data helpers aligned with lib/db.ts products
const PRODUCTS = [
  { id: 1, name: 'Laser Lemonade Machine', price: 499.99 },
  { id: 2, name: 'Hypernova Headphones', price: 129.99 },
  { id: 3, name: 'AeroGlow Desk Lamp', price: 39.99 },
  { id: 4, name: 'TechTonic Energy Drink', price: 4.99 },
  { id: 5, name: 'QuantumKeyboard', price: 199.99 }
];

const CUSTOMERS = [
  { id: 'c1', name: 'Olivia Martin', email: 'olivia.martin@email.com' },
  { id: 'c2', name: 'Jackson Lee', email: 'jackson.lee@email.com' },
  { id: 'c3', name: 'Isabella Nguyen', email: 'isabella.nguyen@email.com' },
  { id: 'c4', name: 'William Kim', email: 'will@email.com' },
  { id: 'c5', name: 'Sofia Davis', email: 'sofia.davis@email.com' },
  { id: 'c6', name: 'Ethan Wilson', email: 'ethan.wilson@email.com' }
];

function getRandomElement<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

function getRandomDate(start: Date, end: Date): Date {
  return new Date(
    start.getTime() + Math.random() * (end.getTime() - start.getTime())
  );
}

function generateEvent(): EventModel {
  const product = getRandomElement(PRODUCTS);
  const customer = getRandomElement(CUSTOMERS);
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

export async function seed() {
  console.log('🌱 Seeding ClickHouse with 500 events...');

  // const moose = await getMoose();
  // if (!moose) {
  //   console.error(
  //     '❌ Failed to connect to Moose client. Make sure your Moose server is running (pnpm dev:moose).'
  //   );
  //   process.exit(1);
  // }

  const events: EventModel[] = Array.from({ length: 500 }, generateEvent);

  try {
    // const { client } = moose;

    // Use the ClickHouse client's insert method with the Events table
    await Events.insert(events);

    console.log('✅ Seeded 500 events successfully');
  } catch (e) {
    console.error('❌ Failed to seed data:', e);
    throw e;
  }
}

// Allow running directly via ts-node/node if needed, or imported
if (require.main === module) {
  seed()
    .then(() => {
      console.log('🎉 Seeding complete!');
      process.exit(0);
    })
    .catch((error) => {
      console.error('💥 Seeding failed:', error);
      process.exit(1);
    });
}
