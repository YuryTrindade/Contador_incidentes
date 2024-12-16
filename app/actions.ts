'use server'

import db from './db';

interface ContadorData {
  tempoDecorrido: number;
  ultimoReset: string | null;
  contadorResets: number;
  ultimaAtualizacao: number;
}

function lerDados(): ContadorData {
  const row = db.prepare('SELECT * FROM contador WHERE id = 1').get();
  return {
    tempoDecorrido: row.tempo_decorrido,
    ultimoReset: row.ultimo_reset,
    contadorResets: row.contador_resets,
    ultimaAtualizacao: row.ultima_atualizacao,
  };
}

function salvarDados(dados: ContadorData) {
  db.prepare(`
    UPDATE contador
    SET tempo_decorrido = ?,
        ultimo_reset = ?,
        contador_resets = ?,
        ultima_atualizacao = ?
    WHERE id = 1
  `).run(
    dados.tempoDecorrido,
    dados.ultimoReset,
    dados.contadorResets,
    dados.ultimaAtualizacao
  );
}

export async function obterDados() {
  const dados = lerDados();
  const agora = Date.now();
  const tempoPassado = Math.floor((agora - dados.ultimaAtualizacao) / 1000);
  dados.tempoDecorrido += tempoPassado;
  dados.ultimaAtualizacao = agora;
  salvarDados(dados);
  return dados;
}

export async function resetarContador() {
  const dados = lerDados();
  dados.tempoDecorrido = 0;
  dados.ultimoReset = new Date().toISOString();
  dados.contadorResets += 1;
  dados.ultimaAtualizacao = Date.now();
  salvarDados(dados);
  return dados;
}

