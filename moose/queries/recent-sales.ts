import { sql } from '@514labs/moose-lib';
import { Events, EventModel } from '../models/events';
import { executeQuery } from './client';
import { DateRange } from './revenue-over-time';

export const getRecentSales = async (
  dateRange?: DateRange,
  limit: number = 5
) => {
  const startDate = dateRange?.start.toISOString().split('T')[0];
  const endDate = dateRange?.end.toISOString().split('T')[0];

  const dateFilter = dateRange
    ? sql`AND event_time >= toDate(${startDate!}) AND event_time <= toDate(${endDate!})`
    : sql``;

  return await executeQuery<EventModel[]>(
    sql`
      SELECT * 
      FROM ${Events} 
      WHERE event_type = 'purchase' 
      ${dateFilter}
      ORDER BY event_time DESC 
      LIMIT ${limit}
    `
  );
};
