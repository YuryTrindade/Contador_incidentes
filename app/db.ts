import Database from 'better-sqlite3';
import path from 'path';

const dbPath = path.join(process.cwd(), 'contador.sqlite');
const db = new Database(dbPath);

db.exec(`
  CREATE TABLE IF NOT EXISTS contador (
    id INTEGER PRIMARY KEY,
    tempo_decorrido INTEGER NOT NULL,
    ultimo_reset TEXT,
    contador_resets INTEGER NOT NULL,
    ultima_atualizacao INTEGER NOT NULL
  )
`);

// Inserir dados iniciais se a tabela estiver vazia
const row = db.prepare('SELECT * FROM contador WHERE id = 1').get();
if (!row) {
  db.prepare(`
    INSERT INTO contador (id, tempo_decorrido, ultimo_reset, contador_resets, ultima_atualizacao)
    VALUES (1, 0, NULL, 0, ?)
  `).run(Date.now());
}

export default db;

