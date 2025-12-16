'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import { Calendar, ChevronDown } from 'lucide-react';
import { TimeRange } from './utils';

interface TimeFilterOption {
  value: TimeRange;
  label: string;
}

const timeFilterOptions: TimeFilterOption[] = [
  { value: '7d', label: 'Last 7 days' },
  { value: '30d', label: 'Last 30 days' },
  { value: '90d', label: 'Last 90 days' },
  { value: 'this_month', label: 'This month' },
  { value: 'last_month', label: 'Last month' },
  { value: 'all', label: 'All time' }
];

interface TimeFilterProps {
  defaultValue?: TimeRange;
}

export function TimeFilter({ defaultValue = '30d' }: TimeFilterProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const currentRange = (searchParams.get('range') as TimeRange) || defaultValue;

  const handleRangeChange = (range: TimeRange) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set('range', range);
    router.push(`?${params.toString()}`);
  };

  const currentLabel =
    timeFilterOptions.find((opt) => opt.value === currentRange)?.label ||
    'Select range';

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="sm" className="gap-2">
          <Calendar className="h-4 w-4" />
          {currentLabel}
          <ChevronDown className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {timeFilterOptions.map((option) => (
          <DropdownMenuItem
            key={option.value}
            onClick={() => handleRangeChange(option.value)}
            className={currentRange === option.value ? 'bg-accent' : ''}
          >
            {option.label}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
