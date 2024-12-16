import { getContadorData, updateContadorData, resetContador as resetDB } from '../db';
import { ContadorData } from '../types/contador';

export async function readContadorData(): Promise<ContadorData> {
  const data = await getContadorData();
  
  const now = Date.now();
  const timeDiff = Math.floor((now - data.ultimaAtualizacao) / 1000);
  const newTempoDecorrido = data.tempoDecorrido + timeDiff;
  
  await updateContadorData(newTempoDecorrido, now);
  
  return {
    tempoDecorrido: newTempoDecorrido,
    ultimoReset: data.ultimoReset,
    contadorResets: data.contadorResets,
    ultimaAtualizacao: now
  };
}

export async function resetContador(): Promise<ContadorData> {
  return await resetDB();
}