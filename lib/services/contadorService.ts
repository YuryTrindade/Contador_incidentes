import { promises as fs } from 'fs';
import path from 'path';
import { ContadorData } from '../types/contador';

const DATA_DIR = path.join(process.cwd(), 'data');
const DATA_FILE = path.join(DATA_DIR, 'contador.json');

export async function ensureDataFileExists() {
  try {
    await fs.mkdir(DATA_DIR, { recursive: true });
    try {
      await fs.access(DATA_FILE);
    } catch {
      const initialData: ContadorData = {
        tempoDecorrido: 0,
        ultimoReset: null,
        contadorResets: 0,
        ultimaAtualizacao: Date.now(),
      };
      await fs.writeFile(DATA_FILE, JSON.stringify(initialData, null, 2));
    }
  } catch (error) {
    console.error('Error ensuring data file exists:', error);
    throw error;
  }
}

export async function readContadorData(): Promise<ContadorData> {
  await ensureDataFileExists();
  const data = await fs.readFile(DATA_FILE, 'utf-8');
  const parsedData: ContadorData = JSON.parse(data);
  
  const now = Date.now();
  const timeDiff = Math.floor((now - parsedData.ultimaAtualizacao) / 1000);
  parsedData.tempoDecorrido += timeDiff;
  parsedData.ultimaAtualizacao = now;
  
  await fs.writeFile(DATA_FILE, JSON.stringify(parsedData, null, 2));
  return parsedData;
}

export async function resetContador(): Promise<ContadorData> {
  await ensureDataFileExists();
  const currentData = await readContadorData();
  
  const newData: ContadorData = {
    tempoDecorrido: 0,
    ultimoReset: new Date().toISOString(),
    contadorResets: currentData.contadorResets + 1,
    ultimaAtualizacao: Date.now(),
  };
  
  await fs.writeFile(DATA_FILE, JSON.stringify(newData, null, 2));
  return newData;
}