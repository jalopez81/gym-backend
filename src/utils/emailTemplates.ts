export const templateBienvenida = (nombre: string) => {
  return `
    <!DOCTYPE html>
    <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; background-color: #f4f4f4; }
          .container { max-width: 600px; margin: 0 auto; background-color: white; padding: 20px; border-radius: 8px; }
          .header { background-color: #366092; color: white; padding: 20px; text-align: center; border-radius: 8px 8px 0 0; }
          .content { padding: 20px; }
          .footer { background-color: #f4f4f4; padding: 10px; text-align: center; font-size: 12px; }
          .button { background-color: #366092; color: white; padding: 10px 20px; text-decoration: none; border-radius: 4px; display: inline-block; margin: 10px 0; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>¡Bienvenido a nuestro Gimnasio!</h1>
          </div>
          <div class="content">
            <p>Hola <strong>${nombre}</strong>,</p>
            <p>¡Nos alegra mucho que te hayas registrado en nuestro gimnasio!</p>
            <p>Tu cuenta ha sido creada exitosamente. Ahora puedes:</p>
            <ul>
              <li>Ver todas nuestras clases disponibles</li>
              <li>Reservar clases con tus entrenadores favoritos</li>
              <li>Comprar productos de entrenamiento</li>
              <li>Suscribirte a nuestros planes premium</li>
            </ul>
            <p>Si tienes alguna pregunta, no dudes en contactarnos.</p>
            <p>¡Que disfrutes tu experiencia!</p>
          </div>
          <div class="footer">
            <p>© 2025 Gimnasio. Todos los derechos reservados.</p>
          </div>
        </div>
      </body>
    </html>
  `;
};

export const templateSuscripcion = (
  nombre: string,
  plan: string,
  precio: number,
  fechaVencimiento: string
) => {
  return `
    <!DOCTYPE html>
    <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; background-color: #f4f4f4; }
          .container { max-width: 600px; margin: 0 auto; background-color: white; padding: 20px; border-radius: 8px; }
          .header { background-color: #366092; color: white; padding: 20px; text-align: center; border-radius: 8px 8px 0 0; }
          .content { padding: 20px; }
          .details { background-color: #f9f9f9; padding: 15px; border-left: 4px solid #366092; margin: 20px 0; }
          .footer { background-color: #f4f4f4; padding: 10px; text-align: center; font-size: 12px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>¡Suscripción Confirmada!</h1>
          </div>
          <div class="content">
            <p>Hola <strong>${nombre}</strong>,</p>
            <p>Tu suscripción ha sido procesada exitosamente.</p>
            <div class="details">
              <p><strong>Plan:</strong> ${plan}</p>
              <p><strong>Precio:</strong> $${precio.toFixed(2)}</p>
              <p><strong>Vence el:</strong> ${fechaVencimiento}</p>
            </div>
            <p>¡Ahora tienes acceso a todas nuestras clases y beneficios!</p>
          </div>
          <div class="footer">
            <p>© 2025 Gimnasio. Todos los derechos reservados.</p>
          </div>
        </div>
      </body>
    </html>
  `;
};

export const templateRecordatorioVencimiento = (
  nombre: string,
  plan: string,
  fechaVencimiento: string
) => {
  return `
    <!DOCTYPE html>
    <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; background-color: #f4f4f4; }
          .container { max-width: 600px; margin: 0 auto; background-color: white; padding: 20px; border-radius: 8px; }
          .header { background-color: #ff6b6b; color: white; padding: 20px; text-align: center; border-radius: 8px 8px 0 0; }
          .content { padding: 20px; }
          .button { background-color: #366092; color: white; padding: 10px 20px; text-decoration: none; border-radius: 4px; display: inline-block; margin: 10px 0; }
          .footer { background-color: #f4f4f4; padding: 10px; text-align: center; font-size: 12px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>¡Tu suscripción vence en 3 días!</h1>
          </div>
          <div class="content">
            <p>Hola <strong>${nombre}</strong>,</p>
            <p>Tu suscripción al plan <strong>${plan}</strong> vence el <strong>${fechaVencimiento}</strong>.</p>
            <p>Para no perder acceso a todas nuestras clases y beneficios, no olvides renovar tu suscripción.</p>
            <p>¡Renovar es rápido y fácil!</p>
          </div>
          <div class="footer">
            <p>© 2025 Gimnasio. Todos los derechos reservados.</p>
          </div>
        </div>
      </body>
    </html>
  `;
};

