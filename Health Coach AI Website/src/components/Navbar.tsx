import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Sun, Moon, Activity, User, ChevronDown, Globe } from "lucide-react";
import { useTheme } from "../context/ThemeContext";
import { useTranslation } from 'react-i18next';

export default function Navbar({ isAuthenticated, onLogout }) {
  const { theme, toggleTheme } = useTheme();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [languageDropdownOpen, setLanguageDropdownOpen] = useState(false);
  const { t, i18n } = useTranslation();

  const handleDropdownToggle = () => {
    setDropdownOpen((prev) => !prev);
  };

  const handleLogout = () => {
    onLogout();
    setDropdownOpen(false);
  };

  const changeLanguage = async (lng: string) => {
    try {
      await i18n.changeLanguage(lng);
      setLanguageDropdownOpen(false);
    } catch (error) {
      console.error('Error changing language:', error);
    }
  };

  const languages = [
    { code: 'en', name: 'English', flag: '🇬🇧' },
    { code: 'es', name: 'Español', flag: '🇪🇸' },
    { code: 'fr', name: 'Français', flag: '🇫🇷' },
    { code: 'de', name: 'Deutsch', flag: '🇩🇪' },
    { code: 'zh', name: '中文', flag: '🇨🇳' },
  ];

  const currentLanguage = languages.find(lang => lang.code === i18n.language) || languages[0];

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = () => {
      setDropdownOpen(false);
      setLanguageDropdownOpen(false);
    };

    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, []);

  return (
    <nav className="relative w-full bg-white dark:bg-gray-900 shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link to="/dashboard" className="flex items-center space-x-2" onClick={() => {
            setDropdownOpen(false);
            setLanguageDropdownOpen(false);
          }}>
            <Activity className="w-8 h-8 text-primary-from" />
            <span className="text-xl font-bold bg-gradient-to-r from-primary-from to-primary-to bg-clip-text text-transparent">
              {t('app_name')}
            </span>
          </Link>

          <div className="flex items-center space-x-4">
            <div className="relative">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setLanguageDropdownOpen(!languageDropdownOpen);
                }}
                className="flex items-center space-x-1 px-3 py-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
              >
                <Globe className="w-5 h-5 text-gray-700 dark:text-gray-200" />
                <span className="text-sm font-medium">{currentLanguage.flag} {currentLanguage.code.toUpperCase()}</span>
                <ChevronDown className={`w-4 h-4 transition-transform ${languageDropdownOpen ? 'rotate-180' : ''}`} />
              </button>

              {languageDropdownOpen && (
                <div 
                  className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-lg shadow-lg z-50 py-1"
                  onClick={(e) => e.stopPropagation()}
                >
                  {languages.map((language) => (
                    <button
                      key={language.code}
                      onClick={() => changeLanguage(language.code)}
                      className={`w-full text-left px-4 py-2 flex items-center space-x-2 ${
                        i18n.language === language.code
                          ? 'bg-blue-100 dark:bg-blue-900/50 text-blue-600 dark:text-blue-400'
                          : 'hover:bg-gray-100 dark:hover:bg-gray-700'
                      }`}
                    >
                      <span className="text-lg">{language.flag}</span>
                      <span>{language.name}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>

            <button
              onClick={toggleTheme}
              className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            >
              {theme === "dark" ? (
                <Sun className="w-5 h-5 text-yellow-500" />
              ) : (
                <Moon className="w-5 h-5 text-gray-600" />
              )}
            </button>

            {isAuthenticated ? (
              <div className="relative">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDropdownToggle();
                  }}
                  className="flex items-center p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                >
                  <User className="w-5 h-5 text-gray-700 dark:text-gray-200" />
                </button>

                {dropdownOpen && (
                  <div 
                    className="absolute right-0 bg-white dark:bg-gray-800 shadow-lg rounded-lg z-50 mt-2 w-40"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <Link
                      to="/profile"
                      className="block px-4 py-2 text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
                      onClick={() => setDropdownOpen(false)}
                    >
                      {t('view_profile')}
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="block w-full text-left px-4 py-2 text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
                    >
                      {t('log_out')}
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <>
                <Link
                  to="/login"
                  className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-200 hover:text-primary-from dark:hover:text-primary-to transition-colors"
                >
                  {t('login')}
                </Link>
                <Link
                  to="/signup"
                  className="px-4 py-2 text-sm font-medium text-white bg-gradient-to-r from-primary-from to-primary-to rounded-lg hover:opacity-90 transition-opacity"
                >
                  {t('sign_up')}
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}