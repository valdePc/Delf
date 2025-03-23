document.addEventListener('DOMContentLoaded', () => {
  // ===============================
  // Funcionalidad de ampliar imagen de perfil y estados
  // ===============================

  // Función para abrir un modal con una imagen ampliada
  function openImageModal(imgSrc) {
    const modal = document.createElement('div');
    modal.style.position = 'fixed';
    modal.style.top = '0';
    modal.style.left = '0';
    modal.style.width = '100%';
    modal.style.height = '100%';
    modal.style.backgroundColor = 'rgba(0,0,0,0.8)';
    modal.style.display = 'flex';
    modal.style.alignItems = 'center';
    modal.style.justifyContent = 'center';
    modal.style.zIndex = '300';

    const img = document.createElement('img');
    img.src = imgSrc;
    img.style.maxWidth = '90%';
    img.style.maxHeight = '90%';
    img.style.borderRadius = '8px';
    modal.appendChild(img);

    // Al hacer clic en el modal, se cierra
    modal.addEventListener('click', () => {
      modal.remove();
    });

    document.body.appendChild(modal);
  }

  // Asignar evento a la foto de perfil (por ejemplo, el elemento con clase "header-avatar")
  const headerAvatar = document.querySelector('.header-avatar');
  if (headerAvatar) {
    headerAvatar.style.cursor = 'pointer';
    headerAvatar.addEventListener('click', () => {
      openImageModal(headerAvatar.src);
    });
  }

  // Asignar evento a los estados (si tus estados tienen la clase "status")
  const statusImages = document.querySelectorAll('.status');
  statusImages.forEach(statusImg => {
    statusImg.style.cursor = 'pointer';
    statusImg.addEventListener('click', () => {
      openImageModal(statusImg.src);
    });
  });

  // ===============================
  // Funcionalidad de swipe en cada chat
  // ===============================
  
  const chatItems = document.querySelectorAll('.chat-content');
  chatItems.forEach(item => {
    let startX = 0;
    let currentX = 0;
    let isDragging = false;
    const threshold = 50; // Umbral para detectar el swipe

    item.addEventListener('pointerdown', (e) => {
      startX = e.clientX;
      isDragging = true;
      item.style.transition = '';
    });

    item.addEventListener('pointermove', (e) => {
      if (!isDragging) return;
      currentX = e.clientX;
      const deltaX = currentX - startX;
      item.style.transform = `translateX(${deltaX}px)`;
    });

    item.addEventListener('pointerup', () => {
      if (!isDragging) return;
      isDragging = false;
      const deltaX = currentX - startX;
      // Si se desliza a la izquierda
      if (deltaX < -threshold) {
        showSwipeOptions(item, 'left');
      } else if (deltaX > threshold) {
        showSwipeOptions(item, 'right');
      }
      // Regresar a la posición original
      item.style.transition = 'transform 0.3s ease';
      item.style.transform = 'translateX(0)';
    });

    item.addEventListener('pointercancel', () => {
      isDragging = false;
      item.style.transition = 'transform 0.3s ease';
      item.style.transform = 'translateX(0)';
    });
  });

  // Función para mostrar opciones de swipe según la dirección
  function showSwipeOptions(item, direction) {
    // Crea un contenedor para las opciones
    const optionsContainer = document.createElement('div');
    optionsContainer.style.position = 'absolute';
    optionsContainer.style.top = '0';
    optionsContainer.style.bottom = '0';
    optionsContainer.style.width = '150px';
    optionsContainer.style.display = 'flex';
    optionsContainer.style.flexDirection = 'column';
    optionsContainer.style.justifyContent = 'center';
    optionsContainer.style.alignItems = 'center';
    optionsContainer.style.backgroundColor = 'rgba(0,0,0,0.7)';
    optionsContainer.style.color = '#fff';
    optionsContainer.style.fontSize = '0.9rem';
    
    if (direction === 'left') {
      // Opciones para swipe izquierdo: Eliminar y Archivar
      optionsContainer.style.right = '0';
      optionsContainer.innerHTML = '<button style="margin:5px;">Eliminar</button><button style="margin:5px;">Archivar</button>';
    } else if (direction === 'right') {
      // Opciones para swipe derecho: Silenciar y Bloquear
      optionsContainer.style.left = '0';
      optionsContainer.innerHTML = '<button style="margin:5px;">Silenciar</button><button style="margin:5px;">Bloquear</button>';
    }
    
    // Posicionar el contenedor relativo al item (asegúrate de que el item tenga position:relative)
    item.style.position = 'relative';
    item.appendChild(optionsContainer);
    
    // Ocultar las opciones después de 3 segundos
    setTimeout(() => {
      if (optionsContainer.parentNode === item) {
        optionsContainer.remove();
      }
    }, 3000);
  }

  // ================================
  // Navegación de la barra inferior
  // ================================
  
  const reelsBtn = document.getElementById('reelsBtn');
  if (reelsBtn) {
    reelsBtn.addEventListener('click', () => {
      window.location.href = 'reels.html';
    });
  }
  
  const phoneBtn = document.getElementById('phoneBtn');
  if (phoneBtn) {
    phoneBtn.addEventListener('click', () => {
      window.location.href = 'phone.html';
    });
  }
  
  const groupsBtn = document.getElementById('groupsBtn');
  if (groupsBtn) {
    groupsBtn.addEventListener('click', () => {
      window.location.href = 'grupos.html';
    });
  }
  
  const configBtn = document.getElementById('configBtn');
  if (configBtn) {
    configBtn.addEventListener('click', () => {
      window.location.href = 'config.html';
    });
  }
  
  const chatBtn = document.getElementById('chatBtn');
  if (chatBtn) {
    chatBtn.addEventListener('click', () => {
      window.location.href = 'perfil.html';
    });
  }
  
  // ================================
  // (Opcional) Si deseas enviar mensajes desde el chat
  // ================================
  
  // Este bloque de funciones para enviar mensajes (texto, imagen, video)
  // se deja aquí si es que lo necesitas en la interfaz de chat.
  // Si esta pantalla solo muestra la lista de contactos, podrías eliminarlo.
  
  // Ejemplo para enviar mensaje de texto:
  const messageInput = document.getElementById('messageInput');
  const sendBtn = document.getElementById('sendBtn');
  const micBtn = document.getElementById('micBtn');
  const plusBtn = document.getElementById('plusBtn');
  const chatArea = document.querySelector('.chat-area');
  
  if (messageInput) {
    messageInput.addEventListener('input', () => {
      if (messageInput.value.trim() !== '') {
        sendBtn.style.display = 'inline-block';
        if (micBtn) micBtn.style.display = 'none';
        if (plusBtn) plusBtn.style.display = 'none';
      } else {
        sendBtn.style.display = 'none';
        if (micBtn) micBtn.style.display = 'inline-block';
        if (plusBtn) plusBtn.style.display = 'inline-block';
      }
    });
  }
  
  if (sendBtn) {
    sendBtn.addEventListener('click', () => {
      const text = messageInput.value.trim();
      if (text !== '') {
        sendTextMessage(text);
        messageInput.value = '';
        sendBtn.style.display = 'none';
        if (micBtn) micBtn.style.display = 'inline-block';
        if (plusBtn) plusBtn.style.display = 'inline-block';
      }
    });
  }
  
  function sendTextMessage(text) {
    const messageWrapper = document.createElement('div');
    messageWrapper.classList.add('chat-message', 'sent');
    const contentDiv = document.createElement('div');
    contentDiv.classList.add('message-content');
    
    const messagePara = document.createElement('p');
    messagePara.textContent = text;
    contentDiv.appendChild(messagePara);
    
    const timeSpan = document.createElement('span');
    timeSpan.classList.add('message-time');
    const now = new Date();
    const hours = now.getHours();
    const minutes = now.getMinutes().toString().padStart(2, '0');
    timeSpan.textContent = `${hours}:${minutes} `;
    
    const checkIcon = document.createElement('i');
    checkIcon.classList.add('fa-solid', 'fa-check-double', 'read');
    timeSpan.appendChild(checkIcon);
    contentDiv.appendChild(timeSpan);
    
    messageWrapper.appendChild(contentDiv);
    if (chatArea) {
      chatArea.appendChild(messageWrapper);
      chatArea.scrollTop = chatArea.scrollHeight;
    }
  }
  
  // ================================
  // Navegación para lista de contactos
  // ================================
  
  const contactItems = document.querySelectorAll('.chat-content');
  contactItems.forEach(item => {
    item.addEventListener('click', () => {
      const contactId = item.getAttribute('data-contact-id');
      if (contactId) {
        window.location.href = `chat.html?contact=${encodeURIComponent(contactId)}`;
      } else {
        window.location.href = 'chat.html';
      }
    });
  });
});
document.addEventListener('touchmove', function(event) {
  if (event.scale !== 1) {
    event.preventDefault();
  }
}, { passive: false });