export const templateConfirmacionOrden = (
  nombre: string,
  ordenId: string,
  total: number,
  items: Array<{ nombre: string; cantidad: number; precio: number }>
) => {
  const itemsHtml = items
    .map(
      item =>
        `<tr>
          <td style="padding: 8px; border-bottom: 1px solid #ddd;">${item.nombre}</td>
          <td style="padding: 8px; border-bottom: 1px solid #ddd; text-align: center;">${item.cantidad}</td>
          <td style="padding: 8px; border-bottom: 1px solid #ddd; text-align: right;">$${item.precio.toFixed(2)}</td>
        </tr>`
    )
    .join('');

  return `
    <!DOCTYPE html>
    <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; background-color: #f4f4f4; }
          .container { max-width: 600px; margin: 0 auto; background-color: white; padding: 20px; border-radius: 8px; }
          .header { background-color: #366092; color: white; padding: 20px; text-align: center; border-radius: 8px 8px 0 0; }
          .content { padding: 20px; }
          table { width: 100%; border-collapse: collapse; margin: 20px 0; }
          .total { text-align: right; font-size: 18px; font-weight: bold; margin-top: 20px; padding-top: 10px; border-top: 2px solid #366092; }
          .footer { background-color: #f4f4f4; padding: 10px; text-align: center; font-size: 12px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>¡Orden Confirmada!</h1>
          </div>
          <div class="content">
            <p>Hola <strong>${nombre}</strong>,</p>
            <p>Tu orden <strong>#${ordenId}</strong> ha sido procesada exitosamente.</p>
            <table>
              <thead>
                <tr style="background-color: #f9f9f9;">
                  <th style="padding: 8px; text-align: left;">Producto</th>
                  <th style="padding: 8px; text-align: center;">Cantidad</th>
                  <th style="padding: 8px; text-align: right;">Precio</th>
                </tr>
              </thead>
              <tbody>
                ${itemsHtml}
              </tbody>
            </table>
            <div class="total">
              Total: $${total.toFixed(2)}
            </div>
            <p>¡Gracias por tu compra! Pronto recibirás más detalles sobre tu envío.</p>
          </div>
          <div class="footer">
            <p>© 2025 Gimnasio. Todos los derechos reservados.</p>
          </div>
        </div>
      </body>
    </html>
  `;
};

export const templateRecordatorioClase = (
  nombre: string,
  clase: string,
  hora: string,
  entrenador: string
) => {
  return `
    <!DOCTYPE html>
    <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; background-color: #f4f4f4; }
          .container { max-width: 600px; margin: 0 auto; background-color: white; padding: 20px; border-radius: 8px; }
          .header { background-color: #366092; color: white; padding: 20px; text-align: center; border-radius: 8px 8px 0 0; }
          .content { padding: 20px; }
          .details { background-color: #f9f9f9; padding: 15px; border-left: 4px solid #366092; margin: 20px 0; }
          .footer { background-color: #f4f4f4; padding: 10px; text-align: center; font-size: 12px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>¡Recordatorio: Tu clase es mañana!</h1>
          </div>
          <div class="content">
            <p>Hola <strong>${nombre}</strong>,</p>
            <p>Te recordamos que tienes una clase reservada mañana.</p>
            <div class="details">
              <p><strong>Clase:</strong> ${clase}</p>
              <p><strong>Hora:</strong> ${hora}</p>
              <p><strong>Entrenador:</strong> ${entrenador}</p>
            </div>
            <p>¡No olvides llegar 10 minutos antes!</p>
          </div>
          <div class="footer">
            <p>© 2025 Gimnasio. Todos los derechos reservados.</p>
          </div>
        </div>
      </body>
    </html>
  `;
};

export const templateNotificacionAdmin = (
  cliente: string,
  email: string,
  total: number,
  ordenId: string
) => {
  return `
    <!DOCTYPE html>
    <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; background-color: #f4f4f4; }
          .container { max-width: 600px; margin: 0 auto; background-color: white; padding: 20px; border-radius: 8px; }
          .header { background-color: #28a745; color: white; padding: 20px; text-align: center; border-radius: 8px 8px 0 0; }
          .content { padding: 20px; }
          .details { background-color: #f9f9f9; padding: 15px; border-left: 4px solid #28a745; margin: 20px 0; }
          .footer { background-color: #f4f4f4; padding: 10px; text-align: center; font-size: 12px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>¡Nueva Orden Completada!</h1>
          </div>
          <div class="content">
            <p>Se ha completado una nueva orden en el sistema.</p>
            <div class="details">
              <p><strong>Cliente:</strong> ${cliente}</p>
              <p><strong>Email:</strong> ${email}</p>
              <p><strong>Orden ID:</strong> ${ordenId}</p>
              <p><strong>Total:</strong> $${total.toFixed(2)}</p>
            </div>
            <p>Verifica los detalles en el panel de administración.</p>
          </div>
          <div class="footer">
            <p>© 2025 Gimnasio. Todos los derechos reservados.</p>
          </div>
        </div>
      </body>
    </html>
  `;
};