
import React, { createContext, useContext, useState, useEffect } from "react";

// Supported languages
type Language = "en" | "es" | "fr" | "de" | "zh" | "ja" | "ar";

// Language context type
type LanguageContextType = {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
};

// Create context with default values
const LanguageContext = createContext<LanguageContextType>({
  language: "en",
  setLanguage: () => {},
  t: (key) => key,
});

// Translations object
const translations: Record<Language, Record<string, string>> = {
  en: {
    // General
    "app.name": "ShopOS",
    "app.logout": "Log out",
    
    // Navigation
    "nav.dashboard": "Dashboard",
    "nav.pos": "Point of Sale",
    "nav.products": "Products",
    "nav.customers": "Customers",
    "nav.sales": "Sales",
    "nav.invoices": "Invoices",
    "nav.settings": "Settings",
    
    // Settings
    "settings.title": "Settings",
    "settings.description": "Manage your account settings and configure your store preferences.",
    "settings.tabs.store": "Store",
    "settings.tabs.notifications": "Notifications",
    "settings.tabs.integrations": "Integrations",
    "settings.tabs.appearance": "Appearance",
    
    "settings.store.info": "Store Information",
    "settings.store.info.description": "Update your store details and business information.",
    "settings.store.name": "Store Name",
    "settings.store.email": "Email Address",
    "settings.store.phone": "Phone Number",
    "settings.store.taxRate": "Tax Rate (%)",
    "settings.store.address": "Store Address",
    "settings.store.saveChanges": "Save Changes",
    
    "settings.receipt.title": "Receipt Customization",
    "settings.receipt.description": "Customize the appearance and content of customer receipts.",
    "settings.receipt.header": "Receipt Header",
    "settings.receipt.footer": "Receipt Footer",
    "settings.receipt.showLogo": "Show Store Logo",
    "settings.receipt.showContact": "Show Contact Information",
    "settings.receipt.includeBarcode": "Include Barcode",
    
    "settings.notifications.title": "Notification Preferences",
    "settings.notifications.description": "Customize when and how you receive notifications.",
    "settings.notifications.emailReceipts": "Email Receipts",
    "settings.notifications.emailReceipts.description": "Send email receipts to customers after purchase",
    "settings.notifications.lowStock": "Low Stock Alerts",
    "settings.notifications.lowStock.description": "Get notified when product inventory is running low",
    "settings.notifications.dailyReports": "Daily Sales Reports",
    "settings.notifications.dailyReports.description": "Receive daily summary of sales and transactions",
    "settings.notifications.customerActivity": "Customer Activity",
    "settings.notifications.customerActivity.description": "Get notified about new customers and registrations",
    "settings.notifications.savePreferences": "Save Preferences",
    
    "settings.integrations.title": "Integrations & Services",
    "settings.integrations.description": "Connect your POS with external services and platforms.",
    "settings.integrations.whatsapp": "WhatsApp Integration",
    "settings.integrations.whatsapp.description": "Connect with customers via WhatsApp for notifications and support",
    "settings.integrations.email": "Email Marketing",
    "settings.integrations.email.description": "Connect with email marketing platforms for campaigns",
    "settings.integrations.accounting": "Accounting Software",
    "settings.integrations.accounting.description": "Sync sales data with your accounting system",
    "settings.integrations.ecommerce": "E-commerce Platform",
    "settings.integrations.ecommerce.description": "Connect your online store with your POS system",
    "settings.integrations.saveIntegrations": "Save Integrations",
    
    "settings.api.title": "API Access",
    "settings.api.description": "Manage API keys and access to your POS data.",
    "settings.api.key": "API Key",
    "settings.api.copy": "Copy",
    "settings.api.note": "This key provides access to your store's API. Keep it secure.",
    "settings.api.regenerate": "Regenerate API Key",
    
    "settings.appearance.title": "Theme Settings",
    "settings.appearance.description": "Customize the look and feel of your POS interface.",
    "settings.appearance.theme": "Color Theme",
    "settings.appearance.darkMode": "Dark Mode",
    "settings.appearance.animations": "Enable Animations",
    "settings.appearance.compact": "Compact Mode",
    "settings.appearance.saveTheme": "Save Theme",
    
    "settings.localization.title": "Localization",
    "settings.localization.description": "Set your preferred language, currency and date formats.",
    "settings.localization.language": "Language",
    "settings.localization.currency": "Currency",
    "settings.localization.dateFormat": "Date Format",
    "settings.localization.timeFormat": "Time Format",
    "settings.localization.saveLocalization": "Save Localization",
    
    // Success messages
    "settings.success.saved": "Settings saved successfully",
    "settings.success.copied": "API key copied to clipboard",
    "settings.success.regenerated": "API key regenerated",
    "settings.success.themeChanged": "Theme changed to {theme}"
  },
  es: {
    // General
    "app.name": "ShopOS",
    "app.logout": "Cerrar sesión",
    
    // Navigation
    "nav.dashboard": "Panel",
    "nav.pos": "Punto de Venta",
    "nav.products": "Productos",
    "nav.customers": "Clientes",
    "nav.sales": "Ventas",
    "nav.invoices": "Facturas",
    "nav.settings": "Configuración",
    
    // Settings
    "settings.title": "Configuración",
    "settings.description": "Administre la configuración de su cuenta y configure las preferencias de su tienda.",
    "settings.tabs.store": "Tienda",
    "settings.tabs.notifications": "Notificaciones",
    "settings.tabs.integrations": "Integraciones",
    "settings.tabs.appearance": "Apariencia",
    
    "settings.store.info": "Información de la Tienda",
    "settings.store.info.description": "Actualice los detalles de su tienda e información comercial.",
    "settings.store.name": "Nombre de la Tienda",
    "settings.store.email": "Correo Electrónico",
    "settings.store.phone": "Número de Teléfono",
    "settings.store.taxRate": "Tasa de Impuesto (%)",
    "settings.store.address": "Dirección de la Tienda",
    "settings.store.saveChanges": "Guardar Cambios",
    
    // ... more Spanish translations (abbreviated for brevity)
    "settings.success.saved": "Configuración guardada exitosamente",
    "settings.success.copied": "Clave API copiada al portapapeles",
    "settings.success.regenerated": "Clave API regenerada",
    "settings.success.themeChanged": "Tema cambiado a {theme}"
  },
  fr: {
    // Basic French translations
    "app.name": "ShopOS",
    "app.logout": "Déconnexion",
    "nav.dashboard": "Tableau de Bord",
    // ... more French translations (abbreviated for brevity)
    "settings.success.saved": "Paramètres enregistrés avec succès"
  },
  de: {
    // Basic German translations
    "app.name": "ShopOS",
    "app.logout": "Abmelden",
    "nav.dashboard": "Dashboard",
    // ... more German translations (abbreviated for brevity)
    "settings.success.saved": "Einstellungen erfolgreich gespeichert"
  },
  zh: {
    // Basic Chinese translations
    "app.name": "ShopOS",
    "app.logout": "登出",
    "nav.dashboard": "仪表板",
    // ... more Chinese translations (abbreviated for brevity)
    "settings.success.saved": "设置保存成功"
  },
  ja: {
    // Basic Japanese translations
    "app.name": "ShopOS",
    "app.logout": "ログアウト",
    "nav.dashboard": "ダッシュボード",
    // ... more Japanese translations (abbreviated for brevity)
    "settings.success.saved": "設定が正常に保存されました"
  },
  ar: {
    // Basic Arabic translations
    "app.name": "ShopOS",
    "app.logout": "تسجيل خروج",
    "nav.dashboard": "لوحة القيادة",
    // ... more Arabic translations (abbreviated for brevity)
    "settings.success.saved": "تم حفظ الإعدادات بنجاح"
  }
};

// Provider component
export const LanguageProvider: React.FC<{children: React.ReactNode}> = ({ children }) => {
  const [language, setLanguage] = useState<Language>(() => {
    // Load language from localStorage or use browser language if available
    const savedLanguage = localStorage.getItem("language") as Language;
    if (savedLanguage && Object.keys(translations).includes(savedLanguage)) {
      return savedLanguage;
    }
    
    // Try to match browser language
    const browserLang = navigator.language.split('-')[0] as Language;
    if (Object.keys(translations).includes(browserLang)) {
      return browserLang;
    }
    
    return "en"; // Default to English
  });

  // Update language in localStorage when it changes
  useEffect(() => {
    localStorage.setItem("language", language);
    // For RTL languages like Arabic
    document.documentElement.dir = language === "ar" ? "rtl" : "ltr";
  }, [language]);

  // Translation function
  const t = (key: string, variables?: Record<string, string>): string => {
    let text = translations[language][key] || translations.en[key] || key;
    
    // Replace variables if present
    if (variables) {
      Object.entries(variables).forEach(([key, value]) => {
        text = text.replace(`{${key}}`, value);
      });
    }
    
    return text;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

// Custom hook to use the language context
export const useLanguage = () => useContext(LanguageContext);
