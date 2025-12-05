import {
  OlapTable,
  ClickHouseEngines,
  MaterializedView,
  sql
} from '@514labs/moose-lib';
import { Events } from './events';

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
