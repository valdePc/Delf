document.addEventListener('DOMContentLoaded', () => {
  // --- Gestión de Idioma ---
  const languageSelect = document.getElementById('languageSelect');
  if (languageSelect) {
    // Cargar el idioma guardado en localStorage, por defecto "es"
    const storedLanguage = localStorage.getItem('language') || 'es';
    languageSelect.value = storedLanguage;
    actualizarIdioma(storedLanguage);

    languageSelect.addEventListener('change', () => {
      const selectedLanguage = languageSelect.value;
      console.log('Idioma seleccionado:', selectedLanguage);
      localStorage.setItem('language', selectedLanguage);
      actualizarIdioma(selectedLanguage);
    });
  }

  // --- Gestión del Tema Oscuro ---
  const darkThemeToggle = document.getElementById('darkTheme');
  if (darkThemeToggle) {
    // Cargar el estado del tema desde localStorage
    if (localStorage.getItem('theme') === 'dark') {
      document.body.classList.add('dark-theme');
      darkThemeToggle.checked = true;
    }
    darkThemeToggle.addEventListener('change', () => {
      if (darkThemeToggle.checked) {
        document.body.classList.add('dark-theme');
        localStorage.setItem('theme', 'dark');
      } else {
        document.body.classList.remove('dark-theme');
        localStorage.setItem('theme', 'light');
      }
    });
  }

  // --- Cerrar Sesión ---
  const logoutBtn = document.getElementById('logoutBtn');
  if (logoutBtn) {
    logoutBtn.addEventListener('click', () => {
      console.log('Cerrando sesión...');
      localStorage.removeItem('user');
      window.location.href = 'index.html';
    });
  }

  // --- Gestión del Perfil: Foto y Nombre ---
  const profilePhotoInput = document.getElementById('profilePhoto');
  const profilePhotoDisplay = document.getElementById('profilePhotoDisplay');
  const profileNameInput = document.getElementById('profileName');
  const saveProfileBtn = document.getElementById('saveProfileBtn');
  const displayName = document.getElementById('displayName');

  // Cargar datos previos guardados en localStorage, si existen
  const storedPhoto = localStorage.getItem('profilePhoto');
  const storedName = localStorage.getItem('userName');
  if (storedPhoto && profilePhotoDisplay) {
    profilePhotoDisplay.src = storedPhoto;
  }
  if (storedName) {
    // Mostrar el nombre guardado y dejar el input vacío
    displayName.textContent = storedName;
  }

  // Actualizar la foto de perfil
  if (profilePhotoInput) {
    profilePhotoInput.addEventListener('change', (e) => {
      const file = e.target.files[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = function(event) {
          profilePhotoDisplay.src = event.target.result;
          localStorage.setItem('profilePhoto', event.target.result);
          console.log('Foto de perfil actualizada');
        }
        reader.readAsDataURL(file);
      }
    });
  }

  // Guardar el nombre de usuario y limpiar el campo de entrada
  if (saveProfileBtn) {
    saveProfileBtn.addEventListener('click', () => {
      const nameValue = profileNameInput.value.trim();
      if (nameValue) {
        localStorage.setItem('userName', nameValue);
        displayName.textContent = nameValue;
        console.log('Nombre de usuario actualizado:', nameValue);
        alert("Cambios guardados en el perfil");
        // Limpiar el campo de ingreso del nombre
        profileNameInput.value = "";
      } else {
        alert("Por favor, ingresa un nombre válido.");
      }
    });
  }

  // --- Barra de Navegación Inferior ---
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
});

