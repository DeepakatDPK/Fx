```typescript
import { NextResponse } from 'next/server';

export interface Position {
  id: string;
  currency_pair: string;
  decision: 'BUY' | 'SELL'; // Or 'LONG' / 'SHORT'
  entry_price: number;
  quantity: number;
  timestamp: string; // ISO date string
  status: 'OPEN' | 'CLOSED';
}

// Hardcoded positions for MVP
const mockPositions: Position[] = [
  {
    id: 'pos_1',
    currency_pair: 'EUR/USD',
    decision: 'BUY',
    entry_price: 1.0850,
    quantity: 10000,
    timestamp: new Date(Date.now() - 3 * 60 * 60 * 1000).toISOString(), // 3 hours ago
    status: 'OPEN',
  },
  {
    id: 'pos_2',
    currency_pair: 'GBP/JPY',
    decision: 'SELL',
    entry_price: 198.23,
    quantity: 5000,
    timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(), // 1 day ago
    status: 'OPEN',
  },
];

export async function GET() {
  try {
    // In a real application, you would fetch this from a database or in-memory store
    return NextResponse.json({ success: true, data: mockPositions });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'An unexpected error occurred';
    console.error('API Error in /api/positions:', errorMessage);
    return NextResponse.json({ success: false, error: errorMessage }, { status: 500 });
  }
}
```
