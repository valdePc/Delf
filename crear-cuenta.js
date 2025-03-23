(function() {
  // ======== Configuración de Airtable (reemplaza con tus datos) ========
  const airtableApiKey = 'patygcsH0vq1IXBGs.2ba9bfa1d43b68cd1b2c95d0d799e97038e80ab9388d6f87e071efbe6ec18bd4';
  const baseId = 'appx4eD3f7NINswZW';
  const USERS_TABLE = 'Users'; // Nombre de la tabla donde guardarás usuarios

  // Headers para la comunicación con Airtable
  const airtableHeaders = {
    'Authorization': `Bearer ${airtableApiKey}`,
    'Content-Type': 'application/json'
  };

  // Función para obtener un usuario por correo electrónico
  async function fetchUserByEmail(email) {
    const filterFormula = encodeURIComponent(`{email} = '${email}'`);
    const url = `https://api.airtable.com/v0/${baseId}/${USERS_TABLE}?filterByFormula=${filterFormula}`;
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

  // Función para registrar un nuevo usuario en Airtable
  async function registerUser(name, email, password) {
    const url = `https://api.airtable.com/v0/${baseId}/${USERS_TABLE}`;
    const body = {
      fields: {
        name: name,
        email: email,
        password: password  // Nota: No guardes contraseñas en texto plano en producción
      }
    };

    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: airtableHeaders,
        body: JSON.stringify(body)
      });
      const data = await response.json();
      console.log('Respuesta de Airtable:', data);
      return data;
    } catch (error) {
      console.error('Error al registrar el usuario:', error);
      throw error;
    }
  }

  // Evento principal al cargar la página
  document.addEventListener('DOMContentLoaded', () => {
    const registerForm = document.getElementById('register-form');

    // Manejo del envío del formulario de registro
    registerForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const name = document.getElementById('register-name').value.trim();
      const email = document.getElementById('register-email').value.trim();
      const password = document.getElementById('register-password').value.trim();

      try {
        // Verificar si el usuario ya existe
        const existingUser = await fetchUserByEmail(email);
        if (existingUser) {
          alert('El usuario ya existe con este correo electrónico.');
          return;
        }
        // Registrar nuevo usuario
        const result = await registerUser(name, email, password);
        if (result && result.id) {
          alert('Cuenta creada exitosamente. ¡Ahora puedes iniciar sesión!');
          registerForm.reset();
          // Redirigir a la página principal de acceso (login)
          window.location.href = 'Index.html';
        } else {
          alert('Ocurrió un error desconocido al crear la cuenta.');
        }
      } catch (error) {
        alert('Error al crear la cuenta: ' + error.message);
      }
    });
  });
})();
