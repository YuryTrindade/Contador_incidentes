'use client'

interface TimeUnit {
  valor: number | string;
  label: string;
}

interface TimeDisplayProps {
  timeUnits: TimeUnit[];
}

export function TimeDisplay({ timeUnits }: TimeDisplayProps) {
  return (
    <div className="grid grid-cols-4 gap-4 m-6">
      {timeUnits.map((item, index) => (
        <div key={index} className="flex flex-col items-center p-4 bg-gray-50 rounded-xl shadow-inner">
          <div className="text-6xl font-bold text-blue-600 font-mono">{item.valor}</div>
          <div className="text-xl text-gray-600 mt-2">{item.label}</div>
        </div>
      ))}
    </div>
  );
}