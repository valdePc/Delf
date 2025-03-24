// Verificar si ya hay un usuario definido en localStorage
let CURRENT_USER = localStorage.getItem('CURRENT_USER');
if (!CURRENT_USER) {
  CURRENT_USER = prompt("Ingresa tu nombre:");
  localStorage.setItem('CURRENT_USER', CURRENT_USER);
}

const AIRTABLE_API_KEY = 'patygcsH0vq1IXBGs.2ba9bfa1d43b68cd1b2c95d0d799e97038e80ab9388d6f87e071efbe6ec18bd4';
const AIRTABLE_BASE_ID = 'appx4eD3f7NINswZW';  // Tu Base ID de Airtable
const TABLE_NAME = "Messages";

// Obtener el parámetro "contact" de la URL para determinar la conversación privada
const urlParams = new URLSearchParams(window.location.search);
const chatPartner = urlParams.get("contact");  // Si se define, es una conversación privada

document.addEventListener('DOMContentLoaded', () => {
  // ------------------------------
  // Funciones de integración con Airtable
  // ------------------------------
  async function fetchMessages() {
    try {
      // Se obtiene todos los mensajes; luego se filtrarán según la conversación
      const url = `https://api.airtable.com/v0/${AIRTABLE_BASE_ID}/${encodeURIComponent(TABLE_NAME)}?sort[0][field]=timestamp&sort[0][direction]=asc`;
      const response = await fetch(url, {
        headers: {
          Authorization: `Bearer ${AIRTABLE_API_KEY}`
        }
      });
      const data = await response.json();
      const records = data.records || [];
      renderMessages(records);
    } catch (error) {
      console.error("Error al obtener mensajes de Airtable:", error);
    }
  }

  function renderMessages(records) {
    const chatArea = document.getElementById("chatMessages");
    chatArea.innerHTML = ""; // Limpia los mensajes anteriores

    // Filtrar los mensajes según si es conversación privada o grupo
    const filteredRecords = records.filter(record => {
      const fields = record.fields;
      const sender = fields.sender || "";
      const receiver = fields.receiver || "";

      if (chatPartner) {
        // Conversación privada: mostrar solo mensajes entre CURRENT_USER y el chatPartner
        return (
          (sender === CURRENT_USER && receiver === chatPartner) ||
          (sender === chatPartner && receiver === CURRENT_USER)
        );
      } else {
        // Si no hay chatPartner, asumimos que es grupo (por ejemplo, "Todos")
        return receiver === "Todos";
      }
    });

    filteredRecords.forEach(record => {
      const fields = record.fields;
      const sender = fields.sender || "Desconocido";
      const message = fields.message || "";
      const timestamp = fields.timestamp || "";

      // Crea el elemento del mensaje
      const messageWrapper = document.createElement('div');
      messageWrapper.classList.add('chat-message');
      // Si el mensaje fue enviado por el usuario actual, se marca como "sent"
      if (sender === CURRENT_USER) {
        messageWrapper.classList.add('sent');
      } else {
        messageWrapper.classList.add('received');
      }

      const contentDiv = document.createElement('div');
      contentDiv.classList.add('message-content');
      // Contenido del mensaje
      const messagePara = document.createElement('p');
      messagePara.textContent = message;
      contentDiv.appendChild(messagePara);
      // Mostrar la hora del mensaje
      const timeSpan = document.createElement('span');
      timeSpan.classList.add('message-time');
      if (timestamp) {
        const dateObj = new Date(timestamp);
        const hours = dateObj.getHours();
        const minutes = dateObj.getMinutes().toString().padStart(2, '0');
        timeSpan.textContent = `${hours}:${minutes} `;
      }
      contentDiv.appendChild(timeSpan);

      messageWrapper.appendChild(contentDiv);
      chatArea.appendChild(messageWrapper);
    });
    // Desplaza el scroll hasta abajo
    chatArea.scrollTop = chatArea.scrollHeight;
  }

  async function sendMessageToAirtable(text, receiver) {
    try {
      const newRecord = {
        fields: {
          sender: CURRENT_USER,
          receiver: receiver,
          message: text,
          timestamp: new Date().toISOString()
        }
      };

      const url = `https://api.airtable.com/v0/${AIRTABLE_BASE_ID}/${encodeURIComponent(TABLE_NAME)}`;
      const response = await fetch(url, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${AIRTABLE_API_KEY}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ records: [newRecord] })
      });
      const data = await response.json();
      console.log("Mensaje enviado:", data);
      // Refrescar la lista de mensajes tras enviar
      fetchMessages();
    } catch (error) {
      console.error("Error al enviar mensaje a Airtable:", error);
    }
  }

  // Cargar mensajes al inicio y refrescarlos cada 5 segundos
  fetchMessages();
  setInterval(fetchMessages, 5000);

  // ------------------------------
  // Manejo del envío de mensajes desde el input
  // ------------------------------
  const messageInput = document.getElementById('messageInput');
  const sendBtn = document.getElementById('sendBtn');
  const micBtn = document.getElementById('micBtn');
  const plusBtn = document.getElementById('plusBtn');

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
        // Si hay chatPartner, se envía el mensaje a ese contacto; de lo contrario, a "Todos"
        const receiver = chatPartner ? chatPartner : "Todos";
        sendMessageToAirtable(text, receiver);
        // Limpia el input y reajusta la visibilidad de botones
        messageInput.value = '';
        sendBtn.style.display = 'none';
        if (micBtn) micBtn.style.display = 'inline-block';
        if (plusBtn) plusBtn.style.display = 'inline-block';
      }
    });
  }

  // ------------------------------
  // Navegación de la barra inferior
  // ------------------------------
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

  const groupsBtn = document.getElementById('groupsBtn');
  if (groupsBtn) {
    groupsBtn.addEventListener('click', () => {
      window.location.href = 'grupos.html';
    });
  }

  const phoneBtn = document.getElementById('phoneBtn');
  if (phoneBtn) {
    phoneBtn.addEventListener('click', () => {
      window.location.href = 'phone.html';
    });
  }

  const reelsBtn = document.getElementById('reelsBtn');
  if (reelsBtn) {
    reelsBtn.addEventListener('click', () => {
      window.location.href = 'reels.html';
    });
  }
});

