import fs from 'fs/promises';
import path from 'path';
import { ContadorData } from './types/contador';

const DATA_FILE = path.join(process.cwd(), 'data', 'contador.json');

const defaultData: ContadorData = {
  tempoDecorrido: 0,
  ultimoReset: null,
  contadorResets: 0,
  ultimaAtualizacao: Date.now()
};

export async function getContadorData(): Promise<ContadorData> {
  try {
    const data = await fs.readFile(DATA_FILE, 'utf-8');
    return JSON.parse(data);
  } catch (error) {
    // If file doesn't exist, create it with default data
    await fs.mkdir(path.dirname(DATA_FILE), { recursive: true });
    await fs.writeFile(DATA_FILE, JSON.stringify(defaultData, null, 2));
    return defaultData;
  }
}

export async function updateContadorData(tempoDecorrido: number, ultimaAtualizacao: number): Promise<void> {
  const currentData = await getContadorData();
  const newData = {
    ...currentData,
    tempoDecorrido,
    ultimaAtualizacao
  };
  
  await fs.writeFile(DATA_FILE, JSON.stringify(newData, null, 2));
}

export async function resetContador(): Promise<ContadorData> {
  const currentData = await getContadorData();
  const newData: ContadorData = {
    tempoDecorrido: 0,
    ultimoReset: new Date().toISOString(),
    contadorResets: currentData.contadorResets + 1,
    ultimaAtualizacao: Date.now()
  };
  
  await fs.writeFile(DATA_FILE, JSON.stringify(newData, null, 2));
  return newData;
}