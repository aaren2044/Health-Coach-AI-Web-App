import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

// English translations
const en = {
  translation: {
    // App-wide
    app_name: "HealthCoach AI",
    loading: "Loading...",
    
    // User related
    user: {
      default: "User",
      guest: "Guest"
    },
    profile: {
      alt: "Profile picture",
      view: "View Profile",
      edit: "Edit Profile"
    },
    
    // Dates and time
    date_format: "EEEE, MMMM d",
    time: {
      "2h_ago": "2h ago",
      "5m_ago": "5m ago",
      just_now: "Just now",
      today: "Today",
      yesterday: "Yesterday"
    },
    
    // Navigation
    nav: {
      overview: "Overview",
      dashboard: "Dashboard",
      medications: "Medications",
      exercise: "Exercise",
      diet: "Diet",
      monitoring: "Monitoring",
      guidance: "AI Guidance",
      settings: "Settings",
      activity: "Activity",
      documents: "Documents",
      profile: "Profile",
      logout: "Log Out",
      login: "Login",
      signup: "Sign Up"
    },
    
    // Dashboard
    dashboard: {
      welcome: "Welcome back, {{name}}!",
      health_summary: "Today's Health Summary",
      blood_oxygen: "Blood Oxygen Levels",
      weekly_activity: "Weekly Activity",
      recent_alerts: "Recent Alerts",
      daily_tasks: "Daily Tasks"
    },
    
    // Metrics
    metrics: {
      calories: "Calories",
      exercise: "Exercise",
      stand_hours: "Stand Hours",
      heart_rate: "Heart Rate",
      blood_pressure: "Blood Pressure",
      temperature: "Temperature",
      sleep: "Sleep",
      steps: "Steps",
      distance: "Distance"
    },
    
    // Units
    units: {
      minutes: "minutes",
      hours: "hours",
      bpm: "bpm",
      mmHg: "mmHg",
      celsius: "°C",
      fahrenheit: "°F",
      kcal: "kcal",
      km: "km",
      miles: "mi"
    },
    
    // Medications
    medications: {
      title: "Today's Medications",
      metformin: "Metformin",
      lisinopril: "Lisinopril",
      aspirin: "Aspirin",
      add: "Add Medication",
      time: "Time",
      taken: "Taken",
      not_taken: "Not Taken"
    },
    
    // Alerts
    alerts: {
      title: "Recent Alerts",
      blood_oxygen: "Blood oxygen slightly low",
      medication_reminder: "Time for afternoon medication",
      step_goal: "Daily step goal achieved!",
      warning: "Warning",
      reminder: "Reminder",
      success: "Success"
    },
    
    // Tasks
    tasks: {
      title: "Daily Tasks",
      morning_medication: "Take morning medication",
      walking: "30 minutes walking",
      check_oxygen: "Check blood oxygen",
      log_lunch: "Log lunch",
      completed: "Completed",
      pending: "Pending"
    },
    
    // Actions
    actions: {
      view_details: "View Details",
      add: "Add",
      edit: "Edit",
      delete: "Delete",
      save: "Save",
      cancel: "Cancel",
      confirm: "Confirm",
      upload: "Upload"
    },
    
    // Authentication
    auth: {
      login: "Login",
      signup: "Sign Up",
      email: "Email",
      password: "Password",
      confirm_password: "Confirm Password",
      forgot_password: "Forgot Password?",
      no_account: "Don't have an account?",
      have_account: "Already have an account?",
      name: "Name",
      create_account: "Create Account"
    },
    
    // Documents
    documents: {
      title: "Documents",
      upload: "Upload Document",
      no_documents: "No documents yet",
      type: "Type",
      date: "Date",
      size: "Size",
      pdf: "PDF",
      image: "Image"
    },
    
    // Common UI
    ui: {
      dark_mode: "Dark Mode",
      light_mode: "Light Mode",
      language: "Language",
      english: "English",
      spanish: "Spanish",
      french: "French",
      german: "German",
      chinese: "Chinese"
    },
    
    // Error messages
    errors: {
      required: "This field is required",
      invalid_email: "Invalid email address",
      password_length: "Password must be at least 8 characters",
      password_match: "Passwords must match",
      generic: "An error occurred",
      network: "Network error. Please try again."
    }
  }
};

