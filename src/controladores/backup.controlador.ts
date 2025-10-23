import { Request, Response } from 'express';
import {
  crearBackup,
  obtenerBackups,
  restaurarBackup
} from '../servicios/backup.servicio';
import logger from '../config/logger';

export const crearBackupManual = async (req: Request, res: Response) => {
  try {
    const backup = await crearBackup();

    res.status(201).json(backup);
  } catch (error: any) {
    logger.error('Error al crear backup:', error);
    res.status(500).json({
      mensaje: error.message || 'Error al crear backup'
    });
  }
};

export const listarBackups = async (req: Request, res: Response) => {
  try {
    const backups = await obtenerBackups();

    res.status(200).json({      
      backups,
      total: backups.length
    });
  } catch (error: any) {
    logger.error('Error al listar backups:', error);
    res.status(500).json({
      mensaje: error.message || 'Error al obtener backups'
    });
  }
};

export const restaurarBackupPorId = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    // Validar que el ID sea un nombre válido de backup
    if (!id.startsWith('backup-') || !id.endsWith('.sql')) {
      return res.status(400).json({
        mensaje: 'ID de backup inválido'
      });
    }

    const resultado = await restaurarBackup(id);

    res.status(200).json(resultado);
  } catch (error: any) {
    logger.error('Error al restaurar backup:', error);
    res.status(500).json({
      mensaje: error.message || 'Error al restaurar backup'
    });
  }
};