// Variables globales para Airtable (ajusta según corresponda)
const AIRTABLE_API_KEY = 'patygcsH0vq1IXBGs.2ba9bfa1d43b68cd1b2c95d0d799e97038e80ab9388d6f87e071efbe6ec18bd4';
const AIRTABLE_BASE_ID = 'appx4eD3f7NINswZW';
const CONTACTS_TABLE = "Contacts"; // Nombre de la tabla para contactos

// Define al usuario actual (ajusta según tu lógica de autenticación)
const CURRENT_USER = {
  id: 'usuario123',
  name: 'Mi Nombre'
};

// Clave para almacenar la lista de contactos en localStorage
const STORAGE_KEY_CONTACTS = "contactsList";

document.addEventListener('DOMContentLoaded', () => {
  // -------------------------------
  // Variables y elementos del modal
  // -------------------------------
  const addContactBtn = document.getElementById('addContactBtn');
  const contactModal = document.getElementById('contactModal');
  const cancelContactBtn = document.getElementById('cancelContactBtn');
  const contactForm = document.getElementById('contactForm');

  // -------------------------------
  // Funciones para gestionar contactos en localStorage
  // -------------------------------
  function loadContactsFromStorage() {
    const contactsJSON = localStorage.getItem(STORAGE_KEY_CONTACTS);
    return contactsJSON ? JSON.parse(contactsJSON) : [];
  }

  function saveContactsToStorage(contacts) {
    localStorage.setItem(STORAGE_KEY_CONTACTS, JSON.stringify(contacts));
  }

  // Retorna true si ya existe un contacto con el mismo teléfono
  function isContactDuplicate(phone) {
    const contacts = loadContactsFromStorage();
    return contacts.some(contact => contact.phone === phone);
  }

  // Agrega un contacto a localStorage y retorna true si se agregó, o false si ya existía
  function addContactToStorage(newContact) {
    let contacts = loadContactsFromStorage();
    if (contacts.some(contact => contact.phone === newContact.phone)) {
      return false;
    }
    contacts.push(newContact);
    saveContactsToStorage(contacts);
    return true;
  }

  // -------------------------------
  // Función para crear el elemento HTML de un chat
  // con las opciones (eliminación solo estará disponible si no fue creado por el usuario actual)
  // -------------------------------
  function createChatItemElement(contact) {
    const chatItem = document.createElement('div');
    chatItem.classList.add('chat-item');
    // Se usa el teléfono como identificador (puedes cambiarlo según necesites)
    chatItem.dataset.contactId = contact.phone;

    chatItem.innerHTML = `
      <div class="chat-swipe-wrapper">
        <!-- Opciones que se muestran al deslizar (izquierda) -->
        <div class="chat-options chat-options-left">
          <button class="pin-btn"><i class="fa-solid fa-thumbtack"></i></button>
          <button class="more-btn"><i class="fa-solid fa-ellipsis-v"></i></button>
          <div class="more-menu" style="display:none;">
            <ul>
              <li class="view-info">Ver info</li>
              <li class="mute">Silenciar</li>
              <li class="archive">Archivar</li>
              <li class="delete">Eliminar</li>
              <li class="block">Bloquear</li>
            </ul>
          </div>
        </div>
        <!-- Contenido del chat -->
        <div class="chat-content" data-contact-id="${contact.phone}">
          <img class="chat-avatar" src="https://via.placeholder.com/50" alt="Avatar de ${contact.name}">
          <div class="chat-info">
            <div class="chat-header">
              <span class="chat-name">${contact.name}</span>
              <span class="chat-time">${new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
            </div>
            <div class="chat-snippet">Inicio de chat...</div>
          </div>
        </div>
        <!-- Opciones que se muestran al deslizar (derecha) -->
        <div class="chat-options chat-options-right">
          <button class="delete-btn"><i class="fa-solid fa-trash"></i></button>
        </div>
      </div>
    `;

    // Evento para abrir el menú de "más opciones"
    const moreBtn = chatItem.querySelector('.more-btn');
    const moreMenu = chatItem.querySelector('.more-menu');
    if (moreBtn && moreMenu) {
      moreBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        moreMenu.style.display = (moreMenu.style.display === 'none' || moreMenu.style.display === '') ? 'block' : 'none';
      });
    }

    // Evento para redirigir al chat al hacer clic en el contenido
    const chatContent = chatItem.querySelector('.chat-content');
    if (chatContent) {
      chatContent.addEventListener('click', () => {
        window.location.href = `chat.html?contact=${encodeURIComponent(contact.phone)}`;
      });
    }

    // Eventos para opciones
    // Si el contacto fue agregado por el usuario actual, se inhabilita la opción de eliminar.
    const deleteBtn = chatItem.querySelector('.delete-btn');
    if (deleteBtn) {
      if (contact.createdBy && contact.createdBy === CURRENT_USER.id) {
        deleteBtn.style.display = 'none';
      } else {
        deleteBtn.addEventListener('click', (e) => {
          e.stopPropagation();
          if (confirm(`¿Estás seguro de eliminar el chat con ${contact.name}?`)) {
            deleteChat(contact.phone);
            chatItem.remove();
          }
        });
      }
    }

    // Ejemplo para archivar (puedes agregar la lógica real)
    const archiveOption = chatItem.querySelector('.archive');
    if (archiveOption) {
      archiveOption.addEventListener('click', (e) => {
        e.stopPropagation();
        alert(`Chat con ${contact.name} archivado.`);
        // Implementa la lógica de archivar según tus necesidades
      });
    }

    return chatItem;
  }

  // -------------------------------
  // Función para agregar un nuevo chat a la UI (y guardarlo en localStorage)
  // -------------------------------
  function addNewChatItem(contact) {
    // Selecciona el contenedor de la lista de chats (asegúrate que exista en el DOM)
    const chatList = document.querySelector('.chat-list');
    if (!chatList) return;

    // Si el contacto ya existe, no se agrega nuevamente
    if (!addContactToStorage(contact)) {
      alert("El contacto ya existe.");
      return;
    }

    // Crea el elemento del chat y lo agrega a la lista
    const chatItem = createChatItemElement(contact);
    chatList.appendChild(chatItem);
  }

  // -------------------------------
  // Función para eliminar un chat de localStorage (solo para contactos que no fueron creados por el usuario actual)
  // -------------------------------
  function deleteChat(phone) {
    let contacts = loadContactsFromStorage();
    contacts = contacts.filter(contact => contact.phone !== phone);
    saveContactsToStorage(contacts);
  }

  // -------------------------------
  // Cargar los contactos guardados en localStorage y mostrarlos en la UI
  // -------------------------------
  function loadChatsToUI() {
    const chatList = document.querySelector('.chat-list');
    if (!chatList) return;
    chatList.innerHTML = ''; // Limpia el contenedor
    const contacts = loadContactsFromStorage();
    contacts.forEach(contact => {
      const chatItem = createChatItemElement(contact);
      chatList.appendChild(chatItem);
    });
  }

  // Cargar chats al iniciar la página
  loadChatsToUI();

  // -------------------------------
  // Eventos para mostrar y ocultar el modal de agregar contacto
  // -------------------------------
  addContactBtn.addEventListener('click', () => {
    contactModal.style.display = 'flex';
  });
  cancelContactBtn.addEventListener('click', () => {
    contactModal.style.display = 'none';
  });

  // -------------------------------
  // Manejo del formulario de agregar contacto
  // -------------------------------
  contactForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    // Obtener valores del formulario
    const phone = document.getElementById('contactPhone').value.trim();
    const name = document.getElementById('contactName').value.trim();

    // Validación: El teléfono es obligatorio
    if (!phone) {
      alert("El número de teléfono es obligatorio.");
      return;
    }

    // Si no se ingresa nombre, se usa el número como nombre
    const finalName = name || phone;

    // Verificar si el contacto ya existe (según el teléfono)
    if (isContactDuplicate(phone)) {
      alert("El contacto ya existe.");
      return;
    }

    // Crear el objeto para el nuevo contacto, indicando quién lo agregó
    const newContact = {
      fields: {
        phone: phone,
        name: finalName,
        createdBy: CURRENT_USER.id
      }
    };

    // Eliminar campos vacíos
    Object.keys(newContact.fields).forEach(key => {
      if (newContact.fields[key] === "") {
        delete newContact.fields[key];
      }
    });

    console.log("Payload enviado a Airtable:", JSON.stringify({ records: [newContact] }, null, 2));

    try {
      const url = `https://api.airtable.com/v0/${AIRTABLE_BASE_ID}/${encodeURIComponent(CONTACTS_TABLE)}`;
      const response = await fetch(url, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${AIRTABLE_API_KEY}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ records: [newContact] })
      });
      const data = await response.json();
      console.log("Contacto agregado:", data);
      alert("Contacto agregado correctamente.");

      // Agregar el contacto a localStorage y actualizar la UI
      addNewChatItem({ phone: phone, name: finalName, createdBy: CURRENT_USER.id });

      // Reinicia el formulario y cierra el modal
      contactModal.style.display = 'none';
      contactForm.reset();
    } catch (error) {
      console.error("Error al agregar contacto:", error);
      alert("Error al agregar contacto.");
    }
  });

  // -------------------------------
  // Aquí puedes incluir la lógica adicional (por ejemplo, swipe o envío de mensajes)
  // -------------------------------
});