// ------------------------------
// Funciones de envío local (opcional, para mostrar mensajes inmediatamente)
// ------------------------------
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

  const chatArea = document.querySelector('.chat-area');
  if (chatArea) {
    chatArea.appendChild(messageWrapper);
    chatArea.scrollTop = chatArea.scrollHeight;
  }
}

function sendImageMessage(url, fileName) {
  const messageWrapper = document.createElement('div');
  messageWrapper.classList.add('chat-message', 'sent');

  const contentDiv = document.createElement('div');
  contentDiv.classList.add('message-content');

  const img = document.createElement('img');
  img.src = url;
  img.style.maxWidth = "200px";
  img.style.borderRadius = "8px";
  contentDiv.appendChild(img);

  const fileInfo = document.createElement('p');
  fileInfo.textContent = fileName;
  fileInfo.style.fontSize = "0.8rem";
  contentDiv.appendChild(fileInfo);

  const timeSpan = document.createElement('span');
  timeSpan.classList.add('message-time');
  const now = new Date();
  const hours = now.getHours();
  const minutes = now.getMinutes().toString().padStart(2, '0');
  timeSpan.textContent = `${hours}:${minutes} `;

  const checkIcon = document.createElement('i');
  checkIcon.classList.add('fa-solid', 'fa-check-double');
  timeSpan.appendChild(checkIcon);
  contentDiv.appendChild(timeSpan);

  messageWrapper.appendChild(contentDiv);

  const chatArea = document.querySelector('.chat-area');
  if (chatArea) {
    chatArea.appendChild(messageWrapper);
    chatArea.scrollTop = chatArea.scrollHeight;
  }
}

