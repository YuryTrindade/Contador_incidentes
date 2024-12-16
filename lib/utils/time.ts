export function formatarTempo(segundos: number) {
  const dias = Math.floor(segundos / (3600 * 24));
  const horas = Math.floor((segundos % (3600 * 24)) / 3600);
  const minutos = Math.floor((segundos % 3600) / 60);
  const segs = segundos % 60;

  return { dias, horas, minutos, segs };
}