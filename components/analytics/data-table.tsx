import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';

export interface TableColumn<T> {
  key: keyof T | string;
  header: string;
  render?: (row: T) => React.ReactNode;
  align?: 'left' | 'right' | 'center';
}

interface DataTableProps<T> {
  title: string;
  description?: string;
  columns: TableColumn<T>[];
  data: T[];
  formatCurrency?: (value: number) => string;
  formatNumber?: (value: number) => string;
}

export function DataTable<T extends Record<string, any>>({
  title,
  description,
  columns,
  data,
  formatCurrency,
  formatNumber
}: DataTableProps<T>) {
  const formatValue = (value: any, column: TableColumn<T>): React.ReactNode => {
    if (column.render) {
      return column.render(value);
    }

    const cellValue =
      typeof column.key === 'string'
        ? value[column.key]
        : value[column.key as keyof T];

    if (typeof cellValue === 'number') {
      // Check if it's a currency value (has decimal places or is large)
      if (formatCurrency && (cellValue % 1 !== 0 || cellValue > 1000)) {
        return formatCurrency(cellValue);
      }
      if (formatNumber) {
        return formatNumber(cellValue);
      }
    }

    return cellValue;
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        {description && <CardDescription>{description}</CardDescription>}
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              {columns.map((column, i) => (
                <TableHead
                  key={i}
                  className={
                    column.align === 'right'
                      ? 'text-right'
                      : column.align === 'center'
                        ? 'text-center'
                        : ''
                  }
                >
                  {column.header}
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.map((row, i) => (
              <TableRow key={i}>
                {columns.map((column, j) => (
                  <TableCell
                    key={j}
                    className={
                      column.align === 'right'
                        ? 'text-right'
                        : column.align === 'center'
                          ? 'text-center'
                          : ''
                    }
                  >
                    {formatValue(row, column)}
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
