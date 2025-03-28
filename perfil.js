// NOTA: Las siguientes variables globales se definen en config.js:
// AIRTABLE_API_KEY, AIRTABLE_BASE_ID, CONTACTS_TABLE

// Clave para almacenar los chats en localStorage
const STORAGE_KEY_CHATS = "chatsList";

document.addEventListener('DOMContentLoaded', () => {
  // ---------------------------------------
  // Variables y elementos del modal de contacto
  // ---------------------------------------
  const addContactBtn = document.getElementById('addContactBtn');
  const contactModal = document.getElementById('contactModal');
  const cancelContactBtn = document.getElementById('cancelContactBtn');
  const contactForm = document.getElementById('contactForm');

  // ---------------------------------------
  // Función para guardar la lista de chats en localStorage
  // ---------------------------------------
  function saveChatsToStorage(chats) {
    localStorage.setItem(STORAGE_KEY_CHATS, JSON.stringify(chats));
  }

  // ---------------------------------------
  // Función para obtener la lista de chats de localStorage
  // ---------------------------------------
  function loadChatsFromStorage() {
    const chatsJSON = localStorage.getItem(STORAGE_KEY_CHATS);
    return chatsJSON ? JSON.parse(chatsJSON) : [];
  }

  // ---------------------------------------
  // Función para agregar (o actualizar) un chat en localStorage
  // ---------------------------------------
  function addChatToStorage(newChat) {
    let chats = loadChatsFromStorage();
    // Evita duplicados: si ya existe un chat con el mismo número, no lo agrega
    if (chats.find(chat => chat.phone === newChat.phone)) {
      return false; // Indica que el chat ya existía
    }
    chats.push(newChat);
    saveChatsToStorage(chats);
    return true;
  }

  // ---------------------------------------
  // Función para crear el elemento HTML de un chat
  // (Con opciones de archivar, eliminar, silenciar, etc.)
  // ---------------------------------------
  function createChatItemElement(contact) {
    const chatItem = document.createElement('div');
    chatItem.classList.add('chat-item');
    // Usamos el teléfono como identificador (puedes cambiarlo)
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

    // Evento para eliminar el chat
    const deleteBtn = chatItem.querySelector('.delete-btn');
    if (deleteBtn) {
      deleteBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        if (confirm(`¿Estás seguro de eliminar el chat con ${contact.name}?`)) {
          deleteChat(contact.phone);
          chatItem.remove();
        }
      });
    }

    // Ejemplo: evento para la opción de archivar
    const archiveOption = chatItem.querySelector('.archive');
    if (archiveOption) {
      archiveOption.addEventListener('click', (e) => {
        e.stopPropagation();
        alert(`Chat con ${contact.name} archivado.`);
      });
    }

    return chatItem;
  }

  // ---------------------------------------
  // Función para agregar un nuevo chat a la UI (y actualizar localStorage)
  // ---------------------------------------
  function addNewChatItem(contact) {
    const chatList = document.querySelector('.chat-list');
    if (!chatList) return;

    if (!addChatToStorage(contact)) {
      alert("El contacto ya existe.");
      return;
    }

    const chatItem = createChatItemElement(contact);
    chatList.appendChild(chatItem);
  }

  // ---------------------------------------
  // Función para eliminar un chat de localStorage
  // ---------------------------------------
  function deleteChat(phone) {
    let chats = loadChatsFromStorage();
    chats = chats.filter(chat => chat.phone !== phone);
    saveChatsToStorage(chats);
  }

  // ---------------------------------------
  // Cargar chats guardados al iniciar la página
  // ---------------------------------------
  function loadChatsToUI() {
    const chatList = document.querySelector('.chat-list');
    if (!chatList) return;
    chatList.innerHTML = '';
    const chats = loadChatsFromStorage();
    chats.forEach(chat => {
      const chatItem = createChatItemElement(chat);
      chatList.appendChild(chatItem);
    });
  }

  loadChatsToUI();

  // ---------------------------------------
  // Eventos para mostrar y ocultar el modal de agregar contacto
  // ---------------------------------------
  addContactBtn.addEventListener('click', () => {
    contactModal.style.display = 'flex';
  });
  cancelContactBtn.addEventListener('click', () => {
    contactModal.style.display = 'none';
  });

  // ---------------------------------------
  // Manejo del formulario de agregar contacto
  // ---------------------------------------
  contactForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const phone = document.getElementById('contactPhone').value.trim();
    const name = document.getElementById('contactName').value.trim();

    if (!phone) {
      alert("El número de teléfono es obligatorio.");
      return;
    }

    const finalName = name || phone;

    const newContact = {
      fields: {
        phone: phone,
        name: finalName
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

      // Actualiza la UI
      addNewChatItem({ phone: phone, name: finalName });

      contactModal.style.display = 'none';
      contactForm.reset();
    } catch (error) {
      console.error("Error al agregar contacto:", error);
      alert("Error al agregar contacto.");
    }
  });

  // =================================
  // Navegación de la barra inferior
  // =================================
  // IMPORTANTE: Asegúrate de que los archivos (reels.html, phone.html, grupos.html, config.html, perfil.html) existan en la ruta indicada
  const reelsBtn = document.getElementById('reelsBtn');
  if (reelsBtn) {
    reelsBtn.addEventListener('click', () => {
      console.log("Reels button clicked");
      window.location.href = 'reels.html';
    });
  } else {
    console.error("No se encontró reelsBtn");
  }

  const phoneBtn = document.getElementById('phoneBtn');
  if (phoneBtn) {
    phoneBtn.addEventListener('click', () => {
      console.log("Phone button clicked");
      window.location.href = 'phone.html';
    });
  } else {
    console.error("No se encontró phoneBtn");
  }

  const groupsBtn = document.getElementById('groupsBtn');
  if (groupsBtn) {
    groupsBtn.addEventListener('click', () => {
      console.log("Groups button clicked");
      window.location.href = 'grupos.html';
    });
  } else {
    console.error("No se encontró groupsBtn");
  }

  const configBtn = document.getElementById('configBtn');
  if (configBtn) {
    configBtn.addEventListener('click', () => {
      console.log("Config button clicked");
      window.location.href = 'config.html';
    });
  } else {
    console.error("No se encontró configBtn");
  }

  const chatBtn = document.getElementById('chatBtn');
  if (chatBtn) {
    chatBtn.addEventListener('click', () => {
      console.log("Chat button clicked");
      window.location.href = 'perfil.html';
    });
  } else {
    console.error("No se encontró chatBtn");
  }
});
    //fijar la pantalla
    document.addEventListener('touchmove', function(event) {
      if (event.scale !== 1) {
        event.preventDefault();
      }
    }, { passive: false });