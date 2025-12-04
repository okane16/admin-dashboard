import { sql } from '@514labs/moose-lib';
import { Events } from '../models/events';
import { executeQuery } from './client';
import { DateRange } from './revenue-over-time';

export const getOverviewMetrics = async (dateRange?: DateRange) => {
  const startDate = dateRange?.start.toISOString().split('T')[0];
  const endDate = dateRange?.end.toISOString().split('T')[0];

  const dateFilter = dateRange
    ? sql`AND event_time >= toDate(${startDate!}) AND event_time <= toDate(${endDate!})`
    : sql``;

  const revenue = await executeQuery<{ total_revenue: number }[]>(
    sql`SELECT sum(amount) as total_revenue FROM ${Events} WHERE event_type = 'purchase' ${dateFilter}`
  );

  const sales = await executeQuery<{ total_sales: number }[]>(
    sql`SELECT count(*) as total_sales FROM ${Events} WHERE event_type = 'purchase' ${dateFilter}`
  );

  // Active users is always last hour, not filtered by date range
  const activeUsers = await executeQuery<{ active_users: number }[]>(
    sql`SELECT uniq(customer_id) as active_users FROM ${Events} WHERE event_time > now() - interval 1 hour`
  );

  return {
    totalRevenue: revenue[0]?.total_revenue || 0,
    totalSales: sales[0]?.total_sales || 0,
    activeNow: activeUsers[0]?.active_users || 0
  };
};
