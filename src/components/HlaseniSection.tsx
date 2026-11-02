import React, { useState } from 'react';
import { submitToGoogleSheet } from '../config/webhook';
import { CheckCircle2, Send } from 'lucide-react';

export const HlaseniSection: React.FC = () => {
  const [mesto, setMesto] = useState('');
  const [podnik, setPodnik] = useState('');
  const [coSeStalo, setCoSeStalo] = useState('');
  const [zprava, setZprava] = useState('');
  const [email, setEmail] = useState('');

  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    await submitToGoogleSheet({
      formType: 'hlaseni',
      mesto,
      podnik,
      coSeStalo,
      zprava,
      email,
      submittedAt: new Date().toISOString(),
    });
    setSubmitting(false);
    setSubmitted(true);
  };

  return (
    <section
      id="hlaseni"
      className="scroll-mt-16 bg-slate-50 py-16 sm:py-24 px-5 sm:px-8 border-t-2 border-[#14294B] text-left"
    >
      <div className="max-w-3xl mx-auto space-y-8">
        <div>
          <div className="inline-block bg-[#F5B700] text-[#14294B] text-[11px] font-['Archivo',sans-serif] font-[900] uppercase tracking-wider px-2.5 py-1 rounded-[4px] mb-3">
            Zpětná vazba z&nbsp;provozovny
          </div>
          <h2 className="font-['Archivo',sans-serif] font-[900] text-[32px] sm:text-[42px] text-[#14294B] leading-[1.05] tracking-[-0.5px]">
            Dejte nám vědět
          </h2>
          <p className="font-['Archivo',sans-serif] text-[17px] sm:text-[19px] text-slate-700 leading-[1.5] mt-2">
            Došel papír, něco nefunguje, nebo vás obsluha nepustila? Napište nám, vyřešíme to s&nbsp;podnikem. A&nbsp;pochvala potěší taky.
          </p>
        </div>

        <div className="bg-white text-[#14294B] rounded-[8px] p-6 sm:p-8 border-2 border-[#14294B] shadow-sm">
          {submitted ? (
            <div className="p-6 bg-emerald-50 border border-emerald-300 rounded-[6px] space-y-3 text-left">
              <div className="flex items-center gap-2.5 font-['Archivo',sans-serif] font-[900] text-emerald-800 text-lg">
                <CheckCircle2 size={24} className="text-emerald-600 shrink-0" />
                <span>Díky, ozveme se podniku.</span>
              </div>
              <p className="text-sm text-slate-700">
                Vaše hlášení jsme přijali a&nbsp;prověříme ho s&nbsp;provozovatelem místa, aby toaleta byla vždy v&nbsp;pořádku.
              </p>
              <div className="pt-2">
                <button
                  type="button"
                  onClick={() => {
                    setSubmitted(false);
                    setMesto('');
                    setPodnik('');
                    setCoSeStalo('');
                    setZprava('');
                    setEmail('');
                  }}
                  className="text-xs font-bold text-[#14294B] underline hover:no-underline cursor-pointer"
                >
                  Odeslat další hlášení
                </button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Město */}
                <div>
                  <label htmlFor="hlaseni-mesto" className="block text-xs font-bold text-slate-800 uppercase mb-1">
                    Město *
                  </label>
                  <select
                    id="hlaseni-mesto"
                    required
                    value={mesto}
                    onChange={(e) => setMesto(e.target.value)}
                    className="w-full h-11 px-3 text-sm bg-white border border-slate-300 rounded-[4px] focus:border-[#14294B] focus:outline-none"
                  >
                    <option value="" disabled>Vyberte město</option>
                    <option value="Český Těšín">Český Těšín</option>
                    <option value="Karviná">Karviná</option>
                    <option value="Třinec">Třinec</option>
                    <option value="Jiné">Jiné</option>
                  </select>
                </div>

                {/* Podnik */}
                <div>
                  <label htmlFor="hlaseni-podnik" className="block text-xs font-bold text-slate-800 uppercase mb-1">
                    Podnik *
                  </label>
                  <input
                    id="hlaseni-podnik"
                    required
                    type="text"
                    value={podnik}
                    onChange={(e) => setPodnik(e.target.value)}
                    placeholder="např. Kavárna U Věže"
                    className="w-full h-11 px-3 text-sm bg-white border border-slate-300 rounded-[4px] focus:border-[#14294B] focus:outline-none"
                  />
                </div>
              </div>

              {/* Co se stalo */}
              <div>
                <label htmlFor="hlaseni-co-se-stalo" className="block text-xs font-bold text-slate-800 uppercase mb-1">
                  Co se stalo *
                </label>
                <select
                  id="hlaseni-co-se-stalo"
                  required
                  value={coSeStalo}
                  onChange={(e) => setCoSeStalo(e.target.value)}
                  className="w-full h-11 px-3 text-sm bg-white border border-slate-300 rounded-[4px] focus:border-[#14294B] focus:outline-none"
                >
                  <option value="" disabled>Vyberte situaci</option>
                  <option value="Došel papír nebo mýdlo">Došel papír nebo mýdlo</option>
                  <option value="Něco nefunguje">Něco nefunguje</option>
                  <option value="Bylo nečisto">Bylo nečisto</option>
                  <option value="Nepustili mě">Nepustili mě</option>
                  <option value="Pochvala">Pochvala</option>
                  <option value="Jiné">Jiné</option>
                </select>
              </div>

              {/* Zpráva */}
              <div>
                <label htmlFor="hlaseni-zprava" className="block text-xs font-bold text-slate-800 uppercase mb-1">
                  Zpráva <span className="text-slate-500 font-normal lowercase">(nepovinné)</span>
                </label>
                <textarea
                  id="hlaseni-zprava"
                  rows={3}
                  value={zprava}
                  onChange={(e) => setZprava(e.target.value)}
                  placeholder="Doplňte podrobnosti (např. v kabince chybí klíč, neteče teplá voda...)"
                  className="w-full p-3 text-sm bg-white border border-slate-300 rounded-[4px] focus:border-[#14294B] focus:outline-none"
                />
              </div>

              {/* E-mail */}
              <div>
                <label htmlFor="hlaseni-email" className="block text-xs font-bold text-slate-800 uppercase mb-1">
                  E-mail pro odpověď <span className="text-slate-500 font-normal lowercase">(nepovinné)</span>
                </label>
                <input
                  id="hlaseni-email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="vas@email.cz"
                  className="w-full h-11 px-3 text-sm bg-white border border-slate-300 rounded-[4px] focus:border-[#14294B] focus:outline-none"
                />
              </div>

              {/* Tlačítko Odeslat */}
              <div className="pt-2">
                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full sm:w-auto h-12 px-8 bg-[#F5B700] hover:bg-[#E0A600] active:bg-[#C99500] text-[#14294B] font-['Archivo',sans-serif] font-[900] text-[16px] rounded-[4px] transition-colors cursor-pointer shadow-sm disabled:opacity-50 inline-flex items-center justify-center gap-2"
                >
                  <Send size={18} />
                  <span>{submitting ? 'Odesílám...' : 'Odeslat hlášení'}</span>
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </section>
  );
};
