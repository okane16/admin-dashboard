import {
  OlapTable,
  getMooseClients,
  sql,
  ClickHouseEngines,
  MaterializedView
} from '@514labs/moose-lib';

export interface EventModel {
  transaction_id: string;
  event_type: string;
  product_id: number;
  customer_id: string;
  amount: number;
  quantity: number;
  event_time: Date;
  // Denormalized fields for simpler analytics queries without joins in this demo
  customer_email: string;
  customer_name: string;
  product_name: string;
  status: string; // e.g. 'completed', 'active', 'inactive'
}

// Workaround for Next.js runtime where ts-patch/compiler plugin is missing
export const Events = new OlapTable<EventModel>('events', {
  orderByFields: ['event_time']
});

export interface OverviewMetricsModel {
  revenue: number;
  sales_count: number;
  customers_count: number;
  products_sold: number;
  event_time: Date;
}

export const OverviewMetrics = new OlapTable<OverviewMetricsModel>(
  'overview_metrics',
  {
    orderByFields: ['event_time'],
    engine: ClickHouseEngines.SummingMergeTree
  }
);

export const OverViewMV = new MaterializedView<OverviewMetricsModel>({
  selectTables: [Events],
  targetTable: OverviewMetrics,
  selectStatement: sql`SELECT sum(amount) as revenue, count(*) as sales_count, uniq(customer_id) as customers_count, uniq(product_id) as products_sold, event_time FROM ${Events} WHERE event_type = 'purchase' GROUP BY event_time`,
  materializedViewName: 'overview_mv'
});

const globalForMoose = globalThis as unknown as {
  mooseClient: Awaited<ReturnType<typeof getMooseClients>> | undefined;
};

export const getMoose = async () => {
  if (globalForMoose.mooseClient) return globalForMoose.mooseClient;

  // Create client with shorter timeout for demo if possible, or handle connection error later
  try {
    const client = await getMooseClients({
      database: 'local',
      host: 'localhost',
      port: '18123',
      username: 'panda',
      password: 'pandapass',
      useSSL: false
    });

    if (process.env.NODE_ENV !== 'production') {
      globalForMoose.mooseClient = client;
    }
    return client;
  } catch (error) {
    console.warn(
      'Failed to connect to Moose/ClickHouse, using mock mode:',
      error
    );
    return null;
  }
};

// Mock Data for Fallback
const MOCK_REVENUE = [{ total_revenue: 45231.89 }];
const MOCK_SALES = [{ total_sales: 2350 }];
const MOCK_ACTIVE = [{ active_users: 573 }];
const MOCK_REVENUE_OVER_TIME = [
  { month: '2024-01-01', revenue: 3500 },
  { month: '2024-02-01', revenue: 4500 },
  { month: '2024-03-01', revenue: 3000 },
  { month: '2024-04-01', revenue: 6000 },
  { month: '2024-05-01', revenue: 4000 },
  { month: '2024-06-01', revenue: 7500 },
  { month: '2024-07-01', revenue: 5500 },
  { month: '2024-08-01', revenue: 6500 },
  { month: '2024-09-01', revenue: 5000 },
  { month: '2024-10-01', revenue: 8000 },
  { month: '2024-11-01', revenue: 6000 },
  { month: '2024-12-01', revenue: 9000 }
];
const MOCK_RECENT_SALES: EventModel[] = [
  {
    customer_name: 'Olivia Martin',
    customer_email: 'olivia.martin@email.com',
    amount: 1999.0,
    event_time: new Date(),
    transaction_id: '1',
    event_type: 'purchase',
    product_id: 1,
    customer_id: 'c1',
    quantity: 1,
    product_name: 'Laser Lemonade Machine',
    status: 'completed'
  },
  {
    customer_name: 'Jackson Lee',
    customer_email: 'jackson.lee@email.com',
    amount: 39.0,
    event_time: new Date(),
    transaction_id: '2',
    event_type: 'purchase',
    product_id: 2,
    customer_id: 'c2',
    quantity: 1,
    product_name: 'AeroGlow Desk Lamp',
    status: 'completed'
  },
  {
    customer_name: 'Isabella Nguyen',
    customer_email: 'isabella.nguyen@email.com',
    amount: 299.0,
    event_time: new Date(),
    transaction_id: '3',
    event_type: 'purchase',
    product_id: 3,
    customer_id: 'c3',
    quantity: 1,
    product_name: 'Hypernova Headphones',
    status: 'completed'
  },
  {
    customer_name: 'William Kim',
    customer_email: 'will@email.com',
    amount: 99.0,
    event_time: new Date(),
    transaction_id: '4',
    event_type: 'purchase',
    product_id: 4,
    customer_id: 'c4',
    quantity: 1,
    product_name: 'Terraform T-Shirt',
    status: 'completed'
  }
];
const MOCK_TOP_PRODUCTS = [
  {
    product_name: 'Laser Lemonade Machine',
    total_sales: 1234,
    total_revenue: 616987.66,
    status: 'Active'
  },
  {
    product_name: 'Hypernova Headphones',
    total_sales: 843,
    total_revenue: 109581.57,
    status: 'Active'
  },
  {
    product_name: 'AeroGlow Desk Lamp',
    total_sales: 421,
    total_revenue: 16835.79,
    status: 'Out of Stock'
  }
];
const MOCK_CUSTOMER_STATS_TOTAL = [{ total_customers: 2350 }];
const MOCK_RECENT_CUSTOMERS = [
  {
    customer_name: 'Liam Johnson',
    customer_email: 'liam@example.com',
    spent: 250.0,
    status: 'Active'
  },
  {
    customer_name: 'Emma Wilson',
    customer_email: 'emma@example.com',
    spent: 150.0,
    status: 'Active'
  },
  {
    customer_name: 'Noah Brown',
    customer_email: 'noah@example.com',
    spent: 0.0,
    status: 'Inactive'
  }
];

