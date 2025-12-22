
import React, { useState, useEffect, useCallback } from 'react';
import { useParams, Link } from 'react-router-dom';
import { COUNTRIES } from '../constants';
import { generateRandomNumber } from '../services/generatorService';
import { useLanguage } from '../context/LanguageContext';

const GeneratorPage: React.FC = () => {
  const { t, language } = useLanguage();
  const { countrySlug } = useParams<{ countrySlug: string }>();
  const country = COUNTRIES.find(c => c.slug === countrySlug);
  const [numbers, setNumbers] = useState<string[]>([]);
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  const countryT = country ? t.countries[country.id as keyof typeof t.countries] : null;
  const countryName = countryT?.name || (country?.name || "");
  const countryDesc = countryT?.desc || (country?.description || "");

  const generateSet = useCallback(() => {
    if (!country) return;
    const newNumbers = Array.from({ length: 10 }, () => 
      `${country.code} ${generateRandomNumber(country.format, country.code)}`
    );
    setNumbers(newNumbers);
  }, [country]);

  useEffect(() => {
    if (country) {
      document.title = `${countryName} ${t.heroTitle} - ${t.siteName}`;
      generateSet();
    }
  }, [country, generateSet, t, countryName]);

  if (!country) return <div className="p-20 text-center font-bold text-2xl">404</div>;

  const copyToClipboard = (text: string, index: number) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  return (
    <div className="pb-20 w-full overflow-x-hidden">
      <div className="bg-blue-600 py-16 px-6 text-center text-white">
        <div className="max-w-4xl mx-auto">
          <Link to="/" className="inline-flex items-center text-blue-200 hover:text-white mb-8 font-bold transition-colors">
            ← {t.backToAll}
          </Link>
          <div className="text-6xl mb-6">{country.flag}</div>
          <h1 className="text-4xl md:text-6xl font-black mb-6 tracking-tight">{countryName} {t.heroTitle}</h1>
          <p className="text-lg md:text-xl text-blue-100 max-w-2xl mx-auto leading-relaxed">{countryDesc}</p>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4 -mt-12 relative z-10">
        <div className="bg-white rounded-[2.5rem] shadow-2xl p-8 md:p-12 border border-slate-100">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-6 mb-10">
            <h2 className="text-2xl font-black text-slate-800 tracking-tight">{t.randomNumbers}</h2>
            <button onClick={generateSet} className="w-full sm:w-auto px-8 py-4 bg-slate-950 text-white rounded-xl font-bold hover:bg-slate-800 transition-all flex items-center justify-center gap-2 shadow-lg active:scale-95">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" /></svg>
              {t.generateNew}
            </button>
          </div>

          <div className="space-y-4">
            {numbers.map((num, idx) => (
              <div key={idx} className="flex items-center justify-between p-5 bg-slate-50 rounded-2xl border border-slate-100 hover:shadow-lg transition-all group">
                <span className="text-xl md:text-2xl font-mono font-bold text-slate-700 tracking-tight">{num}</span>
                <button onClick={() => copyToClipboard(num, idx)} className={`px-6 py-2.5 rounded-xl text-xs font-black transition-all shadow-sm ${copiedIndex === idx ? 'bg-green-600 text-white' : 'bg-white text-blue-600 border border-slate-200 hover:bg-blue-600 hover:text-white'}`}>
                  {copiedIndex === idx ? t.copied : t.copy}
                </button>
              </div>
            ))}
          </div>

          <div className="mt-12 pt-10 border-t border-slate-50 grid grid-cols-2 gap-6">
             <div className="flex flex-col">
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">{t.callingCode}</span>
                <span className="text-xl font-black text-slate-900">{country.code}</span>
             </div>
             <div className="flex flex-col text-right">
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">{t.techSpecs}</span>
                <span className="text-xl font-black text-slate-900">{country.format}</span>
             </div>
          </div>
        </div>
      </div>

      <section className="max-w-4xl mx-auto px-6 mt-32 space-y-24">
        {/* Localized SEO Sections */}
        <div className="prose prose-slate max-w-none">
          <h2 className="text-3xl md:text-4xl font-black text-slate-900 mb-6 tracking-tight">{countryName} {t.withSms}</h2>
          <p className="text-slate-600 text-lg leading-relaxed">
            {language === 'zh' ? `寻找一个支持短信接收的${countryName}电话号码生成器？我们的工具提供数学上有效的号码字符串。` : 
             language === 'hi' ? `${countryName} के लिए एसएमएस के साथ एक फोन नंबर जनरेटर खोज रहे हैं? हमारा टूल गणितीय रूप से वैध नंबर प्रदान करता है।` :
             language === 'fil' ? `Naghahanap ng ${countryName} phone number generator na may SMS compatibility? Ang aming tool ay nagbibigay ng valid strings.` :
             `Looking for a ${countryName} phone number generator with SMS compatibility? Our tool provides valid numbering strings.`}
          </p>
        </div>

        <div className="prose prose-slate max-w-none">
          <h2 className="text-3xl md:text-4xl font-black text-slate-900 mb-6 tracking-tight">
            {language === 'zh' ? `${countryName}验证码电话号码生成器` : 
             language === 'hi' ? `वेरिफिकेशन के लिए ${countryName} फोन नंबर जनरेटर` :
             language === 'fil' ? `${countryName} generator para sa verification` :
             `${countryName} Phone Number Generator for Verification`}
          </h2>
          <p className="text-slate-600 text-lg leading-relaxed">
            {language === 'zh' ? `许多用户在开发测试阶段需要${countryName}号码来进行验证。我们的算法确保生成的号码符合地区规范。` : 
             language === 'hi' ? `उपयोगकर्ताओं को अक्सर परीक्षण के दौरान सत्यापन के लिए ${countryName} फोन नंबर की आवश्यकता होती है।` :
             language === 'fil' ? `Ang mga user ay madalas na nangangailangan ng numero para sa verification habang nagte-test.` :
             `Users often need a ${countryName} phone number generator for verification during testing.`}
          </p>
        </div>

        <div className="prose prose-slate max-w-none">
          <h2 className="text-3xl md:text-4xl font-black text-slate-900 mb-6 tracking-tight">{countryName} {t.cellMobile}</h2>
          <p className="text-slate-600 text-lg leading-relaxed">
             {language === 'zh' ? `${countryName}手机号码生成器遵循${country.format}标准，包含${country.code}区号。` : 
              language === 'hi' ? `${countryName} सेल फोन नंबर जनरेटर ${country.format} संरचना का उपयोग करता है।` :
              language === 'fil' ? `Ang ${countryName} cell phone number generator ay gumagamit ng ${country.format} na format.` :
              `The ${countryName} cell phone number generator utilizes the ${country.format} structure.`}
          </p>
        </div>

        <div className="prose prose-slate max-w-none pb-20">
          <h2 className="text-3xl md:text-4xl font-black text-slate-900 mb-10 tracking-tight">{t.howTo} {countryName}</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            <div className="space-y-4">
              <div className="w-14 h-14 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center font-black text-2xl">1</div>
              <h4 className="font-black text-slate-900 text-xl">{t.step1}</h4>
              <p className="text-sm text-slate-500 font-medium">{t.callingCode}: {country.code}</p>
            </div>
            <div className="space-y-4">
              <div className="w-14 h-14 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center font-black text-2xl">2</div>
              <h4 className="font-black text-slate-900 text-xl">{t.step2}</h4>
              <p className="text-sm text-slate-500 font-medium">{country.format}</p>
            </div>
            <div className="space-y-4">
              <div className="w-14 h-14 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center font-black text-2xl">3</div>
              <h4 className="font-black text-slate-900 text-xl">{t.step3}</h4>
              <p className="text-sm text-slate-500 font-medium">Ready for Testing</p>
            </div>
          </div>
          
          <div className="mt-20 p-8 md:p-12 border-2 border-dashed border-slate-200 rounded-[2.5rem]">
            <h4 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-6">{t.legal}</h4>
            <p className="text-xs md:text-sm text-slate-400 font-medium leading-relaxed italic">
              {language === 'zh' ? "虽然我们的生成器生成的号码模式非常逼真，但它们仅用于软件模拟。我们不提供任何真实的通信服务。" : 
               language === 'hi' ? "हालांकि हमारे जनरेटर यथार्थवादी पैटर्न तैयार करते हैं, वे केवल सॉफ्टवेयर सिमुलेशन के लिए हैं।" :
               language === 'fil' ? "Ang aming generator ay gumagawa ng realistic patterns pero ito ay para sa software simulation lamang." :
               "While our generator produces realistic patterns, these are for software simulation only. We do not provide real active services."}
            </p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default GeneratorPage;
