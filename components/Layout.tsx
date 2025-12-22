
import React, { useState, useRef, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { COUNTRIES } from '../constants';
import { useLanguage } from '../context/LanguageContext';
import { Language } from '../i18n/translations';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const { language, setLanguage, t } = useLanguage();
  const location = useLocation();
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [showScrollTop, setShowScrollTop] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const isHome = location.pathname === '/';

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsMenuOpen(false);
      }
    };
    const handleScroll = () => setShowScrollTop(window.scrollY > 400);
    document.addEventListener('mousedown', handleClickOutside);
    window.addEventListener('scroll', handleScroll);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const handleCountryClick = (id: string) => {
    setIsMenuOpen(false);
    if (!isHome) {
      navigate('/#' + id);
    } else {
      const element = document.getElementById(id);
      if (element) {
        const headerOffset = 80;
        const offsetPosition = element.getBoundingClientRect().top + window.pageYOffset - headerOffset;
        window.scrollTo({ top: offsetPosition, behavior: 'smooth' });
      }
    }
  };

  const languages: { code: Language; label: string }[] = [
    { code: 'en', label: 'English' },
    { code: 'hi', label: 'हिन्दी' },
    { code: 'fil', label: 'Filipino' },
    { code: 'zh', label: '中文' },
  ];

  return (
    <div className="min-h-screen flex flex-col w-full max-w-full overflow-x-hidden selection:bg-blue-100">
      <header className="bg-white/95 backdrop-blur-md border-b sticky top-0 z-50 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2 flex-shrink-0 active:scale-95 transition-transform">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center shadow-md">
              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
              </svg>
            </div>
            <span className="text-lg font-black tracking-tighter text-slate-900">{t.siteName}</span>
          </Link>
          
          <nav className="flex items-center gap-4 sm:gap-10">
            <div className="hidden md:flex items-center gap-6">
              <Link to="/" className="text-sm font-bold text-slate-600 hover:text-blue-600 transition-colors">{t.home}</Link>
              <div className="relative" ref={menuRef}>
                <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="flex items-center gap-1 text-sm font-bold text-slate-600 hover:text-blue-600 py-2">
                  {t.selectCountry}
                  <svg className={`w-4 h-4 transition-transform ${isMenuOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
                {isMenuOpen && (
                  <div className="absolute right-0 mt-3 w-64 bg-white rounded-2xl shadow-2xl border border-slate-100 overflow-hidden z-[60]">
                    <div className="max-h-96 overflow-y-auto py-2">
                      {COUNTRIES.map(country => (
                        <button key={country.id} onClick={() => handleCountryClick(country.id)} className="w-full text-left px-5 py-3 text-sm font-semibold text-slate-700 hover:bg-blue-50 flex items-center gap-3">
                          <span>{country.flag}</span>
                          <span>{t.countries[country.id as keyof typeof t.countries]?.name || country.name}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Improved Image-Style Language Switcher */}
            <div className="flex items-center gap-3 sm:gap-6">
              {languages.map((lang) => (
                <button
                  key={lang.code}
                  onClick={() => setLanguage(lang.code)}
                  className={`text-sm sm:text-base transition-all hover:text-blue-600 ${
                    language === lang.code 
                      ? 'text-slate-900 font-bold' 
                      : 'text-slate-500 font-medium'
                  }`}
                >
                  {lang.label}
                </button>
              ))}
            </div>
          </nav>
        </div>
      </header>

      <main className="flex-grow w-full">{children}</main>

      <footer className="bg-slate-950 text-slate-400 py-16 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            <div>
              <div className="flex items-center gap-2 mb-6">
                <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white font-bold">#</div>
                <span className="text-white font-black text-xl">{t.siteName}</span>
              </div>
              <p className="text-sm leading-relaxed">{t.footerDesc}</p>
            </div>
            <div>
              <h3 className="text-white font-bold mb-6 text-xs uppercase tracking-widest">{t.selectCountry}</h3>
              <div className="grid grid-cols-2 gap-2 text-xs">
                {COUNTRIES.slice(0, 8).map(c => (
                  <button key={c.id} onClick={() => handleCountryClick(c.id)} className="text-left hover:text-white transition-colors">
                    {t.countries[c.id as keyof typeof t.countries]?.name || c.name}
                  </button>
                ))}
              </div>
            </div>
            <div className="text-center md:text-right">
              <p className="text-[10px] font-bold tracking-widest uppercase">© {new Date().getFullYear()} {t.siteName} TOOLS</p>
            </div>
          </div>
        </div>
      </footer>

      <button onClick={() => window.scrollTo({top:0, behavior:'smooth'})} className={`fixed bottom-6 right-6 z-[70] p-4 bg-blue-600 text-white rounded-full shadow-2xl transition-all ${showScrollTop ? 'translate-y-0 opacity-100' : 'translate-y-20 opacity-0'}`}>
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 10l7-7m0 0l7 7m-7-7v18" /></svg>
      </button>
    </div>
  );
};

export default Layout;