async function executeQuery<T>(query: any, fallback: T): Promise<T> {
  const moose = await getMoose();
  if (!moose) return fallback;
  try {
    const result = await moose.client.query.execute(query);
    return result.json() as T;
  } catch (e) {
    console.warn('Query failed, using fallback:', e);
    return fallback;
  }
}

// Overview Tab Queries
export const getOverviewMetrics = async () => {
  const revenue = await executeQuery<{ total_revenue: number }[]>(
    sql`SELECT sum(amount) as total_revenue FROM ${Events} WHERE event_type = 'purchase'`,
    MOCK_REVENUE
  );

  const sales = await executeQuery<{ total_sales: number }[]>(
    sql`SELECT count(*) as total_sales FROM ${Events} WHERE event_type = 'purchase'`,
    MOCK_SALES
  );

  const activeUsers = await executeQuery<{ active_users: number }[]>(
    sql`SELECT uniq(customer_id) as active_users FROM ${Events} WHERE event_time > now() - interval 1 hour`,
    MOCK_ACTIVE
  );

  return {
    totalRevenue: revenue[0]?.total_revenue || 0,
    totalSales: sales[0]?.total_sales || 0,
    activeNow: activeUsers[0]?.active_users || 0
  };
};

export const getRevenueOverTime = async () => {
  return await executeQuery<{ month: string; revenue: number }[]>(
    sql`
      SELECT 
        toStartOfMonth(event_time) as month, 
        sum(amount) as revenue 
      FROM ${Events} 
      WHERE event_type = 'purchase' 
      GROUP BY month 
      ORDER BY month ASC
    `,
    MOCK_REVENUE_OVER_TIME
  );
};

export const getRecentSales = async () => {
  return await executeQuery<EventModel[]>(
    sql`
      SELECT * 
      FROM ${Events} 
      WHERE event_type = 'purchase' 
      ORDER BY event_time DESC 
      LIMIT 5
    `,
    MOCK_RECENT_SALES
  );
};

// Products Tab Queries
export const getTopProducts = async () => {
  return await executeQuery<
    {
      product_name: string;
      total_sales: number;
      total_revenue: number;
      status: string;
    }[]
  >(
    sql`
      SELECT 
        product_name,
        count(*) as total_sales,
        sum(amount) as total_revenue,
        any(status) as status
      FROM ${Events}
      WHERE event_type = 'purchase'
      GROUP BY product_name
      ORDER BY total_revenue DESC
      LIMIT 10
    `,
    MOCK_TOP_PRODUCTS
  );
};

// Customers Tab Queries
export const getCustomerStats = async () => {
  const total = await executeQuery<{ total_customers: number }[]>(
    sql`SELECT uniq(customer_id) as total_customers FROM ${Events}`,
    MOCK_CUSTOMER_STATS_TOTAL
  );

  const recentCustomers = await executeQuery<
    {
      customer_name: string;
      customer_email: string;
      spent: number;
      status: string;
    }[]
  >(
    sql`
      SELECT 
        customer_name, 
        customer_email, 
        sum(amount) as spent,
        'Active' as status
      FROM ${Events}
      WHERE event_type = 'purchase'
      GROUP BY customer_name, customer_email
      ORDER BY spent DESC
      LIMIT 10
    `,
    MOCK_RECENT_CUSTOMERS
  );

  return {
    totalCustomers: total[0]?.total_customers || 0,
    recentCustomers
  };
};
