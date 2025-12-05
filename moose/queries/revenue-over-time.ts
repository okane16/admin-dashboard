import { sql } from '@514labs/moose-lib';
import { Events } from '../models/events';
import { executeQuery } from './client';

export interface RevenueOverTimeDataPoint {
  month: Date;
  revenue: number;
}

export interface DateRange {
  start: Date;
  end: Date;
}

/**
 * Get revenue over time as a time series grouped by month.
 * Returns an array of data points with month and revenue.
 */
export const getRevenueOverTime = async (
  dateRange?: DateRange
): Promise<RevenueOverTimeDataPoint[]> => {
  const startDate = dateRange?.start.toISOString().split('T')[0];
  const endDate = dateRange?.end.toISOString().split('T')[0];

  const dateFilter = dateRange
    ? sql`AND event_time >= toDate(${startDate!}) AND event_time <= toDate(${endDate!})`
    : sql``;

  const result = await executeQuery<{ month: string; revenue: number }[]>(
    sql`
      SELECT 
        toStartOfMonth(event_time) as month,
        sum(amount) as revenue
      FROM ${Events}
      WHERE event_type = 'purchase'
      ${dateFilter}
      GROUP BY month
      ORDER BY month ASC
    `
  );

  // Convert month strings to Date objects and ensure proper typing
  return result.map((row) => ({
    month: new Date(row.month),
    revenue: Number(row.revenue) || 0
  }));
};
