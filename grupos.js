document.addEventListener("DOMContentLoaded", function() {
    const sendBtn = document.getElementById('sendGroupMsgBtn');
    const messageInput = document.getElementById('groupMessageInput');
    const chatMessages = document.querySelector('.chat-messages');
  
    // Función para enviar un mensaje
    const sendMessage = () => {
      const messageText = messageInput.value.trim();
      if (messageText !== '') {
        // Crear elemento de mensaje enviado
        const messageElement = document.createElement('div');
        messageElement.classList.add('chat-message', 'sent');
        messageElement.innerHTML = `
          <div class="message-content">
            <p>${messageText}</p>
            <span class="message-time">${new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</span>
          </div>
        `;
        chatMessages.appendChild(messageElement);
        messageInput.value = '';
        // Desplazar el scroll al final
        chatMessages.scrollTop = chatMessages.scrollHeight;
      }
    };
  
    sendBtn.addEventListener('click', sendMessage);
  
    // Enviar mensaje al presionar Enter
    messageInput.addEventListener('keypress', function(e) {
      if (e.key === 'Enter') {
        sendMessage();
      }
    });
  });
    //fijar la pantalla
    document.addEventListener('touchmove', function(event) {
      if (event.scale !== 1) {
        event.preventDefault();
      }
    }, { passive: false });