// Función para actualizar la interfaz según el idioma seleccionado
function actualizarIdioma(idioma) {
  // Diccionario de traducciones (excepto textos del chat)
  const traducciones = {
    es: {
      pageTitle: "Configuración",
      perfilTitle: "Perfil",
      cambiarFotoLabel: "Cambiar Foto de Perfil:",
      nombreLabel: "Nombre:",
      saveProfileBtn: "Guardar Cambios",
      cuentaTitle: "Cuenta",
      correoLabel: "Correo Electrónico:",
      passwordLabel: "Cambiar Contraseña:",
      notificacionesTitle: "Notificaciones",
      pushLabel: "Notificaciones Push",
      sonidosLabel: "Sonidos",
      privacidadTitle: "Privacidad",
      ultimaConexionLabel: "Mostrar Última Conexión",
      incognitoLabel: "Modo Incógnito",
      idiomaTemaTitle: "Idioma y Tema",
      idiomaLabel: "Idioma:",
      temaOscuroLabel: "Tema Oscuro",
      cuenta2Title: "Cuenta",
      logoutBtn: "Cerrar Sesión",
      reels: "Reels",
      telefono: "Teléfono",
      grupos: "Grupos",
      chat: "Chat",
      configuracion: "Configuración"
    },
    en: {
      pageTitle: "Settings",
      perfilTitle: "Profile",
      cambiarFotoLabel: "Change Profile Photo:",
      nombreLabel: "Name:",
      saveProfileBtn: "Save Changes",
      cuentaTitle: "Account",
      correoLabel: "Email:",
      passwordLabel: "Change Password:",
      notificacionesTitle: "Notifications",
      pushLabel: "Push Notifications",
      sonidosLabel: "Sounds",
      privacidadTitle: "Privacy",
      ultimaConexionLabel: "Show Last Connection",
      incognitoLabel: "Incognito Mode",
      idiomaTemaTitle: "Language & Theme",
      idiomaLabel: "Language:",
      temaOscuroLabel: "Dark Theme",
      cuenta2Title: "Account",
      logoutBtn: "Logout",
      reels: "Reels",
      telefono: "Phone",
      grupos: "Groups",
      chat: "Chat",
      configuracion: "Settings"
    },
    fr: {
      pageTitle: "Configuration",
      perfilTitle: "Profil",
      cambiarFotoLabel: "Changer la photo de profil :",
      nombreLabel: "Nom :",
      saveProfileBtn: "Enregistrer",
      cuentaTitle: "Compte",
      correoLabel: "Email :",
      passwordLabel: "Changer le mot de passe :",
      notificacionesTitle: "Notifications",
      pushLabel: "Notifications Push",
      sonidosLabel: "Sons",
      privacidadTitle: "Confidentialité",
      ultimaConexionLabel: "Afficher la dernière connexion",
      incognitoLabel: "Mode Incognito",
      idiomaTemaTitle: "Langue et Thème",
      idiomaLabel: "Langue :",
      temaOscuroLabel: "Thème Sombre",
      cuenta2Title: "Compte",
      logoutBtn: "Déconnexion",
      reels: "Reels",
      telefono: "Téléphone",
      grupos: "Groupes",
      chat: "Chat",
      configuracion: "Configuration"
    },
    de: {
      pageTitle: "Einstellungen",
      perfilTitle: "Profil",
      cambiarFotoLabel: "Profilfoto ändern:",
      nombreLabel: "Name:",
      saveProfileBtn: "Änderungen speichern",
      cuentaTitle: "Konto",
      correoLabel: "E-Mail:",
      passwordLabel: "Passwort ändern:",
      notificacionesTitle: "Benachrichtigungen",
      pushLabel: "Push-Benachrichtigungen",
      sonidosLabel: "Sounds",
      privacidadTitle: "Privatsphäre",
      ultimaConexionLabel: "Letzte Verbindung anzeigen",
      incognitoLabel: "Inkognito-Modus",
      idiomaTemaTitle: "Sprache & Thema",
      idiomaLabel: "Sprache:",
      temaOscuroLabel: "Dunkles Thema",
      cuenta2Title: "Konto",
      logoutBtn: "Abmelden",
      reels: "Reels",
      telefono: "Telefon",
      grupos: "Gruppen",
      chat: "Chat",
      configuracion: "Einstellungen"
    },
    it: {
      pageTitle: "Impostazioni",
      perfilTitle: "Profilo",
      cambiarFotoLabel: "Cambia foto profilo:",
      nombreLabel: "Nome:",
      saveProfileBtn: "Salva modifiche",
      cuentaTitle: "Account",
      correoLabel: "Email:",
      passwordLabel: "Cambia password:",
      notificacionesTitle: "Notifiche",
      pushLabel: "Notifiche Push",
      sonidosLabel: "Suoni",
      privacidadTitle: "Privacy",
      ultimaConexionLabel: "Mostra ultima connessione",
      incognitoLabel: "Modalità in incognito",
      idiomaTemaTitle: "Lingua e Tema",
      idiomaLabel: "Lingua:",
      temaOscuroLabel: "Tema Scuro",
      cuenta2Title: "Account",
      logoutBtn: "Disconnetti",
      reels: "Reels",
      telefono: "Telefono",
      grupos: "Gruppi",
      chat: "Chat",
      configuracion: "Impostazioni"
    },
    pt: {
      pageTitle: "Configurações",
      perfilTitle: "Perfil",
      cambiarFotoLabel: "Alterar foto de perfil:",
      nombreLabel: "Nome:",
      saveProfileBtn: "Salvar alterações",
      cuentaTitle: "Conta",
      correoLabel: "Email:",
      passwordLabel: "Alterar senha:",
      notificacionesTitle: "Notificações",
      pushLabel: "Notificações Push",
      sonidosLabel: "Sons",
      privacidadTitle: "Privacidade",
      ultimaConexionLabel: "Mostrar última conexão",
      incognitoLabel: "Modo incógnito",
      idiomaTemaTitle: "Idioma e Tema",
      idiomaLabel: "Idioma:",
      temaOscuroLabel: "Tema Escuro",
      cuenta2Title: "Conta",
      logoutBtn: "Sair",
      reels: "Reels",
      telefono: "Telefone",
      grupos: "Grupos",
      chat: "Chat",
      configuracion: "Configurações"
    },
    ru: {
      pageTitle: "Настройки",
      perfilTitle: "Профиль",
      cambiarFotoLabel: "Изменить фото профиля:",
      nombreLabel: "Имя:",
      saveProfileBtn: "Сохранить изменения",
      cuentaTitle: "Аккаунт",
      correoLabel: "Эл. почта:",
      passwordLabel: "Сменить пароль:",
      notificacionesTitle: "Уведомления",
      pushLabel: "Push-уведомления",
      sonidosLabel: "Звуки",
      privacidadTitle: "Конфиденциальность",
      ultimaConexionLabel: "Показывать последнее подключение",
      incognitoLabel: "Режим инкогнито",
      idiomaTemaTitle: "Язык и тема",
      idiomaLabel: "Язык:",
      temaOscuroLabel: "Темная тема",
      cuenta2Title: "Аккаунт",
      logoutBtn: "Выйти",
      reels: "Reels",
      telefono: "Телефон",
      grupos: "Группы",
      chat: "Чат",
      configuracion: "Настройки"
    },
    zh: {
      pageTitle: "设置",
      perfilTitle: "个人资料",
      cambiarFotoLabel: "更改个人资料照片:",
      nombreLabel: "姓名:",
      saveProfileBtn: "保存更改",
      cuentaTitle: "账户",
      correoLabel: "电子邮箱:",
      passwordLabel: "更改密码:",
      notificacionesTitle: "通知",
      pushLabel: "推送通知",
      sonidosLabel: "声音",
      privacidadTitle: "隐私",
      ultimaConexionLabel: "显示最后连接",
      incognitoLabel: "隐身模式",
      idiomaTemaTitle: "语言与主题",
      idiomaLabel: "语言:",
      temaOscuroLabel: "深色模式",
      cuenta2Title: "账户",
      logoutBtn: "退出登录",
      reels: "Reels",
      telefono: "电话",
      grupos: "群组",
      chat: "聊天",
      configuracion: "设置"
    },
    ja: {
      pageTitle: "設定",
      perfilTitle: "プロフィール",
      cambiarFotoLabel: "プロフィール写真を変更:",
      nombreLabel: "名前:",
      saveProfileBtn: "変更を保存",
      cuentaTitle: "アカウント",
      correoLabel: "メールアドレス:",
      passwordLabel: "パスワードを変更:",
      notificacionesTitle: "通知",
      pushLabel: "プッシュ通知",
      sonidosLabel: "サウンド",
      privacidadTitle: "プライバシー",
      ultimaConexionLabel: "最後の接続を表示",
      incognitoLabel: "シークレットモード",
      idiomaTemaTitle: "言語とテーマ",
      idiomaLabel: "言語:",
      temaOscuroLabel: "ダークテーマ",
      cuenta2Title: "アカウント",
      logoutBtn: "ログアウト",
      reels: "Reels",
      telefono: "電話",
      grupos: "グループ",
      chat: "チャット",
      configuracion: "設定"
    },
    ar: {
      pageTitle: "الإعدادات",
      perfilTitle: "الملف الشخصي",
      cambiarFotoLabel: "تغيير صورة الملف الشخصي:",
      nombreLabel: "الاسم:",
      saveProfileBtn: "حفظ التغييرات",
      cuentaTitle: "الحساب",
      correoLabel: "البريد الإلكتروني:",
      passwordLabel: "تغيير كلمة المرور:",
      notificacionesTitle: "الإشعارات",
      pushLabel: "إشعارات الدفع",
      sonidosLabel: "الأصوات",
      privacidadTitle: "الخصوصية",
      ultimaConexionLabel: "إظهار آخر اتصال",
      incognitoLabel: "وضع التصفح المتخفي",
      idiomaTemaTitle: "اللغة والموضوع",
      idiomaLabel: "اللغة:",
      temaOscuroLabel: "الوضع الداكن",
      cuenta2Title: "الحساب",
      logoutBtn: "تسجيل الخروج",
      reels: "Reels",
      telefono: "الهاتف",
      grupos: "المجموعات",
      chat: "دردشة",
      configuracion: "الإعدادات"
    },
    hi: {
      pageTitle: "सेटिंग्स",
      perfilTitle: "प्रोफ़ाइल",
      cambiarFotoLabel: "प्रोफ़ाइल फ़ोटो बदलें:",
      nombreLabel: "नाम:",
      saveProfileBtn: "परिवर्तनों को सहेजें",
      cuentaTitle: "खाता",
      correoLabel: "ईमेल:",
      passwordLabel: "पासवर्ड बदलें:",
      notificacionesTitle: "सूचनाएं",
      pushLabel: "पुश सूचनाएं",
      sonidosLabel: "ध्वनियाँ",
      privacidadTitle: "गोपनीयता",
      ultimaConexionLabel: "अंतिम कनेक्शन दिखाएं",
      incognitoLabel: "इनकॉग्निटो मोड",
      idiomaTemaTitle: "भाषा और थीम",
      idiomaLabel: "भाषा:",
      temaOscuroLabel: "डार्क थीम",
      cuenta2Title: "खाता",
      logoutBtn: "लॉग आउट",
      reels: "Reels",
      telefono: "फ़ोन",
      grupos: "समूह",
      chat: "चैट",
      configuracion: "सेटिंग्स"
    }
  };

  const textos = traducciones[idioma] || traducciones.es;

  // Actualizar cada elemento por ID
  document.getElementById('pageTitle').textContent           = textos.pageTitle;
  document.getElementById('perfilTitle').textContent         = textos.perfilTitle;
  document.getElementById('cambiarFotoLabel').textContent    = textos.cambiarFotoLabel;
  document.getElementById('nombreLabel').textContent         = textos.nombreLabel;
  document.getElementById('saveProfileBtn').textContent      = textos.saveProfileBtn;
  document.getElementById('cuentaTitle').textContent         = textos.cuentaTitle;
  document.getElementById('correoLabel').textContent         = textos.correoLabel;
  document.getElementById('passwordLabel').textContent       = textos.passwordLabel;
  document.getElementById('notificacionesTitle').textContent = textos.notificacionesTitle;
  document.getElementById('pushLabel').textContent           = textos.pushLabel;
  document.getElementById('sonidosLabel').textContent        = textos.sonidosLabel;
  document.getElementById('privacidadTitle').textContent     = textos.privacidadTitle;
  document.getElementById('ultimaConexionLabel').textContent = textos.ultimaConexionLabel;
  document.getElementById('incognitoLabel').textContent      = textos.incognitoLabel;
  document.getElementById('idiomaTemaTitle').textContent     = textos.idiomaTemaTitle;
  document.getElementById('idiomaLabel').textContent         = textos.idiomaLabel;
  document.getElementById('temaOscuroLabel').textContent     = textos.temaOscuroLabel;
  document.getElementById('cuenta2Title').textContent        = textos.cuenta2Title;
  document.getElementById('logoutBtn').textContent           = textos.logoutBtn;

  // Navegación inferior
  document.querySelector('#reelsBtn span').textContent       = textos.reels;
  document.querySelector('#phoneBtn span').textContent       = textos.telefono;
  document.querySelector('#groupsBtn span').textContent      = textos.grupos;
  document.querySelector('#chatBtn span').textContent        = textos.chat;
  document.querySelector('#configBtn span').textContent      = textos.configuracion;

  console.log(`Interfaz actualizada al idioma: ${idioma}`);
}
document.addEventListener('touchmove', function(event) {
  if (event.scale !== 1) {
    event.preventDefault();
  }
}, { passive: false });
