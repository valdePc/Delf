// ======================================
// Configuración de Airtable
// ======================================
const AIRTABLE_API_KEY = 'patygcsH0vq1IXBGs.2ba9bfa1d43b68cd1b2c95d0d799e97038e80ab9388d6f87e071efbe6ec18bd4';
const AIRTABLE_BASE_ID = 'appx4eD3f7NINswZW';  // Tu Base ID de Airtable
const USERS_TABLE = 'Users';                  // Nombre de la tabla donde se guardarán los usuarios

const airtableHeaders = {
  'Authorization': `Bearer ${AIRTABLE_API_KEY}`,
  'Content-Type': 'application/json'
};

// ======================================
// Funciones auxiliares
// ======================================

// Obtener un usuario por correo electrónico
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
      return data.records[0]; // Retorna el primer usuario encontrado
    }
    return null;
  } catch (error) {
    console.error('Error al obtener el usuario:', error);
    throw error;
  }
}

// Registrar un nuevo usuario en Airtable
async function registerUser(name, email, password) {
  const url = `https://api.airtable.com/v0/${AIRTABLE_BASE_ID}/${USERS_TABLE}`;
  const body = {
    fields: {
      name: name,
      email: email,
      password: password  // Nota: en producción, no guardes contraseñas en texto plano
    }
  };

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: airtableHeaders,
      body: JSON.stringify(body)
    });
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error al registrar el usuario:', error);
    throw error;
  }
}

// Iniciar sesión: verifica usuario y contraseña
async function loginUser(email, password) {
  try {
    const user = await fetchUserByEmail(email);
    if (user) {
      if (user.fields.password === password) {
        return user; // Contraseña correcta
      } else {
        throw new Error('Contraseña incorrecta');
      }
    } else {
      throw new Error('Usuario no encontrado');
    }
  } catch (error) {
    throw error;
  }
}

// Restablecer contraseña (simulación de envío de email)
async function resetPassword(email) {
  try {
    const user = await fetchUserByEmail(email);
    if (user) {
      // Aquí iría la lógica real de envío de email
      return true;
    } else {
      throw new Error('Usuario no encontrado');
    }
  } catch (error) {
    throw error;
  }
}

// ======================================
// Manejo de eventos en la interfaz
// ======================================
document.addEventListener('DOMContentLoaded', () => {
  // Formulario de login
  const loginForm = document.getElementById('login-form');

  // Botones para ir a otras páginas
  const openRegisterBtn = document.getElementById('open-register');
  const openResetBtn = document.getElementById('open-reset');

  // Botón "Crear Cuenta" -> redirige a crear-cuenta.html
  if (openRegisterBtn) {
    openRegisterBtn.addEventListener('click', (e) => {
      e.preventDefault();
      window.location.href = 'crear-cuenta.html'; 
    });
  }

  // Botón "Restablecer Contraseña" -> redirige a restablecer.html
  if (openResetBtn) {
    openResetBtn.addEventListener('click', (e) => {
      e.preventDefault();
      window.location.href = 'restablecer.html'; 
    });
  }

  // Envío del formulario de inicio de sesión
  if (loginForm) {
    loginForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const email = document.getElementById('login-email').value.trim();
      const password = document.getElementById('login-password').value.trim();

      try {
        const user = await loginUser(email, password);
        alert(`Bienvenido, ${user.fields.name}!`);
        // Redirigir a perfil.html
        window.location.href = 'perfil.html';
      } catch (error) {
        alert(error.message);
      }
    });
  }
}); // Fin del DOMContentLoaded
