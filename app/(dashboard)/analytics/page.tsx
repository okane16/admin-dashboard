import { Suspense } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { CreditCard, DollarSign, Users, Activity } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import {
  getOverviewMetrics,
  getRevenueOverTime,
  getRecentSales,
  getTopProducts,
  getCustomerStats
} from '@/moose/queries';
import {
  MetricCard,
  RevenueChart,
  RecentSalesList,
  DataTable,
  TimeFilter,
  getTimeRangeDates,
  formatCurrency,
  formatNumber,
  type TableColumn,
  type TimeRange
} from '@/components/analytics';

export const dynamic = 'force-dynamic';

interface AnalyticsPageProps {
  searchParams: Promise<{ range?: string }>;
}

export default async function AnalyticsPage({
  searchParams
}: AnalyticsPageProps) {
  const params = await searchParams;
  const timeRange = (params.range as TimeRange) || '30d';
  const dateRange = getTimeRangeDates(timeRange);

  const overviewMetrics = await getOverviewMetrics(dateRange);
  const revenueOverTime = await getRevenueOverTime(dateRange);
  const recentSales = await getRecentSales(dateRange);
  const topProducts = await getTopProducts(dateRange);
  const customerStats = await getCustomerStats(dateRange);

  // Define table columns
  const topProductsColumns: TableColumn<(typeof topProducts)[0]>[] = [
    {
      key: 'product_name',
      header: 'Product',
      render: (row) => <span className="font-medium">{row.product_name}</span>
    },
    {
      key: 'status',
      header: 'Status',
      render: (row) => <Badge variant="outline">{row.status}</Badge>
    },
    {
      key: 'total_sales',
      header: 'Total Sales',
      align: 'right',
      render: (row) => formatNumber(row.total_sales)
    },
    {
      key: 'total_revenue',
      header: 'Revenue',
      align: 'right',
      render: (row) => formatCurrency(row.total_revenue)
    }
  ];

  const recentCustomersColumns: TableColumn<
    (typeof customerStats.recentCustomers)[0]
  >[] = [
    {
      key: 'customer_name',
      header: 'Customer',
      render: (row) => <span className="font-medium">{row.customer_name}</span>
    },
    {
      key: 'customer_email',
      header: 'Email'
    },
    {
      key: 'status',
      header: 'Status',
      render: (row) => <Badge variant="outline">{row.status}</Badge>
    },
    {
      key: 'spent',
      header: 'Spent',
      align: 'right',
      render: (row) => formatCurrency(row.spent)
    }
  ];

  return (
    <div className="flex flex-col gap-4 p-4 md:p-8">
      <div className="flex items-center justify-between">
        <h1 className="text-lg font-semibold md:text-2xl">Analytics</h1>
        <div className="flex items-center gap-2">
          <Suspense
            fallback={
              <Button variant="outline" size="sm" disabled>
                Loading...
              </Button>
            }
          >
            <TimeFilter defaultValue={timeRange} />
          </Suspense>
          <Button variant="outline" size="sm">
            Download Report
          </Button>
        </div>
      </div>

      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="products">Products</TabsTrigger>
          <TabsTrigger value="customers">Customers</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <MetricCard
              title="Total Revenue"
              value={formatCurrency(overviewMetrics.totalRevenue)}
              description="+20.1% from last month"
              icon={DollarSign}
            />
            <MetricCard
              title="Subscriptions"
              value={overviewMetrics.totalSales}
              description="+180.1% from last month"
              icon={Users}
              prefix="+"
            />
            <MetricCard
              title="Sales"
              value={overviewMetrics.totalSales}
              description="+19% from last month"
              icon={CreditCard}
              prefix="+"
            />
            <MetricCard
              title="Active Now"
              value={overviewMetrics.activeNow}
              description="since last hour"
              icon={Activity}
              prefix="+"
            />
          </div>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
            <RevenueChart
              data={revenueOverTime}
              formatCurrency={formatCurrency}
            />
            <RecentSalesList
              sales={recentSales}
              formatCurrency={formatCurrency}
            />
          </div>
        </TabsContent>

        <TabsContent value="products" className="space-y-4">
          <DataTable
            title="Top Products"
            description="Top performing products by revenue and volume."
            columns={topProductsColumns}
            data={topProducts}
            formatCurrency={formatCurrency}
            formatNumber={formatNumber}
          />
        </TabsContent>

        <TabsContent value="customers" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <MetricCard
              title="Total Customers"
              value={customerStats.totalCustomers}
              description="Total unique customers"
              icon={Users}
            />
            <MetricCard
              title="Top Spenders"
              value={customerStats.recentCustomers.length}
              description="Most active customers"
              icon={Activity}
            />
          </div>
          <DataTable
            title="Recent Customers"
            description="New customer signups and their first orders."
            columns={recentCustomersColumns}
            data={customerStats.recentCustomers}
            formatCurrency={formatCurrency}
            formatNumber={formatNumber}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
}
