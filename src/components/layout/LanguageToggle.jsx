import React, { useState } from 'react';
import { Languages, Check } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';
import '../../styles/LanguageToggle.css';

const LanguageToggle = () => {
    const { language, changeLanguage } = useLanguage();
    const [isOpen, setIsOpen] = useState(false);

    const languages = [
        { code: 'en', label: 'English', native: 'EN' },
        { code: 'ta', label: 'Tamil', native: 'தமிழ்' },
        { code: 'ml', label: 'Malayalam', native: 'മലയാളം' },
        { code: 'hi', label: 'Hindi', native: 'हिंदी' }
    ];

    const currentLang = languages.find(lang => lang.code === language);

    const handleLanguageSelect = (langCode) => {
        changeLanguage(langCode);
        setIsOpen(false);
    };

    return (
        <div className="language-floating-toggle">
            {/* Expanded Language Options */}
            {isOpen && (
                <div className="language-options">
                    {languages.map((lang) => (
                        <button
                            key={lang.code}
                            className={`language-option ${language === lang.code ? 'active' : ''}`}
                            onClick={() => handleLanguageSelect(lang.code)}
                        >
                            <span className="language-native">{lang.native}</span>
                            <span className="language-label">{lang.label}</span>
                            {language === lang.code && <Check size={16} className="check-icon" />}
                        </button>
                    ))}
                </div>
            )}

            {/* Main Toggle Button */}
            <button
                className="language-toggle-button"
                onClick={() => setIsOpen(!isOpen)}
                title="Change Language"
                aria-label="Language Selector"
            >
                <div className="language-toggle-icon">
                    <Languages size={20} />
                </div>
                <span className="language-toggle-label">{currentLang?.native || 'EN'}</span>
            </button>
        </div>
    );
};

export default LanguageToggle;
