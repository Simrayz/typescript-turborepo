import { Card } from './Card';
import { useState } from 'react';

export function Counter() {
  const [count, setCount] = useState(0);

  return (
    <Card className="space-y-4">
      <h3 className="text-xl semi-bold text-center">Controls</h3>
      <div className="flex items-center gap-1 text-lg">
        <button
          className="rounded-md hover:bg-gray-200 flex items-center justify-center h-6 w-6"
          onClick={() => {
            if (!count) return;
            setCount(count - 1);
          }}
        >
          -
        </button>
        <div className="rounded-md bg-purple-500 py-2 px-3 w-auto hover:bg-purple-400 text-white flex">
          <strong>{count}</strong>
        </div>
        <button
          className="rounded-md hover:bg-gray-200 flex items-center justify-center h-6 w-6"
          onClick={() => setCount(count + 1)}
        >
          +
        </button>
      </div>
    </Card>
  );
}
