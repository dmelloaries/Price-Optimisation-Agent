import { Button } from "@/components/ui/button";

function App() {
  return (
    <div className="flex min-h-svh flex-col items-center justify-center">
      <Button>Click me</Button>

      <img
        src="/mello-logo.png"
        alt="App Logo"
        className="h-28 w-auto mt-6 mb-4"
      />
    </div>
  );
}

export default App;
