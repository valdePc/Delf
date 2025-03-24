document.addEventListener("DOMContentLoaded", function() {
    const videos = document.querySelectorAll('.reel video');
  
    // Opciones para el IntersectionObserver: reproducir el video cuando al menos el 75% sea visible
    const options = {
      root: null,
      rootMargin: "0px",
      threshold: 0.75
    };
  
    const handleIntersection = (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          // Si el video está visible, lo reproduce
          entry.target.play();
        } else {
          // Si no es visible, lo pausa
          entry.target.pause();
        }
      });
    };
  
    const observer = new IntersectionObserver(handleIntersection, options);
  
    videos.forEach(video => {
      observer.observe(video);
    });
  });
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
  //fijar la pantalla
  document.addEventListener('touchmove', function(event) {
    if (event.scale !== 1) {
      event.preventDefault();
    }
  }, { passive: false });