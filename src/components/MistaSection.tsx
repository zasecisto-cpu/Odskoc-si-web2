import React, { useState } from 'react';
import { MESTA_DATA, Mesto, Misto } from '../data/mista';
import { Compass, ExternalLink, Accessibility, Baby, CheckCircle2, Clock } from 'lucide-react';

interface MistaSectionProps {
  onScrollToSection: (sectionId: string) => void;
}

function calculateHaversineDistanceKm(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371; // Earth's radius in km
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

function formatDistance(distKm: number): string {
  if (distKm < 1) {
    return `${Math.round(distKm * 1000)}\u00A0m`;
  }
  return `${distKm.toFixed(1).replace('.', ',')}\u00A0km`;
}

function getBusinessesAddedText(count: number): string {
  if (count === 1) {
    return 'Už se přidal 1\u00A0podnik.';
  }
  if (count >= 2 && count <= 4) {
    return `Už se přidaly ${count}\u00A0podniky.`;
  }
  return `Už se přidalo ${count}\u00A0podniků.`;
}

export const MistaSection: React.FC<MistaSectionProps> = ({ onScrollToSection }) => {
  const [selectedCityName, setSelectedCityName] = useState<string>(MESTA_DATA[0].nazev);
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [geoNotice, setGeoNotice] = useState<string | null>(null);
  const [locating, setLocating] = useState<boolean>(false);

  const selectedCity: Mesto =
    MESTA_DATA.find((m) => m.nazev === selectedCityName) || MESTA_DATA[0];

  const handleFindNearest = () => {
    setGeoNotice(null);

    if (!('geolocation' in navigator)) {
      setGeoNotice('Geolokace není ve vašem prohlížeči podporována.');
      return;
    }

    setLocating(true);
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setLocating(false);
        const { latitude, longitude } = position.coords;
        setUserLocation({ lat: latitude, lng: longitude });

        // Najít všechna zveřejněná místa napříč všemi městy
        const publishedPlacesWithCity: { city: Mesto; misto: Misto; distKm: number }[] = [];
        MESTA_DATA.forEach((city) => {
          city.mista
            .filter((m) => m.zverejnit)
            .forEach((misto) => {
              const distKm = calculateHaversineDistanceKm(latitude, longitude, misto.lat, misto.lng);
              publishedPlacesWithCity.push({ city, misto, distKm });
            });
        });

        if (publishedPlacesWithCity.length === 0) {
          // Žádné zveřejněné místo v žádném městě
          setGeoNotice('Zatím tu žádné místo není, spouštíme na jaře 2027.');
          return;
        }

        // Seřadit podle vzdálenosti
        publishedPlacesWithCity.sort((a, b) => a.distKm - b.distKm);
        const nearest = publishedPlacesWithCity[0];
        setSelectedCityName(nearest.city.nazev);
      },
      (error) => {
        setLocating(false);
        // Pokud uživatel odmítne nebo selže, zůstane ruční výběr bez chybové hlášky rozbíjející stránku
        console.warn('Geolokace selhala nebo byla odmítnuta:', error.message);
      },
      { timeout: 8000, enableHighAccuracy: true }
    );
  };

  // Zveřejněná místa pro vybrané město se seřazením podle vzdálenosti (pokud je dostupná)
  const cityPublishedPlaces = selectedCity.mista
    .filter((m) => m.zverejnit)
    .map((misto) => {
      const distKm = userLocation
        ? calculateHaversineDistanceKm(userLocation.lat, userLocation.lng, misto.lat, misto.lng)
        : null;
      return { ...misto, distKm };
    })
    .sort((a, b) => {
      if (a.distKm !== null && b.distKm !== null) {
        return a.distKm - b.distKm;
      }
      return 0;
    });

  return (
    <section
      id="mista"
      className="scroll-mt-20 mt-12 sm:mt-16 pt-8 border-t border-[#1E3A67] text-left"
    >
      <div className="space-y-6">
        {/* Horní řádek: Nadpis a tlačítko „Najít nejbližší místo“ */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-xl sm:text-2xl font-['Archivo',sans-serif] font-[900] text-[#F5B700] uppercase tracking-wider">
              Kde si odskočit
            </h2>
            <p className="text-sm text-slate-300 mt-1">
              Vyberte město a&nbsp;zjistěte stav zapojených otevřených toalet.
            </p>
          </div>

          <button
            type="button"
            onClick={handleFindNearest}
            disabled={locating}
            className="self-start sm:self-auto inline-flex items-center gap-2 px-4 py-2.5 rounded-[10px] bg-[#1E3560] hover:bg-[#254277] active:bg-[#192E54] border-2 border-[#F5B700] text-[#F5B700] hover:text-white font-['Archivo',sans-serif] font-[800] text-sm transition-colors cursor-pointer shadow-sm disabled:opacity-50"
          >
            <Compass size={17} className={locating ? 'animate-spin' : ''} />
            <span>{locating ? 'Zjišťuji polohu...' : 'Najít nejbližší místo'}</span>
          </button>
        </div>

        {/* Hláška při geolokaci (např. když zatím nikde není místo) */}
        {geoNotice && (
          <div className="p-4 bg-[#1E3560] border-2 border-[#F5B700] rounded-[8px] text-[#F5B700] text-sm font-['Archivo',sans-serif] font-[700] flex items-center justify-between gap-3 animate-in fade-in duration-150">
            <span>{geoNotice}</span>
            <button
              type="button"
              onClick={() => setGeoNotice(null)}
              className="text-white hover:text-[#F5B700] text-xs underline cursor-pointer shrink-0"
            >
              Zavřít
            </button>
          </div>
        )}

        {/* Řada tlačítek s názvy měst (pilulky, zalamuje se na mobilu) */}
        <div className="flex flex-wrap gap-2.5 pt-1">
          {MESTA_DATA.map((city) => {
            const isActive = city.nazev === selectedCityName;
            return (
              <button
                key={city.nazev}
                type="button"
                onClick={() => {
                  setSelectedCityName(city.nazev);
                  setGeoNotice(null);
                }}
                className={`px-5 py-2 rounded-full font-['Archivo',sans-serif] text-sm transition-all cursor-pointer ${
                  isActive
                    ? 'bg-[#F5B700] text-[#14294B] font-[900] shadow-sm'
                    : 'bg-transparent text-white border-2 border-[#2B4B85] hover:border-[#F5B700] hover:text-[#F5B700] font-[700]'
                }`}
              >
                {city.nazev}
              </button>
            );
          })}
        </div>

        {/* Obsah pro vybrané město */}
        <div className="mt-4">
          {selectedCity.stav === 'pripravujeme' ? (
            <div className="bg-[#1E3560] border-2 border-[#2B4B85] p-6 sm:p-7 rounded-[10px] space-y-4">
              <div className="flex items-center gap-2.5">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-[6px] bg-[#F5B700] text-[#14294B] text-xs font-['Archivo',sans-serif] font-[900] uppercase tracking-wide">
                  <Clock size={14} />
                  <span>Připravujeme</span>
                </span>
                <span className="font-['Archivo',sans-serif] font-[900] text-white text-lg sm:text-xl">
                  {selectedCity.nazev}
                </span>
              </div>

              <div className="space-y-1.5 text-white/95">
                <p className="font-['Archivo',sans-serif] font-[800] text-[17px] sm:text-[18px]">
                  Spouštíme na jaře&nbsp;2027.
                </p>
                {selectedCity.pocetPripravenych > 0 && (
                  <p className="font-['Archivo',sans-serif] text-[15px] sm:text-[16px] text-slate-200">
                    {getBusinessesAddedText(selectedCity.pocetPripravenych)}
                  </p>
                )}
              </div>

              <div className="pt-2 border-t border-[#2B4B85]">
                <button
                  type="button"
                  onClick={() => onScrollToSection('pro-podniky')}
                  className="inline-flex items-center text-[#F5B700] hover:underline font-['Archivo',sans-serif] font-[700] text-[15px] sm:text-[16px] transition-colors cursor-pointer"
                >
                  Máte podnik v&nbsp;tomto městě? Přidejte se&nbsp;→
                </button>
              </div>
            </div>
          ) : (
            /* stav "v-provozu" */
            <div className="space-y-4">
              {cityPublishedPlaces.length === 0 ? (
                <div className="bg-[#1E3560] border-2 border-[#2B4B85] p-6 rounded-[10px] text-slate-200 text-sm">
                  Zatím v&nbsp;tomto městě není zveřejněna žádná toaleta.
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {cityPublishedPlaces.map((place, idx) => (
                    <div
                      key={idx}
                      className="bg-[#1E3560] border-2 border-[#2B4B85] hover:border-[#F5B700] p-5 rounded-[10px] flex flex-col justify-between space-y-4 transition-all"
                    >
                      <div className="space-y-2">
                        <div className="flex items-start justify-between gap-2">
                          <h3 className="font-['Archivo',sans-serif] font-[900] text-white text-[18px] leading-snug">
                            {place.nazev}
                          </h3>
                          {place.distKm !== null && (
                            <span className="shrink-0 bg-[#14294B] text-[#F5B700] text-xs font-[800] px-2 py-0.5 rounded-[4px] border border-[#F5B700]/40">
                              {formatDistance(place.distKm)}
                            </span>
                          )}
                        </div>

                        <p className="text-xs text-slate-300 leading-normal">
                          {place.adresa}
                        </p>

                        {place.proKolemjdouci && (
                          <p className="text-xs text-slate-200 pt-1">
                            <span className="text-[#F5B700] font-[700]">Pro kolemjdoucí:</span>{' '}
                            {place.proKolemjdouci}
                          </p>
                        )}

                        <div className="flex flex-wrap gap-2 pt-2">
                          {place.bezbarierove && (
                            <span className="inline-flex items-center gap-1 bg-[#14294B] text-slate-200 text-[11px] font-[700] px-2 py-0.5 rounded-[4px] border border-[#2B4B85]">
                              <Accessibility size={13} className="text-[#F5B700]" />
                              <span>Bezbariérové</span>
                            </span>
                          )}
                          {place.prebalovaciPult && (
                            <span className="inline-flex items-center gap-1 bg-[#14294B] text-slate-200 text-[11px] font-[700] px-2 py-0.5 rounded-[4px] border border-[#2B4B85]">
                              <Baby size={13} className="text-[#F5B700]" />
                              <span>Přebalovací pult</span>
                            </span>
                          )}
                        </div>
                      </div>

                      <div className="pt-2 border-t border-[#2B4B85]">
                        <a
                          href={`https://www.google.com/maps/dir/?api=1&destination=${place.lat},${place.lng}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="w-full inline-flex items-center justify-center gap-1.5 bg-[#F5B700] hover:bg-[#E0A600] active:bg-[#C99500] text-[#14294B] font-['Archivo',sans-serif] font-[800] text-sm py-2 px-3 rounded-[6px] transition-colors"
                        >
                          <ExternalLink size={15} />
                          <span>Navigovat</span>
                        </a>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </section>
  );
};
