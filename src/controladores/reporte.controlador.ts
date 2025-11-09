import { Request, Response } from "express";
import { obtenerReportes } from "../servicios/reporte.servicio";

export async function getReportes(req: Request, res: Response) {
  try {
    const data = await obtenerReportes();
    res.json(data);
  } catch (error) {
    console.error("Error generando reportes:", error);
    res.status(500).json({ error: "Error generando reportes" });
  }
}
