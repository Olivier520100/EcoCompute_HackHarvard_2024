export default function OutputCell() {
  return (
    <div className="mb-6 bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200 overflow-hidden">
      <div className="bg-green-50 p-3">
        <span className="text-green-800 font-mono text-sm">Out [1]:</span>
      </div>
      <div className="p-4">
        <div className="bg-gray-100 h-48 flex items-center justify-center text-gray-500 rounded-md">
          [Plot output would be displayed here]
        </div>
      </div>
    </div>
  );
}
