'use client'

import { useState, useEffect } from 'react'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { AlertTriangle } from 'lucide-react'

interface ContadorData {
  tempoDecorrido: number
  ultimoReset: string | null
  contadorResets: number
  ultimaAtualizacao: number
}

export default function ContadorIncidentes() {
  const [dados, setDados] = useState<ContadorData | null>(null)
  const [erro, setErro] = useState<string | null>(null)

  const fetchDados = async () => {
    try {
      const response = await fetch('/api/contador')
      if (!response.ok) {
        throw new Error('Falha ao obter dados')
      }
      const novosDados: ContadorData = await response.json()
      setDados(novosDados)
      setErro(null)
    } catch (error) {
      console.error('Erro ao obter dados:', error)
      setErro('Erro ao carregar dados. Por favor, tente novamente mais tarde.')
    }
  }

  useEffect(() => {
    fetchDados()
    const intervalo = setInterval(fetchDados, 1000)
    return () => clearInterval(intervalo)
  }, [])

  const handleReset = async () => {
    try {
      const response = await fetch('/api/contador', { method: 'POST' })
      if (!response.ok) {
        throw new Error('Falha ao resetar contador')
      }
      const novosDados: ContadorData = await response.json()
      setDados(novosDados)
      setErro(null)
    } catch (error) {
      console.error('Erro ao resetar contador:', error)
      setErro('Erro ao resetar contador. Por favor, tente novamente mais tarde.')
    }
  }

  const formatarTempo = (segundos: number) => {
    const dias = Math.floor(segundos / (3600 * 24))
    const horas = Math.floor((segundos % (3600 * 24)) / 3600)
    const minutos = Math.floor((segundos % 3600) / 60)
    const segs = segundos % 60

    return { dias, horas, minutos, segs }
  }

  const tempoFormatado = dados ? formatarTempo(dados.tempoDecorrido) : { dias: 0, horas: 0, minutos: 0, segs: 0 }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-100 to-black-100">
      <Card className="w-full max-w-5xl mx-4 shadow-2xl">
        <CardContent className="p-8">
          {erro ? (
            <div className="text-center text-red-500">{erro}</div>
          ) : (
            <>
              <div className="text-center mb-8 p-5">
                <h1 className="text-5xl font-bold mb-6 text-black-600">Contador da 5ª série</h1>
                <h2 className="text-3xl m-6">Estamos há</h2>
                <div className="flex justify-center items-baseline space-x-4 m-6">
                  <div className="text-7xl font-bold text-blue-600">{tempoFormatado.dias}</div>
                  <div className="text-3xl text-gray-600">dias</div>
                  <div className="text-7xl font-bold text-blue-600">{tempoFormatado.horas.toString().padStart(2, '0')}</div>
                  <div className="text-3xl text-gray-600">horas</div>
                  <div className="text-7xl font-bold text-blue-600">{tempoFormatado.minutos.toString().padStart(2, '0')}</div>
                  <div className="text-3xl text-gray-600">minutos</div>
                  <div className="text-7xl font-bold text-blue-600">{tempoFormatado.segs.toString().padStart(2, '0')}</div>
                  <div className="text-3xl text-gray-600">segundos</div>
                </div>
                <h2 className="text-3xl m-8">sem a necessidade de uma nova reunião</h2>
              </div>
              <div className="text-right text-lg text-gray-600 m-4">
                {dados?.ultimoReset && (
                  <p>Última ocorrência em: {new Date(dados.ultimoReset).toLocaleString()}</p>
                )}
                <p>aconteceram {dados?.contadorResets || 0} ocorrências até agora</p>
              </div>
            </>
          )}
        </CardContent>
        <CardFooter className="flex justify-center p-6 pt-0">
          <Button 
            onClick={handleReset} 
            size="lg" 
            className="bg-red-500 hover:bg-red-600 text-white px-8 py-3 rounded-md text-xl transition-colors duration-300 flex items-center space-x-2 border-2 border-white p-8"
          >
            <AlertTriangle className="w-6 h-6" />
            <span>alertar incidente</span>
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}

