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

// Obtener un usuario por teléfono (E.164)
async function fetchUserByPhone(phone) {
  // Se espera que "phone" esté en formato E.164, ej: "+18098122663"
  const filterFormula = encodeURIComponent(`{phone} = '${phone}'`);
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
async function registerUser(name, phone, birthday, password) {
  const url = `https://api.airtable.com/v0/${AIRTABLE_BASE_ID}/${USERS_TABLE}`;
  const body = {
    fields: {
      name: name,
      phone: phone,    // Se guardará en E.164, ej: "+18098122663"
      birthday: birthday,
      password: password,  // Nota: en producción, utiliza un hash para la contraseña
      "Fecha de Registro": new Date().toISOString()
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

// Iniciar sesión: verifica usuario (por teléfono E.164) y contraseña
async function loginUser(phone, password) {
  try {
    const user = await fetchUserByPhone(phone);
    if (user) {
      if (user.fields.password === password) {
        return user; // Contraseña correcta
      } else {
        throw new Error('Contraseña incorrecta');
      }
    } else {
      throw new Error('Usuario no encontrado. Por favor, regístrate.');
    }
  } catch (error) {
    throw error;
  }
}

// Restablecer contraseña (simulación de envío de SMS o notificación)
// Se usa el teléfono (E.164) para buscar al usuario.
async function resetPassword(phone) {
  try {
    const user = await fetchUserByPhone(phone);
    if (user) {
      // Aquí iría la lógica real de envío de SMS o notificación
      return true;
    } else {
      throw new Error('Usuario no encontrado');
    }
  } catch (error) {
    throw error;
  }
}

// Función para bloquear caracteres no válidos en campos de teléfono
function blockInvalidChars(e) {
  const char = String.fromCharCode(e.which);
  // Permitir el signo "+" solo si es el primer carácter
  if (char === '+' && e.target.value.length > 0) {
    e.preventDefault();
    return;
  }
  // Solo se permiten dígitos y el signo "+"
  if (!/[0-9+]/.test(char)) {
    e.preventDefault();
  }
}

// ======================================
// Manejo de eventos en la interfaz
// ======================================
document.addEventListener('DOMContentLoaded', () => {
  // Elementos de login
  const loginForm = document.getElementById('login-form');
  const loginPhone = document.getElementById('login-phone');   // <input type="tel">
  // Inicializar intl-tel-input para loginPhone
const itiLogin = window.intlTelInput(loginPhone, {
  initialCountry: "auto",
  // Otras opciones de configuración
  utilsScript: "path/to/utils.js" // Asegúrate de colocar la ruta correcta
});
  const loginPassword = document.getElementById('login-password');

  // Elementos de registro
  const registerModal = document.getElementById('register-modal');
  const registerForm = document.getElementById('register-form');
  const registerName = document.getElementById('register-name');
  const registerPhone = document.getElementById('register-phone'); // <input type="tel">
  const registerBirthdate = document.getElementById('register-birthdate');
  const registerPassword = document.getElementById('register-password');
  const registerConfirmPassword = document.getElementById('register-confirm-password');

  const itiRegister = window.intlTelInput(registerPhone, {
    initialCountry: "auto",
    // Otras opciones según tus necesidades
    utilsScript: "path/to/utils.js" // Asegúrate de que la ruta al script sea correcta
  });

  // Elementos de restablecer contraseña
  const resetModal = document.getElementById('reset-modal');
  const resetForm = document.getElementById('reset-form');
  const resetPhone = document.getElementById('reset-phone'); // <input type="tel">

  // Botones para abrir modales
  const openRegisterBtn = document.getElementById('open-register');
  const closeRegisterBtn = document.getElementById('close-register');
  const openResetBtn = document.getElementById('open-reset');
  const closeResetBtn = document.getElementById('close-reset');

  // Agregar bloqueo en tiempo real a los campos de teléfono
  if (loginPhone) loginPhone.addEventListener('keypress', blockInvalidChars);
  if (registerPhone) registerPhone.addEventListener('keypress', blockInvalidChars);
  if (resetPhone) resetPhone.addEventListener('keypress', blockInvalidChars);

  // --------------------------------
  // Abrir/Cerrar modal de Registro
  // --------------------------------
  if (openRegisterBtn) {
    openRegisterBtn.addEventListener('click', (e) => {
      e.preventDefault();
      if (registerModal) {
        registerModal.style.display = 'block';
      }
    });
  }
  if (closeRegisterBtn) {
    closeRegisterBtn.addEventListener('click', () => {
      if (registerModal) {
        registerModal.style.display = 'none';
      }
    });
  }

  // --------------------------------
  // Abrir/Cerrar modal de Restablecer
  // --------------------------------
  if (openResetBtn) {
    openResetBtn.addEventListener('click', (e) => {
      e.preventDefault();
      if (resetModal) {
        resetModal.style.display = 'block';
      }
    });
  }
  if (closeResetBtn) {
    closeResetBtn.addEventListener('click', () => {
      if (resetModal) {
        resetModal.style.display = 'none';
      }
    });
  }

  // Cerrar modales al hacer clic fuera
  window.addEventListener('click', (event) => {
    if (event.target === registerModal) {
      registerModal.style.display = 'none';
    }
    if (event.target === resetModal) {
      resetModal.style.display = 'none';
    }
  });

  // Expresión regular para validar números en formato E.164
  const phoneRegex = /^\+[1-9]\d{1,14}$/;

  // --------------------------------
  // Envío del formulario de inicio de sesión
  // --------------------------------
  if (loginForm) {
    loginForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      // Usamos la instancia global "itiLogin" para obtener el número en formato E.164
      const phoneValue = itiLogin.getNumber(intlTelInputUtils.numberFormat.E164);
      // Validar el formato del teléfono
      if (!phoneRegex.test(phoneValue)) {
        alert("Por favor, ingrese un número de teléfono válido.");
        return;
      }
      const passwordValue = loginPassword.value.trim();

      try {
        const user = await loginUser(phoneValue, passwordValue);
        alert(`Bienvenido, ${user.fields.name}!`);
        window.location.href = 'perfil.html';
      } catch (error) {
        alert(error.message);
      }
    });
  }

  // --------------------------------
  // Envío del formulario de registro
  // --------------------------------
  if (registerForm) {
    registerForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const nameValue = registerName.value.trim();
      // Usamos la instancia global "itiRegister" para obtener el número en formato E.164
      const phoneValue = itiRegister.getNumber(intlTelInputUtils.numberFormat.E164);
      // Validar el formato del teléfono
      if (!phoneRegex.test(phoneValue)) {
        alert("Por favor, ingrese un número de teléfono válido en formato E.164.");
        return;
      }
      const birthdateValue = registerBirthdate.value.trim();
      const passwordValue = registerPassword.value.trim();
      const confirmValue = registerConfirmPassword.value.trim();

      // Validar que las contraseñas coincidan
      if (passwordValue !== confirmValue) {
        alert("Las contraseñas no coinciden.");
        return;
      }

      try {
        const newUser = await registerUser(nameValue, phoneValue, birthdateValue, passwordValue);
        if (newUser.error) {
          alert(`Error al registrar: ${newUser.error.type}`);
        } else {
          alert("Usuario registrado correctamente.");
          registerModal.style.display = 'none';
          registerForm.reset();
        }
      } catch (error) {
        alert("Error al registrar el usuario.");
        console.error(error);
      }
    });
  }

  // --------------------------------
  // Envío del formulario de restablecer
  // --------------------------------
  if (resetForm) {
    resetForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      // Usamos la instancia global "itiReset" para obtener el número en formato E.164
      const phoneValue = itiReset.getNumber(intlTelInputUtils.numberFormat.E164);
      // Validar el formato del teléfono
      if (!phoneRegex.test(phoneValue)) {
        alert("Por favor, ingrese un número de teléfono válido.");
        return;
      }
      try {
        const result = await resetPassword(phoneValue);
        if (result) {
          alert("Se han enviado las instrucciones a tu teléfono.");
          resetModal.style.display = 'none';
          resetForm.reset();
        }
      } catch (error) {
        alert(error.message);
      }
    });
  }
}); // Fin del DOMContentLoaded
    //fijar la pantalla
    document.addEventListener('touchmove', function(event) {
      if (event.scale !== 1) {
        event.preventDefault();
      }
    }, { passive: false });