// Spanish translations
const es = {
  translation: {
    app_name: "HealthCoach AI",
    loading: "Cargando...",
    
    user: {
      default: "Usuario",
      guest: "Invitado"
    },
    profile: {
      alt: "Foto de perfil",
      view: "Ver Perfil",
      edit: "Editar Perfil"
    },
    
    date_format: "EEEE, d 'de' MMMM",
    time: {
      "2h_ago": "Hace 2 horas",
      "5m_ago": "Hace 5 minutos",
      just_now: "Ahora mismo",
      today: "Hoy",
      yesterday: "Ayer"
    },
    
    nav: {
      overview: "Resumen",
      dashboard: "Panel",
      medications: "Medicamentos",
      exercise: "Ejercicio",
      diet: "Dieta",
      monitoring: "Monitoreo",
      guidance: "Guía IA",
      settings: "Configuración",
      activity: "Actividad",
      documents: "Documentos",
      profile: "Perfil",
      logout: "Cerrar Sesión",
      login: "Iniciar Sesión",
      signup: "Registrarse"
    },
    
    dashboard: {
      welcome: "¡Bienvenido de nuevo, {{name}}!",
      health_summary: "Resumen de Salud",
      blood_oxygen: "Niveles de Oxígeno",
      weekly_activity: "Actividad Semanal",
      recent_alerts: "Alertas Recientes",
      daily_tasks: "Tareas Diarias"
    },
    
    metrics: {
      calories: "Calorías",
      exercise: "Ejercicio",
      stand_hours: "Horas de Pie",
      heart_rate: "Ritmo Cardíaco",
      blood_pressure: "Presión Arterial",
      temperature: "Temperatura",
      sleep: "Sueño",
      steps: "Pasos",
      distance: "Distancia"
    },
    
    units: {
      minutes: "minutos",
      hours: "horas",
      bpm: "lpm",
      mmHg: "mmHg",
      celsius: "°C",
      fahrenheit: "°F",
      kcal: "kcal",
      km: "km",
      miles: "millas"
    },
    
    medications: {
      title: "Medicamentos de Hoy",
      metformin: "Metformina",
      lisinopril: "Lisinopril",
      aspirin: "Aspirina",
      add: "Añadir Medicamento",
      time: "Hora",
      taken: "Tomado",
      not_taken: "No Tomado"
    },
    
    alerts: {
      title: "Alertas Recientes",
      blood_oxygen: "Oxígeno en sangre bajo",
      medication_reminder: "Hora de la medicación",
      step_goal: "¡Meta de pasos alcanzada!",
      warning: "Advertencia",
      reminder: "Recordatorio",
      success: "Éxito"
    },
    
    tasks: {
      title: "Tareas Diarias",
      morning_medication: "Tomar medicamento matutino",
      walking: "Caminar 30 minutos",
      check_oxygen: "Revisar oxígeno",
      log_lunch: "Registrar almuerzo",
      completed: "Completado",
      pending: "Pendiente"
    },
    
    actions: {
      view_details: "Ver Detalles",
      add: "Añadir",
      edit: "Editar",
      delete: "Eliminar",
      save: "Guardar",
      cancel: "Cancelar",
      confirm: "Confirmar",
      upload: "Subir"
    },
    
    auth: {
      login: "Iniciar Sesión",
      signup: "Registrarse",
      email: "Correo Electrónico",
      password: "Contraseña",
      confirm_password: "Confirmar Contraseña",
      forgot_password: "¿Olvidaste tu contraseña?",
      no_account: "¿No tienes una cuenta?",
      have_account: "¿Ya tienes una cuenta?",
      name: "Nombre",
      create_account: "Crear Cuenta"
    },
    
    documents: {
      title: "Documentos",
      upload: "Subir Documento",
      no_documents: "Aún no hay documentos",
      type: "Tipo",
      date: "Fecha",
      size: "Tamaño",
      pdf: "PDF",
      image: "Imagen"
    },
    
    ui: {
      dark_mode: "Modo Oscuro",
      light_mode: "Modo Claro",
      language: "Idioma",
      english: "Inglés",
      spanish: "Español",
      french: "Francés",
      german: "Alemán",
      chinese: "Chino"
    },
    
    errors: {
      required: "Este campo es obligatorio",
      invalid_email: "Correo electrónico inválido",
      password_length: "La contraseña debe tener al menos 8 caracteres",
      password_match: "Las contraseñas deben coincidir",
      generic: "Ocurrió un error",
      network: "Error de red. Por favor intente nuevamente."
    }
  }
};

// French translations
const fr = {
  translation: {
    // Similar structure as Spanish but in French
    // (Would include all the same keys with French translations)
  }
};

// Initialize i18n
i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    fallbackLng: 'en',
    debug: process.env.NODE_ENV === 'development',
    detection: {
      order: ['localStorage', 'navigator'],
      caches: ['localStorage'],
      lookupLocalStorage: 'i18nextLng'
    },
    resources: {
      en,
      es,
      fr
      // Add more languages here
    },
    interpolation: {
      escapeValue: false,
    },
    react: {
      useSuspense: false,
    }
  });

export default i18n;