import { sql } from '@514labs/moose-lib';
import { Events } from '../models/events';
import { executeQuery } from './client';
import { DateRange } from './revenue-over-time';

// Customers Tab Queries
export const getCustomerStats = async (dateRange?: DateRange) => {
  const startDate = dateRange?.start.toISOString().split('T')[0];
  const endDate = dateRange?.end.toISOString().split('T')[0];

  const dateFilter = dateRange
    ? sql`AND event_time >= toDate(${startDate!}) AND event_time <= toDate(${endDate!})`
    : sql``;

  // Total customers should be all-time, not filtered
  const total = await executeQuery<{ total_customers: number }[]>(
    sql`SELECT uniq(customer_id) as total_customers FROM ${Events}`
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
      ${dateFilter}
      GROUP BY customer_name, customer_email
      ORDER BY spent DESC
      LIMIT 10
    `
  );

  return {
    totalCustomers: total[0]?.total_customers || 0,
    recentCustomers
  };
};
