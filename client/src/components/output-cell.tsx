type OutputCellProps = {
  output: string;
  id: number;
};

export default function OutputCell({ id, output }: OutputCellProps) {
  return (
    <div className="mb-6 bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200 overflow-hidden">
      <div className="bg-green-50 p-3">
        <span className="text-green-800 font-mono text-sm">
          Out [{id}]: {output}
        </span>
      </div>
    </div>
  );
}
