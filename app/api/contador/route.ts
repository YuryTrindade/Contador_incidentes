import { NextResponse } from 'next/server';
import fs from 'fs/promises';
import path from 'path';

const DATA_FILE = path.join(process.cwd(), 'data', 'contador.json');

interface ContadorData {
  tempoDecorrido: number;
  ultimoReset: string | null;
  contadorResets: number;
  ultimaAtualizacao: number;
}

async function lerDados(): Promise<ContadorData> {
  try {
    const data = await fs.readFile(DATA_FILE, 'utf-8');
    return JSON.parse(data);
  } catch (error) {
    console.error('Erro ao ler dados:', error);
    return {
      tempoDecorrido: 0,
      ultimoReset: null,
      contadorResets: 0,
      ultimaAtualizacao: Date.now()
    };
  }
}

async function salvarDados(dados: ContadorData) {
  try {
    await fs.mkdir(path.dirname(DATA_FILE), { recursive: true });
    await fs.writeFile(DATA_FILE, JSON.stringify(dados, null, 2));
  } catch (error) {
    console.error('Erro ao salvar dados:', error);
  }
}

export async function GET() {
  const dados = await lerDados();
  const agora = Date.now();
  const tempoPassado = Math.floor((agora - dados.ultimaAtualizacao) / 1000);
  dados.tempoDecorrido += tempoPassado;
  dados.ultimaAtualizacao = agora;
  await salvarDados(dados);
  return NextResponse.json(dados);
}

export async function POST() {
  const dados = await lerDados();
  dados.tempoDecorrido = 0;
  dados.ultimoReset = new Date().toISOString();
  dados.contadorResets += 1;
  dados.ultimaAtualizacao = Date.now();
  await salvarDados(dados);
  return NextResponse.json(dados);
}

