import { sql } from '@514labs/moose-lib';
import { Events } from '../models/events';
import { executeQuery } from './client';
import { DateRange } from './revenue-over-time';

export const getTopProducts = async (dateRange?: DateRange) => {
  const startDate = dateRange?.start.toISOString().split('T')[0];
  const endDate = dateRange?.end.toISOString().split('T')[0];

  const dateFilter = dateRange
    ? sql`AND event_time >= toDate(${startDate!}) AND event_time <= toDate(${endDate!})`
    : sql``;

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
      ${dateFilter}
      GROUP BY product_name
      ORDER BY total_revenue DESC
      LIMIT 10
    `
  );
};
