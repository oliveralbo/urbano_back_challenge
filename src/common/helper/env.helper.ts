import { resolve } from 'path';

/**
 * Retorna la ruta absoluta al archivo .env en la raíz del proyecto.
 * @param _dest Parámetro mantenido por compatibilidad de firma, pero ignorado.
 */
export function getEnvPath(): string {
  return resolve(process.cwd(), '.env');
}
