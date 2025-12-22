
import React, { useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { COUNTRIES } from '../constants';
import { useLanguage } from '../context/LanguageContext';

const HomePage: React.FC = () => {
  const { t } = useLanguage();
  const location = useLocation();

  useEffect(() => {
    document.title = `${t.heroTitle} - ${t.siteName}`;
    if (location.hash) {
      const id = location.hash.slice(1);
      const element = document.getElementById(id);
      if (element) {
        setTimeout(() => {
          const headerOffset = 80;
          const offsetPosition = element.getBoundingClientRect().top + window.pageYOffset - headerOffset;
          window.scrollTo({ top: offsetPosition, behavior: 'smooth' });
        }, 150);
      }
    }
  }, [location, t]);

  const topCountryIds = ['cn', 'in', 'us', 'id', 'br', 'pk', 'ng', 'bd', 'ru', 'jp'];
  const topCountries = COUNTRIES.filter(c => topCountryIds.includes(c.id));

  const smoothScrollTo = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      const offset = 80;
      const elementPosition = el.getBoundingClientRect().top + window.pageYOffset - offset;
      window.scrollTo({ top: elementPosition, behavior: 'smooth' });
    }
  };

  return (
    <div className="pb-20 w-full overflow-x-hidden">
      <section className="bg-slate-900 text-white py-16 md:py-32 px-6 text-center relative">
        <div className="max-w-4xl mx-auto relative z-10">
          <h1 className="text-4xl md:text-7xl font-black mb-8 tracking-tighter leading-tight">{t.heroTitle}</h1>
          <p className="max-w-3xl mx-auto text-lg md:text-2xl text-slate-300 mb-12 leading-relaxed">{t.heroDesc}</p>
          <div className="flex flex-wrap justify-center gap-3">
            {topCountries.map(c => {
              const countryT = t.countries[c.id as keyof typeof t.countries];
              return (
                <button key={c.id} onClick={() => smoothScrollTo(c.id)} className="px-5 py-2.5 bg-white/10 hover:bg-blue-600 rounded-xl border border-white/10 text-xs font-bold transition-all flex items-center gap-2">
                  <span>{c.flag}</span>{countryT?.name || c.name}
                </button>
              );
            })}
          </div>
        </div>
      </section>

      <section className="max-w-5xl mx-auto px-5 mt-20 space-y-32">
        {COUNTRIES.map((c) => {
          const countryT = t.countries[c.id as keyof typeof t.countries];
          const countryName = countryT?.name || c.name;
          const countryDesc = countryT?.desc || c.description;

          return (
            <article key={c.id} id={c.id} className="flex flex-col items-center text-center group">
              <div className="max-w-3xl w-full mb-12">
                <div className="flex items-center justify-center gap-3 mb-6">
                   <span className="text-5xl">{c.flag}</span>
                   <div className="flex flex-col text-left">
                      <span className="text-blue-600 font-black text-[10px] bg-blue-50 px-2 py-0.5 rounded uppercase tracking-widest">{t.globalStandard}</span>
                      <span className="text-slate-400 font-bold text-xs">{t.callingCode}: {c.code}</span>
                   </div>
                </div>
                <h2 className="text-3xl md:text-5xl font-black text-slate-900 mb-6 tracking-tight">
                  {countryName} {t.heroTitle}
                </h2>
                <p className="text-slate-600 text-lg md:text-xl leading-relaxed mb-10">{countryDesc}</p>
                <Link to={`/${c.slug}`} className="inline-flex items-center px-12 py-5 bg-blue-600 text-white rounded-2xl font-black text-xl hover:bg-blue-700 shadow-xl shadow-blue-500/20 transition-all transform hover:-translate-y-1">
                  {countryName} {t.generator}
                  <svg className="ml-3 w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>
                </Link>
              </div>
              
              <div className="w-full max-w-4xl bg-slate-50 border border-slate-200 rounded-[3rem] p-8 md:p-14 shadow-xl transition-all group-hover:border-blue-200">
                <div className="flex justify-between items-center mb-10">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-blue-500 animate-pulse"></div>
                    <span className="text-xs font-black text-slate-400 uppercase tracking-widest">Engine: Active</span>
                  </div>
                  <span className="px-3 py-1 bg-green-100 text-green-700 text-[10px] rounded-full font-black uppercase tracking-wider">Verified Logic</span>
                </div>
                <div className="bg-white border-2 border-slate-100 rounded-3xl h-24 md:h-32 flex items-center px-10 shadow-inner">
                  <span className="text-2xl md:text-4xl font-mono text-slate-400 mr-4 md:mr-6">{c.code}</span>
                  <span className="text-2xl md:text-4xl font-mono font-black text-slate-800 tracking-tight">
                    {c.example.replace(c.code, '').trim()}
                  </span>
                </div>
                <div className="mt-8 flex justify-center text-[10px] font-bold text-slate-300 uppercase tracking-widest">
                  {t.techSpecs}: {c.format}
                </div>
              </div>
            </article>
          );
        })}
      </section>
    </div>
  );
};

export default HomePage;
