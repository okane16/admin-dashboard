import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { RevenueOverTimeDataPoint } from '@/moose/queries';

interface RevenueChartProps {
  data: RevenueOverTimeDataPoint[];
  formatCurrency: (value: number) => string;
}

export function RevenueChart({ data, formatCurrency }: RevenueChartProps) {
  const maxRevenue = Math.max(...data.map((d) => d.revenue), 1);

  return (
    <Card className="col-span-4">
      <CardHeader>
        <CardTitle>Revenue Over Time</CardTitle>
      </CardHeader>
      <CardContent className="pl-2">
        <div className="h-[200px] w-full flex items-end justify-between gap-2 px-4">
          {data.map((dataPoint, i) => (
            <div
              key={i}
              className="bg-primary w-full rounded-t-sm hover:bg-primary/80 transition-colors relative group"
              style={{
                height: `${(dataPoint.revenue / maxRevenue) * 100}%`
              }}
            >
              <div className="absolute bottom-full mb-1 hidden group-hover:block text-xs bg-primary text-primary-foreground p-1 rounded whitespace-nowrap">
                {formatCurrency(dataPoint.revenue)}
              </div>
            </div>
          ))}
          {data.length === 0 && (
            <div className="w-full h-full flex items-center justify-center text-muted-foreground">
              No revenue data available
            </div>
          )}
        </div>
        <div className="flex justify-between px-4 mt-2 text-xs text-muted-foreground">
          {data.map((dataPoint, i) => (
            <span key={i}>
              {new Date(dataPoint.month).toLocaleDateString('en-US', {
                month: 'short'
              })}
            </span>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
