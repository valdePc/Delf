// restablecer.js

// Configuración de Airtable (reemplaza con tus datos)
const AIRTABLE_API_KEY = 'YOUR_AIRTABLE_API_KEY';
const AIRTABLE_BASE_ID = 'YOUR_AIRTABLE_BASE_ID';
const USERS_TABLE = 'Users'; // Nombre de la tabla en Airtable

// Configuración de los headers para Airtable
const airtableHeaders = {
  'Authorization': `Bearer ${AIRTABLE_API_KEY}`,
  'Content-Type': 'application/json'
};

// Configuración de EmailJS (reemplaza con tus datos)
const airtableApiKey = 'patygcsH0vq1IXBGs.2ba9bfa1d43b68cd1b2c95d0d799e97038e80ab9388d6f87e071efbe6ec18bd4';
const baseId = 'appx4eD3f7NINswZW';
const EMAILJS_USER_ID = 'contraseña';

// Inicializar EmailJS (asegúrate de que la librería esté incluida en tu HTML)
emailjs.init(EMAILJS_USER_ID);

// Función para obtener un usuario por correo electrónico desde Airtable
async function fetchUserByEmail(email) {
  const filterFormula = encodeURIComponent(`{email} = '${email}'`);
  const url = `https://api.airtable.com/v0/${AIRTABLE_BASE_ID}/${USERS_TABLE}?filterByFormula=${filterFormula}`;
  try {
    const response = await fetch(url, {
      method: 'GET',
      headers: airtableHeaders
    });
    const data = await response.json();
    if (data.records && data.records.length > 0) {
      return data.records[0];
    }
    return null;
  } catch (error) {
    console.error('Error al obtener el usuario:', error);
    throw error;
  }
}

// Función para generar un token de restablecimiento (ejemplo básico, no para producción)
function generateResetToken() {
  // Genera un token aleatorio sencillo; en producción, utiliza métodos seguros y en el servidor.
  return Math.random().toString(36).substr(2);
}

// Función para enviar el correo de restablecimiento utilizando EmailJS
async function resetPassword(email) {
  try {
    const user = await fetchUserByEmail(email);
    if (user) {
      // Generar token de restablecimiento
      const resetToken = generateResetToken();

      // Aquí podrías guardar el token en Airtable o en otro sistema para su validación posterior.

      // Construir los parámetros para la plantilla de EmailJS
      const templateParams = {
        to_email: email,
        user_name: user.fields.name,
        reset_link: `https://tudominio.com/reset-password?token=${resetToken}` // Ajusta el dominio y la ruta
      };

      // Enviar el email utilizando EmailJS
      const response = await emailjs.send(EMAILJS_SERVICE_ID, EMAILJS_TEMPLATE_ID, templateParams);
      console.log('Email enviado:', response.status, response.text);
      return true;
    } else {
      throw new Error('Usuario no encontrado');
    }
  } catch (error) {
    console.error('Error en resetPassword:', error);
    throw error;
  }
}

// Control del formulario de restablecimiento de contraseña
document.addEventListener('DOMContentLoaded', () => {
  const resetForm = document.getElementById('reset-form');

  resetForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const email = document.getElementById('reset-email').value.trim();

    try {
      await resetPassword(email);
      alert('Se han enviado las instrucciones para restablecer la contraseña a tu correo.');
      resetForm.reset();
      // Opcional: redirigir a la página de inicio de sesión
      // window.location.href = 'login.html';
    } catch (error) {
      alert('Error al restablecer la contraseña: ' + error.message);
    }
  });
});
