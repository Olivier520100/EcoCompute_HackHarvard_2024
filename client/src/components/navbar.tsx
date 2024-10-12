import { Trees } from "lucide-react";

export default function Navbar() {
  return (
    <header className="bg-green-600 text-white p-3 flex justify-between items-center shadow-md">
      <div className="flex items-center space-x-4">
        <Trees className="h-8 w-8" />
        <h1 className="text-xl font-bold">EcoCompute</h1>
      </div>
    </header>
  );
}
