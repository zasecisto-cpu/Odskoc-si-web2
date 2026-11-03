import React, { useState } from 'react';
import { submitToGoogleSheet } from '../config/webhook';
import { MapPin, CheckCircle2, AlertCircle, Send } from 'lucide-react';

interface TipFormSectionProps {
  onOpenPrivacyModal: () => void;
}

export const TipFormSection: React.FC<TipFormSectionProps> = ({ onOpenPrivacyModal }) => {
  const [formMesto, setFormMesto] = useState<string>('');
  const [formNazev, setFormNazev] = useState<string>('');
  const [formAdresa, setFormAdresa] = useState<string>('');
  const [formPoznamka, setFormPoznamka] = useState<string>('');
  const [formEmail, setFormEmail] = useState<string>('');
  const [formConsent, setFormConsent] = useState<boolean>(false);
  const [formWebsite, setFormWebsite] = useState<string>('');

  const [submitting, setSubmitting] = useState<boolean>(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const clearForm = () => {
    setFormMesto('');
    setFormNazev('');
    setFormAdresa('');
    setFormPoznamka('');
    setFormEmail('');
    setFormConsent(false);
    setFormWebsite('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    // Spam honeypot
    if (formWebsite) {
      setSuccessMessage('Díky! Váš tip jsme zaznamenali.');
      clearForm();
      return;
    }

    if (!formConsent) {
      setErrorMessage('Pro odeslání tipu je nutné potvrdit souhlas se zpracováním údajů.');
      return;
    }

    setSubmitting(true);

    let finalLat: number | null = null;
    let finalLng: number | null = null;

    // Zkus adresu dohledat přes Nominatim
    try {
      const query = [formAdresa.trim(), formMesto.trim()].filter(Boolean).join(', ');
      if (query) {
        const geoRes = await fetch(
          `https://nominatim.openstreetmap.org/search?format=json&countrycodes=cz&q=${encodeURIComponent(query)}`,
          { headers: { 'Accept-Language': 'cs,en' } }
        );
        if (geoRes.ok) {
          const geoData = await geoRes.json();
          if (Array.isArray(geoData) && geoData.length > 0) {
            const parsedLat = parseFloat(geoData[0].lat);
            const parsedLon = parseFloat(geoData[0].lon);
            if (!isNaN(parsedLat) && !isNaN(parsedLon)) {
              finalLat = parsedLat;
              finalLng = parsedLon;
            }
          }
        }
      }

      if ((finalLat === null || finalLng === null) && formMesto.trim()) {
        const cityRes = await fetch(
          `https://nominatim.openstreetmap.org/search?format=json&countrycodes=cz&q=${encodeURIComponent(formMesto.trim())}`,
          { headers: { 'Accept-Language': 'cs,en' } }
        );
        if (cityRes.ok) {
          const cityData = await cityRes.json();
          if (Array.isArray(cityData) && cityData.length > 0) {
            const parsedLat = parseFloat(cityData[0].lat);
            const parsedLon = parseFloat(cityData[0].lon);
            if (!isNaN(parsedLat) && !isNaN(parsedLon)) {
              finalLat = parsedLat;
              finalLng = parsedLon;
            }
          }
        }
      }
    } catch (geoErr) {
      console.warn('Geokódování přes Nominatim selhalo:', geoErr);
    }

    try {
      const ok = await submitToGoogleSheet({
        formType: 'tip',
        mesto: formMesto.trim(),
        nazev: formNazev.trim(),
        adresa: formAdresa.trim(),
        lat: finalLat,
        lng: finalLng,
        poznamka: formPoznamka.trim(),
        email: formEmail.trim(),
        consent: formConsent,
        submittedAt: new Date().toISOString(),
      });

      if (ok) {
        setSuccessMessage('Díky! Váš tip jsme zaznamenali.');
        clearForm();
      } else {
        setErrorMessage('Omlouváme se, došlo k\u00A0chybě při odesílání. Zkuste to prosím znovu.');
      }
    } catch (err) {
      console.error('Chyba při odesílání tipu:', err);
      setErrorMessage('Omlouváme se, došlo k\u00A0chybě při odesílání. Zkuste to prosím znovu.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section
      id="chybi-wc"
      className="scroll-mt-16 w-full bg-slate-100 py-16 sm:py-24 px-5 sm:px-8 border-b-2 border-[#14294B] text-left"
    >
      <div id="navrhnout-misto" className="scroll-mt-24 max-w-4xl mx-auto space-y-8">
        <div className="space-y-3">
          <div className="inline-block bg-[#F5B700] text-[#14294B] text-[11px] font-['Archivo',sans-serif] font-[900] uppercase tracking-wider px-2.5 py-1 rounded-[4px]">
            Hlas občanů a&nbsp;návštěvníků
          </div>
          <h2 className="font-['Archivo',sans-serif] font-[900] text-[32px] sm:text-[44px] text-[#14294B] leading-[1.05] tracking-[-0.5px]">
            Kde vám chybí WC?
          </h2>
          <p className="font-['Archivo',sans-serif] text-[17px] sm:text-[19px] text-slate-700 leading-[1.5] max-w-[65ch]">
            Víte o&nbsp;kavárně, restauraci nebo ulici, kde by toaleta bodla? Dejte nám tip. Podněty zaneseme a&nbsp;předložíme vaší radnici.
          </p>
        </div>

        <div className="bg-white text-[#14294B] rounded-[8px] p-6 sm:p-9 border-2 border-[#14294B] shadow-sm space-y-6">
          <div className="border-b border-slate-200 pb-4">
            <div className="flex items-center gap-2">
              <MapPin className="text-[#F5B700] shrink-0" size={24} />
              <h3 className="font-['Archivo',sans-serif] font-[900] text-[22px] sm:text-[24px] text-[#14294B] leading-tight">
                Navrhnout místo pro toaletu
              </h3>
            </div>
            <p className="text-xs sm:text-sm text-slate-600 mt-1">
              Vyplnění trvá minutu. Místo zařadíme do plánu rozvoje sítě.
            </p>
          </div>

          {successMessage ? (
            <div className="p-6 bg-emerald-50 border-2 border-emerald-500 rounded-[6px] space-y-3 text-center animate-in fade-in duration-200">
              <CheckCircle2 size={36} className="text-emerald-600 mx-auto" />
              <div className="font-['Archivo',sans-serif] font-[900] text-[#14294B] text-[20px]">
                {successMessage}
              </div>
              <p className="text-sm text-slate-700 max-w-md mx-auto">
                Tip zařadíme do analýzy poptávky pro samosprávy a&nbsp;oslovíme podniky v&nbsp;okolí.
              </p>
              <button
                type="button"
                onClick={() => setSuccessMessage(null)}
                className="inline-block text-xs font-bold text-emerald-800 underline hover:no-underline pt-2 cursor-pointer"
              >
                Navrhnout další místo
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Spam honeypot */}
              <div className="hidden" aria-hidden="true" style={{ display: 'none' }}>
                <label htmlFor="hp-website-tip">Website</label>
                <input
                  type="text"
                  id="hp-website-tip"
                  name="website"
                  tabIndex={-1}
                  autoComplete="off"
                  value={formWebsite}
                  onChange={(e) => setFormWebsite(e.target.value)}
                />
              </div>

              {errorMessage && (
                <div className="p-3 bg-red-50 border border-red-300 rounded-[6px] flex items-center gap-2 text-xs text-red-800">
                  <AlertCircle size={18} className="shrink-0 text-red-600" />
                  <span>{errorMessage}</span>
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Město */}
                <div>
                  <label htmlFor="tip-mesto" className="block text-xs font-bold text-slate-800 uppercase mb-1">
                    Město / Obec *
                  </label>
                  <input
                    id="tip-mesto"
                    required
                    type="text"
                    value={formMesto}
                    onChange={(e) => setFormMesto(e.target.value)}
                    placeholder="např. Český Těšín, Ostrava, Tábor..."
                    className="w-full h-11 px-3 text-sm bg-white border border-slate-300 rounded-[4px] focus:border-[#14294B] focus:ring-1 focus:ring-[#14294B] focus:outline-none"
                  />
                </div>

                {/* Název podniku */}
                <div>
                  <label htmlFor="tip-nazev" className="block text-xs font-bold text-slate-800 uppercase mb-1">
                    Název podniku <span className="text-slate-500 font-normal lowercase">(nepovinné)</span>
                  </label>
                  <input
                    id="tip-nazev"
                    type="text"
                    value={formNazev}
                    onChange={(e) => setFormNazev(e.target.value)}
                    placeholder="např. Kavárna Na Rynku, Bistro..."
                    className="w-full h-11 px-3 text-sm bg-white border border-slate-300 rounded-[4px] focus:border-[#14294B] focus:ring-1 focus:ring-[#14294B] focus:outline-none"
                  />
                </div>
              </div>

              {/* Adresa */}
              <div>
                <label htmlFor="tip-adresa" className="block text-xs font-bold text-slate-800 uppercase mb-1">
                  Adresa nebo orientační místo *
                </label>
                <input
                  id="tip-adresa"
                  required
                  type="text"
                  value={formAdresa}
                  onChange={(e) => setFormAdresa(e.target.value)}
                  placeholder="např. Náměstí Svobody 12, u&#160;vlakového nádraží, hlavní park..."
                  className="w-full h-11 px-3 text-sm bg-white border border-slate-300 rounded-[4px] focus:border-[#14294B] focus:ring-1 focus:ring-[#14294B] focus:outline-none"
                />
              </div>

              {/* Poznámka */}
              <div>
                <label htmlFor="tip-poznamka" className="block text-xs font-bold text-slate-800 uppercase mb-1">
                  Poznámka <span className="text-slate-500 font-normal lowercase">(nepovinné)</span>
                </label>
                <input
                  id="tip-poznamka"
                  type="text"
                  value={formPoznamka}
                  onChange={(e) => setFormPoznamka(e.target.value)}
                  placeholder="např. v&#160;okolí není žádné veřejné WC, rušné dětské hřiště..."
                  className="w-full h-11 px-3 text-sm bg-white border border-slate-300 rounded-[4px] focus:border-[#14294B] focus:ring-1 focus:ring-[#14294B] focus:outline-none"
                />
              </div>

              {/* E-mail */}
              <div>
                <label htmlFor="tip-email" className="block text-xs font-bold text-slate-800 uppercase mb-1">
                  E-mail <span className="text-slate-500 font-normal lowercase">(nepovinný, dáme vám vědět po schválení)</span>
                </label>
                <input
                  id="tip-email"
                  type="email"
                  value={formEmail}
                  onChange={(e) => setFormEmail(e.target.value)}
                  placeholder="vas@email.cz"
                  className="w-full h-11 px-3 text-sm bg-white border border-slate-300 rounded-[4px] focus:border-[#14294B] focus:ring-1 focus:ring-[#14294B] focus:outline-none"
                />
              </div>

              {/* Souhlas GDPR */}
              <div className="p-3 bg-slate-50 border border-slate-200 rounded-[4px] text-xs">
                <label className="flex items-start gap-2.5 cursor-pointer">
                  <input
                    required
                    type="checkbox"
                    checked={formConsent}
                    onChange={(e) => setFormConsent(e.target.checked)}
                    className="mt-0.5 accent-[#14294B]"
                  />
                  <span className="text-slate-800 leading-snug">
                    Souhlasím se zpracováním údajů za účelem zanesení a&nbsp;prověření tipu na WC.{' '}
                    <button
                      type="button"
                      onClick={onOpenPrivacyModal}
                      className="text-[#14294B] underline font-bold inline"
                    >
                      Ochrana údajů
                    </button>
                  </span>
                </label>
              </div>

              {/* Odeslat */}
              <div className="pt-2">
                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full sm:w-auto h-12 px-8 bg-[#F5B700] hover:bg-[#E0A600] active:bg-[#C99500] text-[#14294B] font-['Archivo',sans-serif] font-[900] text-[16px] rounded-[4px] transition-colors cursor-pointer shadow-sm disabled:opacity-50 inline-flex items-center justify-center gap-2"
                >
                  <Send size={18} />
                  <span>{submitting ? 'Odesílám návrh...' : 'Odeslat tip na místo'}</span>
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </section>
  );
};
