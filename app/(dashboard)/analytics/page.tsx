import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@/components/ui/table';
import {
  ArrowDownRight,
  ArrowUpRight,
  CreditCard,
  DollarSign,
  Users,
  Activity,
  Package
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import {
  getOverviewMetrics,
  getRevenueOverTime,
  getRecentSales,
  getTopProducts,
  getCustomerStats
} from '@/olap';

export const dynamic = 'force-dynamic';

export default async function AnalyticsPage() {
  const overviewMetrics = await getOverviewMetrics();
  const revenueOverTime = await getRevenueOverTime();
  const recentSales = await getRecentSales();
  const topProducts = await getTopProducts();
  const customerStats = await getCustomerStats();

  const formatCurrency = (value: number) =>
    new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(value);

  const formatNumber = (value: number) =>
    new Intl.NumberFormat('en-US').format(value);

  // Determine max revenue for chart scaling
  const maxRevenue = Math.max(...revenueOverTime.map((d) => d.revenue), 1);

  return (
    <div className="flex flex-col gap-4 p-4 md:p-8">
      <div className="flex items-center justify-between">
        <h1 className="text-lg font-semibold md:text-2xl">Analytics</h1>
        <div className="flex items-center gap-2">
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
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Total Revenue
                </CardTitle>
                <DollarSign className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {formatCurrency(overviewMetrics.totalRevenue)}
                </div>
                <p className="text-xs text-muted-foreground">
                  +20.1% from last month
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Subscriptions
                </CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  +{formatNumber(overviewMetrics.totalSales)}
                </div>
                <p className="text-xs text-muted-foreground">
                  +180.1% from last month
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Sales</CardTitle>
                <CreditCard className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  +{formatNumber(overviewMetrics.totalSales)}
                </div>
                <p className="text-xs text-muted-foreground">
                  +19% from last month
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Active Now
                </CardTitle>
                <Activity className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  +{overviewMetrics.activeNow}
                </div>
                <p className="text-xs text-muted-foreground">since last hour</p>
              </CardContent>
            </Card>
          </div>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
            <Card className="col-span-4">
              <CardHeader>
                <CardTitle>Revenue Over Time</CardTitle>
              </CardHeader>
              <CardContent className="pl-2">
                <div className="h-[200px] w-full flex items-end justify-between gap-2 px-4">
                  {revenueOverTime.map((data, i) => (
                    <div
                      key={i}
                      className="bg-primary w-full rounded-t-sm hover:bg-primary/80 transition-colors relative group"
                      style={{
                        height: `${(data.revenue / maxRevenue) * 100}%`
                      }}
                    >
                      <div className="absolute bottom-full mb-1 hidden group-hover:block text-xs bg-primary text-primary-foreground p-1 rounded whitespace-nowrap">
                        {formatCurrency(data.revenue)}
                      </div>
                    </div>
                  ))}
                  {revenueOverTime.length === 0 && (
                    <div className="w-full h-full flex items-center justify-center text-muted-foreground">
                      No revenue data available
                    </div>
                  )}
                </div>
                <div className="flex justify-between px-4 mt-2 text-xs text-muted-foreground">
                  {revenueOverTime.map((data, i) => (
                    <span key={i}>
                      {new Date(data.month).toLocaleDateString('en-US', {
                        month: 'short'
                      })}
                    </span>
                  ))}
                </div>
              </CardContent>
            </Card>
            <Card className="col-span-3">
              <CardHeader>
                <CardTitle>Recent Sales</CardTitle>
                <CardDescription>
                  Latest transactions from your store.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-8">
                  {recentSales.map((sale, i) => (
                    <div key={i} className="flex items-center">
                      <div className="space-y-1">
                        <p className="text-sm font-medium leading-none">
                          {sale.customer_name}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {sale.customer_email}
                        </p>
                      </div>
                      <div className="ml-auto font-medium">
                        +{formatCurrency(sale.amount)}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="products" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Top Products</CardTitle>
              <CardDescription>
                Top performing products by revenue and volume.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Product</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Total Sales</TableHead>
                    <TableHead className="text-right">Revenue</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {topProducts.map((product, i) => (
                    <TableRow key={i}>
                      <TableCell className="font-medium">
                        {product.product_name}
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline">{product.status}</Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        {formatNumber(product.total_sales)}
                      </TableCell>
                      <TableCell className="text-right">
                        {formatCurrency(product.total_revenue)}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="customers" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Total Customers
                </CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {formatNumber(customerStats.totalCustomers)}
                </div>
                <p className="text-xs text-muted-foreground">
                  Total unique customers
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Top Spenders
                </CardTitle>
                <Activity className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {customerStats.recentCustomers.length}
                </div>
                <p className="text-xs text-muted-foreground">
                  Most active customers
                </p>
              </CardContent>
            </Card>
          </div>
          <Card>
            <CardHeader>
              <CardTitle>Recent Customers</CardTitle>
              <CardDescription>
                New customer signups and their first orders.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Customer</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Spent</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {customerStats.recentCustomers.map((customer, i) => (
                    <TableRow key={i}>
                      <TableCell className="font-medium">
                        {customer.customer_name}
                      </TableCell>
                      <TableCell>{customer.customer_email}</TableCell>
                      <TableCell>
                        <Badge variant="outline">{customer.status}</Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        {formatCurrency(customer.spent)}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
