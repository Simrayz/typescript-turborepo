import { JotaiPeople } from './components/JotaiPeople';
import { Card, Counter } from '@/components';

function App() {
  return (
    <div className="h-screen w-screen flex flex-col bg-slate-300 gap-4 py-4">
      <header className="container mx-auto bg-white rounded-md flex p-4">
        <h1 className="text-2xl font-semibold">Jotai React Playground</h1>
      </header>
      <main className="container mx-auto flex-1 space-y-4">
        <div className="flex gap-4 flex-wrap">
          <Card className="flex-1">
            <h3 className="text-xl semi-bold">Hello React + Vite!</h3>
            <h4 className="text-lg">
              This is a starter application for a React + Vite app with Vitest, Prettier and
              TailwindCSS setup.
            </h4>
          </Card>
          <Counter />
        </div>
        <JotaiPeople />
      </main>
    </div>
  );
}

export default App;
