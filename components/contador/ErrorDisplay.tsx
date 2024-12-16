'use client'

import { AlertTriangle } from 'lucide-react';

interface ErrorDisplayProps {
  message: string;
}

export function ErrorDisplay({ message }: ErrorDisplayProps) {
  return (
    <div className="text-center text-red-500 p-4 bg-red-100 rounded-lg">
      <AlertTriangle className="w-6 h-6 mx-auto mb-2" />
      {message}
    </div>
  );
}