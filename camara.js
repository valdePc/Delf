// camera.js

/**
 * Función para manejar la interfaz de la cámara.
 * Crea un modal con la vista de cámara, permite cambiar de cámara,
 * aplicar filtros, simular flash, tomar foto o grabar video.
 */
function handleCameraInterface() {
  let currentFacing = 'user'; // 'user' para frontal, 'environment' para trasera
  let flashOn = false;
  let currentFilter = 'none';
  let mediaStream = null;
  let mediaRecorder = null;
  let recordedChunks = [];
  let recording = false;
  let pressTimer = null;

  // Crear modal para la cámara
  const modal = document.createElement('div');
  modal.style.position = 'fixed';
  modal.style.top = '0';
  modal.style.left = '0';
  modal.style.width = '100%';
  modal.style.height = '100%';
  modal.style.backgroundColor = 'rgba(0,0,0,0.9)';
  modal.style.display = 'flex';
  modal.style.flexDirection = 'column';
  modal.style.justifyContent = 'space-between';
  modal.style.zIndex = '200';

  // Crear elemento video para vista previa
  const video = document.createElement('video');
  video.autoplay = true;
  video.playsInline = true;
  video.style.maxWidth = '100%';
  video.style.maxHeight = '100%';
  video.style.objectFit = 'cover';

  // Barra superior con botones
  const topBar = document.createElement('div');
  topBar.style.width = '100%';
  topBar.style.display = 'flex';
  topBar.style.justifyContent = 'space-around';
  topBar.style.marginTop = '10px';

  // Botón Galería
  const galleryBtn = document.createElement('button');
  galleryBtn.innerHTML = '<i class="fa-solid fa-image"></i>';
  galleryBtn.style.fontSize = '1.5rem';
  galleryBtn.addEventListener('click', () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    input.click();
    input.onchange = e => {
      const file = e.target.files[0];
      if (file) {
        const url = URL.createObjectURL(file);
        // Llama a la función global definida en chat.js
        sendImageMessage(url, file.name);
        closeCamera();
      }
    };
  });
  topBar.appendChild(galleryBtn);

  // Botón para cambiar cámara (frontal/trasera)
  const switchBtn = document.createElement('button');
  switchBtn.innerHTML = '<i class="fa-solid fa-camera-rotate"></i>';
  switchBtn.style.fontSize = '1.5rem';
  switchBtn.addEventListener('click', () => {
    currentFacing = (currentFacing === 'user') ? 'environment' : 'user';
    if (mediaStream) {
      mediaStream.getTracks().forEach(track => track.stop());
    }
    startCamera();
  });
  topBar.appendChild(switchBtn);

  // Botón para aplicar filtros
  const filterBtn = document.createElement('button');
  filterBtn.innerHTML = '<i class="fa-solid fa-magic"></i>';
  filterBtn.style.fontSize = '1.5rem';
  filterBtn.addEventListener('click', () => {
    if (currentFilter === 'none') {
      currentFilter = 'grayscale(100%)';
    } else if (currentFilter === 'grayscale(100%)') {
      currentFilter = 'sepia(80%)';
    } else if (currentFilter === 'sepia(80%)') {
      currentFilter = 'contrast(150%)';
    } else {
      currentFilter = 'none';
    }
    video.style.filter = flashOn ? currentFilter + ' brightness(1.5)' : currentFilter;
  });
  topBar.appendChild(filterBtn);

  // Botón Flash (simulado)
  const flashBtn = document.createElement('button');
  flashBtn.innerHTML = '<i class="fa-solid fa-bolt"></i>';
  flashBtn.style.fontSize = '1.5rem';
  flashBtn.addEventListener('click', () => {
    flashOn = !flashOn;
    if (flashOn) {
      flashBtn.style.color = 'yellow';
      video.style.filter = currentFilter + ' brightness(1.5)';
    } else {
      flashBtn.style.color = '';
      video.style.filter = currentFilter;
    }
  });
  topBar.appendChild(flashBtn);

  modal.appendChild(topBar);

  // Contenedor central para la vista de video
  const videoContainer = document.createElement('div');
  videoContainer.style.flex = '1';
  videoContainer.style.display = 'flex';
  videoContainer.style.alignItems = 'center';
  videoContainer.style.justifyContent = 'center';
  videoContainer.style.width = '100%';
  videoContainer.appendChild(video);
  modal.appendChild(videoContainer);

  // Barra inferior: botón central y cancelar
  const bottomBar = document.createElement('div');
  bottomBar.style.width = '100%';
  bottomBar.style.display = 'flex';
  bottomBar.style.flexDirection = 'column';
  bottomBar.style.alignItems = 'center';
  bottomBar.style.marginBottom = '20px';

  // Botón central para capturar foto o iniciar grabación
  const captureBtn = document.createElement('button');
  captureBtn.style.width = '80px';
  captureBtn.style.height = '80px';
  captureBtn.style.borderRadius = '50%';
  captureBtn.style.border = 'none';
  captureBtn.style.background = '#fff';
  captureBtn.style.position = 'relative';
  captureBtn.style.outline = 'none';

  // Indicador de grabación (visual)
  const recordingIndicator = document.createElement('div');
  recordingIndicator.style.position = 'absolute';
  recordingIndicator.style.top = '0';
  recordingIndicator.style.left = '0';
  recordingIndicator.style.width = '100%';
  recordingIndicator.style.height = '100%';
  recordingIndicator.style.borderRadius = '50%';
  recordingIndicator.style.boxShadow = '0 0 0 4px red';
  recordingIndicator.style.display = 'none';
  captureBtn.appendChild(recordingIndicator);

  // Diferenciar entre click corto (foto) y long press (video)
  captureBtn.addEventListener('pointerdown', () => {
    pressTimer = setTimeout(() => {
      startRecording();
    }, 500);
  });
  captureBtn.addEventListener('pointerup', () => {
    clearTimeout(pressTimer);
    if (recording) {
      stopRecording();
    } else {
      takePhoto();
    }
  });
  bottomBar.appendChild(captureBtn);

  // Botón Cancelar para cerrar la cámara
  const cancelBtn = document.createElement('button');
  cancelBtn.textContent = "Cancelar";
  cancelBtn.style.marginTop = '10px';
  cancelBtn.style.padding = '10px 20px';
  cancelBtn.addEventListener('click', () => {
    closeCamera();
  });
  bottomBar.appendChild(cancelBtn);

  modal.appendChild(bottomBar);
  document.body.appendChild(modal);

  // Función para iniciar la cámara
  function startCamera() {
    const constraints = {
      video: { facingMode: currentFacing },
      audio: false
    };
    navigator.mediaDevices.getUserMedia(constraints)
      .then(stream => {
        mediaStream = stream;
        video.srcObject = stream;
      })
      .catch(error => {
        console.error("Error al acceder a la cámara:", error);
        alert("No se pudo acceder a la cámara.");
        closeCamera();
      });
  }

  // Función para tomar una foto
  function takePhoto() {
    const fixedWidth = 200;
    const aspectRatio = video.videoHeight / video.videoWidth;
    const fixedHeight = fixedWidth * aspectRatio;
    const canvas = document.createElement('canvas');
    canvas.width = fixedWidth;
    canvas.height = fixedHeight;
    const ctx = canvas.getContext('2d');
    ctx.filter = flashOn ? currentFilter + ' brightness(1.5)' : currentFilter;
    ctx.drawImage(video, 0, 0, fixedWidth, fixedHeight);
    const imageURL = canvas.toDataURL('image/png');
    // Se asume que sendImageMessage está definida globalmente en chat.js
    sendImageMessage(imageURL, "Foto tomada");
    closeCamera();
  }

  // Funciones para grabar video
  function startRecording() {
    if (!mediaStream) return;
    recordedChunks = [];
    try {
      mediaRecorder = new MediaRecorder(mediaStream, { mimeType: 'video/webm' });
    } catch (e) {
      console.error("MediaRecorder no es soportado:", e);
      return;
    }
    mediaRecorder.ondataavailable = (e) => {
      if (e.data.size > 0) {
        recordedChunks.push(e.data);
      }
    };
    mediaRecorder.onstop = () => {
      const blob = new Blob(recordedChunks, { type: 'video/webm' });
      const videoURL = URL.createObjectURL(blob);
      // Se asume que sendVideoMessage está definida globalmente en chat.js
      sendVideoMessage(videoURL, "Video grabado");
      closeCamera();
    };
    mediaRecorder.start();
    recording = true;
    recordingIndicator.style.display = 'block';
  }
  
  function stopRecording() {
    if (mediaRecorder && recording) {
      mediaRecorder.stop();
      recording = false;
      recordingIndicator.style.display = 'none';
    }
  }
  
  // Función para cerrar la cámara y eliminar el modal
  function closeCamera() {
    if (mediaStream) {
      mediaStream.getTracks().forEach(track => track.stop());
    }
    if (modal && modal.parentNode) {
      modal.parentNode.removeChild(modal);
    }
  }
  
  startCamera();
}

// Exportar la función para usarla en otros archivos (si usas módulos)
// Si no usas módulos, puedes simplemente dejarla global
// export { handleCameraInterface };
