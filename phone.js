document.addEventListener('DOMContentLoaded', () => {
  
    // --- Configuración de la barra inferior ---
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
    
    const chatBtn = document.getElementById('chatBtn');
    if (chatBtn) {
      chatBtn.addEventListener('click', () => {
        window.location.href = 'perfil.html';
      });
    }
    
    const configBtn = document.getElementById('configBtn');
    if (configBtn) {
      configBtn.addEventListener('click', () => {
        window.location.href = 'config.html';
      });
    }
    
    // --- Funcionalidad para los botones de llamada en el historial ---
    // Se asume que cada elemento del historial tiene dos botones:
    // uno con la clase "audio-call" y otro con la clase "video-call".
    
    const audioCallButtons = document.querySelectorAll('.audio-call');
    audioCallButtons.forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        registerCall(btn, 'Audio');
        window.location.href = 'call.html'; // Redirige a la interfaz de llamada
      });
    });
    
    const videoCallButtons = document.querySelectorAll('.video-call');
    videoCallButtons.forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        registerCall(btn, 'Video');
        window.location.href = 'call.html'; // Redirige a la interfaz de llamada
      });
    });
    
    // Función para registrar la llamada en el historial (por ejemplo, usando localStorage)
    function registerCall(btn, callType) {
      // Se asume que cada elemento de llamada (.call-item) contiene detalles del contacto.
      const callItem = btn.closest('.call-item');
      if (!callItem) return;
      const nameElem = callItem.querySelector('.call-name');
      const callName = nameElem ? nameElem.textContent : "Contacto desconocido";
      const now = new Date();
      const timestamp = now.getTime();
      const callRecord = {
        name: callName,
        type: callType,
        timestamp: timestamp
      };
      // Recuperar el historial existente (si lo hay) desde localStorage
      let callLog = JSON.parse(localStorage.getItem('callLog')) || [];
      callLog.push(callRecord);
      localStorage.setItem('callLog', JSON.stringify(callLog));
      console.log("Registro de llamada:", callRecord);
    }
  });
  //fijar la pantalla
  document.addEventListener('touchmove', function(event) {
    if (event.scale !== 1) {
      event.preventDefault();
    }
  }, { passive: false });
  