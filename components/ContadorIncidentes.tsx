'use client'

import { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { AlertTriangle } from 'lucide-react';
import { ContadorData } from '@/lib/types/contador';
import { formatarTempo } from '@/lib/utils/time';
import { TimeDisplay } from './contador/TimeDisplay';
import { ErrorDisplay } from './contador/ErrorDisplay';
import { StatsDisplay } from './contador/StatsDisplay';

export default function ContadorIncidentes() {
  const [dados, setDados] = useState<ContadorData | null>(null);
  const [erro, setErro] = useState<string | null>(null);

  const fetchDados = async () => {
    try {
      const response = await fetch('/api/contador');
      if (!response.ok) {
        throw new Error('Falha ao obter dados');
      }
      const novosDados: ContadorData = await response.json();
      setDados(novosDados);
      setErro(null);
    } catch (error) {
      console.error('Erro ao obter dados:', error);
      setErro('Erro ao carregar dados. Por favor, tente novamente mais tarde.');
    }
  };

  useEffect(() => {
    fetchDados();
    const intervalo = setInterval(fetchDados, 1000);
    return () => clearInterval(intervalo);
  }, []);

  const handleReset = async () => {
    try {
      const response = await fetch('/api/contador', { method: 'POST' });
      if (!response.ok) {
        throw new Error('Falha ao resetar contador');
      }
      const novosDados: ContadorData = await response.json();
      setDados(novosDados);
      setErro(null);
    } catch (error) {
      console.error('Erro ao resetar contador:', error);
      setErro('Erro ao resetar contador. Por favor, tente novamente mais tarde.');
    }
  };

  const tempoFormatado = dados ? formatarTempo(dados.tempoDecorrido) : { dias: 0, horas: 0, minutos: 0, segs: 0 };
  const timeUnits = [
    { valor: tempoFormatado.dias, label: 'dias' },
    { valor: tempoFormatado.horas.toString().padStart(2, '0'), label: 'horas' },
    { valor: tempoFormatado.minutos.toString().padStart(2, '0'), label: 'minutos' },
    { valor: tempoFormatado.segs.toString().padStart(2, '0'), label: 'segundos' }
  ];

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-b from-gray-900 to-gray-800">
      <Card className="w-full max-w-5xl mx-4 bg-white/95 backdrop-blur-sm shadow-2xl border-0">
        <CardContent className="p-8">
          {erro ? (
            <ErrorDisplay message={erro} />
          ) : (
            <>
              <div className="text-center mb-8 p-5">
                <h1 className="text-5xl font-bold mb-6 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  Contador da 5ª série
                </h1>
                <h2 className="text-3xl m-6 text-gray-700">Estamos há</h2>
                <TimeDisplay timeUnits={timeUnits} />
                <h2 className="text-3xl m-8 text-gray-700">sem a necessidade de uma nova reunião</h2>
              </div>
              <StatsDisplay 
                ultimoReset={dados?.ultimoReset || null}
                contadorResets={dados?.contadorResets || 0}
              />
            </>
          )}
        </CardContent>
        <CardFooter className="flex justify-center p-6 pt-0">
          <Button 
            onClick={handleReset} 
            size="lg" 
            variant="destructive"
            className="hover:scale-105 transition-transform duration-200 text-xl py-6 px-8 space-x-3"
          >
            <AlertTriangle className="w-6 h-6" />
            <span>Alertar Incidente</span>
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}