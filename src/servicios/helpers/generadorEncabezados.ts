import ExcelJS from 'exceljs';

export const crearEncabezadoReporte = (
  worksheet: ExcelJS.Worksheet,
  titulo: string,
  filtros?: Record<string, string | number>,
  usuario?: string,
  total?: number
) => {
  // Título principal
  worksheet.mergeCells('A1:F1');
  const tituloCell = worksheet.getCell('A1');
  tituloCell.value = titulo;
  tituloCell.font = { bold: true, size: 16 };
  tituloCell.alignment = { horizontal: 'center' };

  // Fecha y usuario
  worksheet.getCell('A2').value = `Generado: ${new Date().toLocaleString('es-ES')}`;
  if (usuario) worksheet.getCell('C2').value = `Usuario: ${usuario}`;

  // Filtros aplicados
  if (filtros && Object.keys(filtros).length > 0) {
    const textoFiltros = Object.entries(filtros)
      .map(([k, v]) => `${k}: ${v}`)
      .join(' | ');
    worksheet.getCell('A3').value = `Filtros: ${textoFiltros}`;
  }

  // Total de registros
  if (typeof total === 'number') {
    worksheet.getCell('A4').value = `Total de registros: ${total}`;
  }

  // Espacio antes de encabezados de columnas
  worksheet.addRow([]);
  worksheet.addRow([]);
};
