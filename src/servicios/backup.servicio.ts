import { exec } from 'child_process';
import { promisify } from 'util';
import * as fs from 'fs/promises';
import * as path from 'path';
import archiver from 'archiver';
import logger from '../config/logger';

const execAsync = promisify(exec);

const BACKUP_DIR = process.env.BACKUP_DIR || './backups';
const DATABASE_URL = process.env.DATABASE_URL || '';

// Crear directorio de backups si no existe
const asegurarDirectorioBackups = async () => {
  try {
    await fs.mkdir(BACKUP_DIR, { recursive: true });
  } catch (error) {
    logger.error('Error al crear directorio de backups:', error);
  }
};

export const crearBackup = async () => {
  try {
    await asegurarDirectorioBackups();

    const fecha = new Date();
    const timestamp = fecha
      .toISOString()
      .replace(/[:.]/g, '-')
      .split('T')[0] + `-${fecha.getHours()}-${fecha.getMinutes()}-${fecha.getSeconds()}`;

    const nombreArchivo = `backup-${timestamp}.sql`;
    const rutaCompleta = path.join(BACKUP_DIR, nombreArchivo);

    // Extraer credenciales de DATABASE_URL
    const url = new URL(DATABASE_URL);
    const usuario = url.username;
    const password = url.password;
    const host = url.hostname;
    const puerto = url.port || '5432';
    const baseDatos = url.pathname.substring(1);

    // Ejecutar pg_dump con soporte Windows y Linux/Mac
    let comando: string;
    if (process.platform === 'win32') {
      // Windows
      comando = `set PGPASSWORD=${password}& pg_dump -U ${usuario} -h ${host} -p ${puerto} ${baseDatos} > "${rutaCompleta}"`;
    } else {
      // Linux/Mac
      comando = `PGPASSWORD="${password}" pg_dump -U ${usuario} -h ${host} -p ${puerto} ${baseDatos} > "${rutaCompleta}"`;
    }

    await execAsync(comando, { shell: 'cmd.exe' });

    logger.info(`Backup creado: ${nombreArchivo}`);

    return {
      nombre: nombreArchivo,
      ruta: rutaCompleta,
      fecha: fecha.toISOString(),
      tamaño: await obtenerTamañoArchivo(rutaCompleta)
    };
  } catch (error) {
    logger.error('Error al crear backup:', error);
    throw new Error('Error al crear backup');
  }
};

export const obtenerBackups = async () => {
  try {
    await asegurarDirectorioBackups();

    const archivos = await fs.readdir(BACKUP_DIR);
    const backups = [];

    for (const archivo of archivos) {
      if (archivo.startsWith('backup-') && archivo.endsWith('.sql')) {
        const rutaCompleta = path.join(BACKUP_DIR, archivo);
        const stats = await fs.stat(rutaCompleta);

        backups.push({
          id: archivo,
          nombre: archivo,
          fecha: stats.birthtime.toISOString(),
          tamaño: `${(stats.size / 1024 / 1024).toFixed(2)} MB`,
          tamaño_bytes: stats.size
        });
      }
    }

    return backups.sort(
      (a, b) =>
        new Date(b.fecha).getTime() - new Date(a.fecha).getTime()
    );
  } catch (error) {
    logger.error('Error al obtener backups:', error);
    throw new Error('Error al obtener backups');
  }
};

export const restaurarBackup = async (nombreArchivo: string) => {
  try {
    const rutaCompleta = path.join(BACKUP_DIR, nombreArchivo);

    // Verificar que el archivo existe
    await fs.stat(rutaCompleta);

    // Extraer credenciales de DATABASE_URL
    const url = new URL(DATABASE_URL);
    const usuario = url.username;
    const password = url.password;
    const host = url.hostname;
    const puerto = url.port || '5432';
    const baseDatos = url.pathname.substring(1);

    // Ejecutar psql para restaurar con soporte Windows y Linux/Mac
    let comando: string;
    if (process.platform === 'win32') {
      // Windows
      comando = `set PGPASSWORD=${password}& psql -U ${usuario} -h ${host} -p ${puerto} ${baseDatos} < "${rutaCompleta}"`;
    } else {
      // Linux/Mac
      comando = `PGPASSWORD="${password}" psql -U ${usuario} -h ${host} -p ${puerto} ${baseDatos} < "${rutaCompleta}"`;
    }

    await execAsync(comando, { shell: 'cmd.exe' });

    logger.info(`Backup restaurado: ${nombreArchivo}`);

    return {
      mensaje: 'Backup restaurado exitosamente',
      archivo: nombreArchivo
    };
  } catch (error) {
    logger.error('Error al restaurar backup:', error);
    throw new Error('Error al restaurar backup');
  }
};

const obtenerTamañoArchivo = async (ruta: string): Promise<string> => {
  try {
    const stats = await fs.stat(ruta);
    return `${(stats.size / 1024 / 1024).toFixed(2)} MB`;
  } catch {
    return '0 MB';
  }
};

export const programarBackupAutomatico = () => {
  const cron = require('node-cron');

  // Ejecutar cada domingo a las 2 AM
  cron.schedule('0 2 * * 0', async () => {
    logger.info('Iniciando backup automático semanal...');
    try {
      await crearBackup();
      await limpiarBackupsAntiguos(180);
      logger.info('Backup automático completado y limpieza realizada');
    } catch (error) {
      logger.error('Error en backup automático:', error);
    }
  });

  logger.info('Backup automático programado para domingos a las 2:00 AM');
};


export const eliminarBackup = async (nombreArchivo: string) => {
  try {
    const rutaCompleta = path.join(BACKUP_DIR, nombreArchivo);
    await fs.unlink(rutaCompleta);
    logger.info(`Backup eliminado: ${nombreArchivo}`);
    return { mensaje: 'Backup eliminado', archivo: nombreArchivo };
  } catch (error) {
    logger.error('Error al eliminar backup:', error);
    throw new Error('Error al eliminar backup');
  }
};


export const limpiarBackupsAntiguos = async (dias = 30) => {
  const archivos = await obtenerBackups();
  const limite = Date.now() - dias * 24 * 60 * 60 * 1000;

  for (const b of archivos) {
    if (new Date(b.fecha).getTime() < limite) {
      await fs.unlink(path.join(BACKUP_DIR, b.nombre));
      logger.info(`Backup antiguo eliminado: ${b.nombre}`);
    }
  }
};
