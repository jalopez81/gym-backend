import logger from './logger';

const generateUUID = () => Math.random().toString(16).substr(2);

const usuarios = ['juan', 'maria', 'carlos', 'ana', 'jorge'];
const endpoints = ['/api/usuarios', '/api/productos', '/api/login', '/api/registro', '/api/compras'];
const niveles: ('info' | 'warn' | 'error')[] = ['info', 'warn', 'error'];
const statusCodes = [200, 201, 204, 400, 401, 403, 404, 500, 0];

function generarLogSimulado() {
  let nivel = niveles[Math.floor(Math.random() * niveles.length)];
  const usuario = usuarios[Math.floor(Math.random() * usuarios.length)];
  const endpoint = endpoints[Math.floor(Math.random() * endpoints.length)];
  let status = statusCodes[Math.floor(Math.random() * statusCodes.length)];

  if (status === 0 || status >= 500) nivel = 'error';
  else if (status >= 400) nivel = 'warn';
  else nivel = 'info';

  const mensaje = `Usuario ${usuario} accedió a ${endpoint} [${nivel.toUpperCase()}] con status ${status}`;

  const atributos = {
    requestId: generateUUID(),
    userId: usuario,
    endpoint,
    status,
    sessionTime: Math.floor(Math.random() * 10000), // ms de sesión simulada
    payloadSize: Math.floor(Math.random() * 5000) // bytes
  };

  switch (nivel) {
    case 'info': logger.info(mensaje, atributos); break;
    case 'warn': logger.warn(mensaje, atributos); break;
    case 'error': logger.error(mensaje, atributos); break;
  }
}

// Generar logs cada 300ms
const intervalo = setInterval(generarLogSimulado, 300);

// Detener después de 2 minutos
setTimeout(() => {
  clearInterval(intervalo);
  console.log('Simulación de logs detenida');
}, 2 * 60 * 1000);
