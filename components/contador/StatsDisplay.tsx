'use client'

interface StatsDisplayProps {
  ultimoReset: string | null;
  contadorResets: number;
}

export function StatsDisplay({ ultimoReset, contadorResets }: StatsDisplayProps) {
  return (
    <div className="text-right space-y-1">
      {ultimoReset && (
        <p className="text-gray-600">
          Última ocorrência em: {new Date(ultimoReset).toLocaleString()}
        </p>
      )}
      <p className="text-gray-600">
        Aconteceram <span className="font-semibold">{contadorResets}</span> ocorrências até agora
      </p>
      <p className="text-gray-500 text-sm">(desde que o contador foi criado)</p>
    </div>
  );
}