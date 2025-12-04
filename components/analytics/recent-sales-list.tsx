import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from '@/components/ui/card';
import { EventModel } from 'dist/models/events';

interface RecentSalesListProps {
  sales: EventModel[];
  formatCurrency: (value: number) => string;
}

export function RecentSalesList({
  sales,
  formatCurrency
}: RecentSalesListProps) {
  return (
    <Card className="col-span-3">
      <CardHeader>
        <CardTitle>Recent Sales</CardTitle>
        <CardDescription>Latest transactions from your store.</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-8">
          {sales.map((sale, i) => (
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
  );
}
