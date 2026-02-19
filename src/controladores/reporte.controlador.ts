import { Request, Response } from "express";
import { obtenerReportes } from "../servicios/reporte.servicio";

export async function getReportes(req: Request, res: Response) {
  try {
    const reporte_name = req.params.reporte_name as string;
    const download = req.params.download as string;
    const data = await obtenerReportes(reporte_name, Boolean(download));

    if(Boolean(download)){
      res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
      res.setHeader('Content-Disposition', `attachment; filename=${reporte_name}.xlsx`);
      return res.send(data);
    }else{
      res.json(data);
    }
  } catch (error) {
    console.error("Error generando reportes:", error);
    res.status(500).json({ error: "Error generando reportes" });
  }
}
