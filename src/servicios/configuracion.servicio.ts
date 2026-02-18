import prisma from '../modelos/prisma';

export const obtenerConfiguracion = async () => {
  const config = await prisma.configuracion.findFirst();
  return config; 
};


export const crearConfiguracion = async (datos: any) => {
  const existente = await prisma.configuracion.findFirst();
  if (existente) throw new Error('Ya existe una configuración.');
  return await prisma.configuracion.create({ data: datos });
};

export const actualizarConfiguracion = async (id: string, datos: any) => {
  const config = await prisma.configuracion.findUnique({ where: { id } });
  if (!config) throw new Error('Configuración no encontrada');
  return await prisma.configuracion.update({
    where: { id },
    data: datos,
  });
};
