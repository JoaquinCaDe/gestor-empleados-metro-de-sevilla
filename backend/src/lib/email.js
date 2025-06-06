// filepath: backend/src/lib/email.js
import { Resend } from 'resend';
import 'dotenv/config';

// Initialize Resend client
const resend = new Resend(process.env.RESEND_API_KEY);

/**
 * Send an email reminder for a shift
 * @param {string} to - recipient email
 * @param {Object} shiftData - shift details
 * @param {string} shiftData.title
 * @param {Date|string} shiftData.start
 * @param {Date|string} shiftData.end
 * @param {string} shiftData.employeeName
 */
export async function sendShiftReminder(to, shiftData) {
  try {
    console.log(`📧 Starting email send process...`);
    console.log(`📧 Recipient: ${to}`);
    console.log(`📧 RESEND_API_KEY exists: ${!!process.env.RESEND_API_KEY}`);
    console.log(`📧 FROM_EMAIL: ${process.env.FROM_EMAIL}`);

    const { title, start, end, employeeName } = shiftData;

    const shiftDate = new Date(start).toLocaleDateString("es-ES", {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });

    const shiftTime = `${new Date(start).toLocaleTimeString("es-ES", {
      hour: '2-digit',
      minute: '2-digit'
    })} - ${new Date(end).toLocaleTimeString("es-ES", {
      hour: '2-digit',
      minute: '2-digit'
    })}`;

    // Add timestamp for testing purposes
    const timestamp = new Date().toLocaleString("es-ES");
    const isTestShift = title.includes('TEST'); console.log(`📧 Sending email with Resend...`);
    const result = await resend.emails.send({
      from: 'Metro Sevilla <onboarding@resend.dev>',
      // to,
      to: "jcarreradelgado@hotmail.com",
      subject: `${isTestShift ? '🧪 [PRUEBA] ' : ''}Recordatorio de turno: ${title}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          ${isTestShift ? '<div style="background-color: #fef3c7; padding: 15px; border-radius: 8px; margin-bottom: 20px; border-left: 4px solid #f59e0b;"><h3 style="margin: 0; color: #92400e;">🧪 ESTE ES UN EMAIL DE PRUEBA</h3><p style="margin: 5px 0 0 0; color: #92400e;">Enviado el: ${timestamp}</p></div>' : ''}
          <h2 style="color: #2563eb; margin-bottom: 20px;">🚇 Recordatorio de Turno - Metro de Sevilla</h2>
          <p>Hola <strong>${employeeName}</strong>,</p>
          <p>Te recordamos que tienes asignado el siguiente turno:</p>
          
          <div style="background-color: #f3f4f6; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #2563eb;">
            <h3 style="margin: 0 0 10px 0; color: #374151;">${title}</h3>
            <p style="margin: 5px 0;"><strong>📅 Fecha:</strong> ${shiftDate}</p>
            <p style="margin: 5px 0;"><strong>🕐 Horario:</strong> ${shiftTime}</p>
            ${isTestShift ? `<p style="margin: 5px 0; color: #f59e0b;"><strong>⏰ Email enviado:</strong> ${timestamp}</p>` : ''}
          </div>
          
          <p>Por favor, asegúrate de estar presente en tu puesto de trabajo a la hora indicada.</p>
          <p style="margin-top: 30px;">¡Gracias por tu dedicación al servicio público!</p>
          
          <hr style="margin: 30px 0; border: none; border-top: 1px solid #e5e7eb;">
          <p style="font-size: 12px; color: #6b7280;">
            Este es un recordatorio automático del Sistema de Gestión de Turnos - Metro de Sevilla
            ${isTestShift ? '<br><strong>🧪 Email de prueba del sistema</strong>' : ''}
          </p>
        </div>
      `
    });

    console.log(`✅ Email sent successfully! Result:`, result);
    console.log(`✅ Shift reminder sent to ${to} for shift: ${title} (sent at ${timestamp})`);
  } catch (error) {
    console.error('❌ Error sending shift reminder:', error);
    console.error('❌ Error details:', error.message);
    throw error;
  }
}

export default { sendShiftReminder };