function sendVideoMessage(videoURL, fileName) {
  const messageWrapper = document.createElement('div');
  messageWrapper.classList.add('chat-message', 'sent');

  const contentDiv = document.createElement('div');
  contentDiv.classList.add('message-content');

  const videoElem = document.createElement('video');
  videoElem.src = videoURL;
  videoElem.controls = true;
  contentDiv.appendChild(videoElem);

  const fileInfo = document.createElement('p');
  fileInfo.textContent = fileName;
  fileInfo.style.fontSize = "0.8rem";
  contentDiv.appendChild(fileInfo);

  const timeSpan = document.createElement('span');
  timeSpan.classList.add('message-time');
  const now = new Date();
  const hours = now.getHours();
  const minutes = now.getMinutes().toString().padStart(2, '0');
  timeSpan.textContent = `${hours}:${minutes} `;

  const checkIcon = document.createElement('i');
  checkIcon.classList.add('fa-solid', 'fa-check-double');
  timeSpan.appendChild(checkIcon);
  contentDiv.appendChild(timeSpan);

  messageWrapper.appendChild(contentDiv);

  const chatArea = document.querySelector('.chat-area');
  if (chatArea) {
    chatArea.appendChild(messageWrapper);
    chatArea.scrollTop = chatArea.scrollHeight;
  }
}

// ------------------------------
// Manejador para la cámara
// ------------------------------
document.addEventListener('touchmove', function(event) {
  if (event.scale !== 1) {
    event.preventDefault();
  }
}, { passive: false });

document.addEventListener("DOMContentLoaded", () => {
  const cameraBtn = document.getElementById("cameraBtn");

  // Crear un contenedor modal para mostrar la vista de la cámara
  const cameraContainer = document.createElement("div");
  cameraContainer.style.position = "fixed";
  cameraContainer.style.top = "0";
  cameraContainer.style.left = "0";
  cameraContainer.style.width = "100%";
  cameraContainer.style.height = "100%";
  cameraContainer.style.backgroundColor = "rgba(0, 0, 0, 0.8)";
  cameraContainer.style.display = "flex";
  cameraContainer.style.alignItems = "center";
  cameraContainer.style.justifyContent = "center";
  cameraContainer.style.zIndex = "1000";
  cameraContainer.style.visibility = "hidden"; // oculto por defecto
  cameraContainer.id = "cameraContainer";

  // Crear el elemento video para mostrar el stream
  const video = document.createElement("video");
  video.setAttribute("autoplay", "");
  video.setAttribute("playsinline", "");
  video.style.width = "640px";
  video.style.height = "480px";

  // Botón para cerrar la vista de la cámara
  const closeBtn = document.createElement("button");
  closeBtn.textContent = "Cerrar";
  closeBtn.style.position = "absolute";
  closeBtn.style.top = "20px";
  closeBtn.style.right = "20px";
  closeBtn.style.padding = "10px 20px";
  closeBtn.style.cursor = "pointer";

  // Agregar el video y el botón al contenedor
  cameraContainer.appendChild(video);
  cameraContainer.appendChild(closeBtn);
  document.body.appendChild(cameraContainer);

  let stream = null;

  // Al pulsar el botón de cámara, mostrar el modal y solicitar acceso a la cámara
  cameraBtn.addEventListener("click", () => {
    cameraContainer.style.visibility = "visible";
    if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
      navigator.mediaDevices.getUserMedia({ video: true })
        .then((mediaStream) => {
          stream = mediaStream;
          video.srcObject = mediaStream;
          video.play();
        })
        .catch((err) => {
          console.error("Error al acceder a la cámara:", err);
          alert("No se pudo acceder a la cámara. Asegúrate de haber dado los permisos correspondientes.");
          cameraContainer.style.visibility = "hidden";
        });
    } else {
      alert("Tu navegador no soporta getUserMedia.");
      cameraContainer.style.visibility = "hidden";
    }
  });

  // Al pulsar el botón de cerrar, detener el stream y ocultar el modal
  closeBtn.addEventListener("click", () => {
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
    }
    cameraContainer.style.visibility = "hidden";
  });
});
    //fijar la pantalla
    document.addEventListener('touchmove', function(event) {
      if (event.scale !== 1) {
        event.preventDefault();
      }
    }, { passive: false });