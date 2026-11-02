import React, { useState } from 'react';
import { Menu, X, MapPin } from 'lucide-react';
import Logo from './Logo';
import { SHOW_MISTA } from '../config';

interface TopBarProps {
  onScrollToSection: (sectionId: string) => void;
}

export const TopBar: React.FC<TopBarProps> = ({ onScrollToSection }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLinkClick = (sectionId: string) => {
    setMobileMenuOpen(false);
    onScrollToSection(sectionId);
  };

  const handleLogoClick = () => {
    setMobileMenuOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <header className="sticky top-0 z-50 h-14 md:h-16 bg-[#14294B] text-white px-4 sm:px-6 flex items-center justify-between border-b-2 border-[#1E3A67] select-none">
      {/* Left: Logo */}
      <button
        type="button"
        onClick={handleLogoClick}
        className="flex items-center cursor-pointer text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-[#F5B700] rounded-[4px]"
        aria-label="Odskoč si – návrat na úvod"
      >
        <Logo variant="dark" height={40} className="logo-bounce-once" />
      </button>

      {/* Right on Desktop:
          Kde si odskočit, Pro kavárny a restaurace, Pro města a regiony, FAQ */}
      <nav aria-label="Hlavní navigace" className="hidden md:flex items-center gap-6 font-['Archivo',sans-serif] font-[900] text-xs uppercase tracking-wider text-white">
        {SHOW_MISTA && (
          <button
            type="button"
            onClick={() => handleLinkClick('mista')}
            className="hover:text-[#F5B700] transition-colors cursor-pointer focus:outline-none focus-visible:underline"
          >
            Kde si odskočit
          </button>
        )}

        <button
          type="button"
          onClick={() => handleLinkClick('pro-podniky')}
          className="hover:text-[#F5B700] transition-colors cursor-pointer focus:outline-none focus-visible:underline"
        >
          Pro kavárny a&nbsp;restaurace
        </button>

        <button
          type="button"
          onClick={() => handleLinkClick('pro-mesta')}
          className="hover:text-[#F5B700] transition-colors cursor-pointer focus:outline-none focus-visible:underline"
        >
          Pro města a&nbsp;regiony
        </button>

        <button
          type="button"
          onClick={() => handleLinkClick('faq')}
          className="hover:text-[#F5B700] transition-colors cursor-pointer focus:outline-none focus-visible:underline"
        >
          FAQ
        </button>

        <button
          type="button"
          onClick={() => handleLinkClick('pro-podniky')}
          className="inline-flex items-center justify-center text-center bg-[#F5B700] hover:bg-[#E0A600] active:bg-[#C99500] text-[#14294B] font-['Archivo',sans-serif] font-[800] text-[15px] normal-case tracking-normal leading-tight px-[18px] py-[10px] rounded-[10px] transition-colors cursor-pointer"
        >
          Přidat podnik&nbsp;→
        </button>
      </nav>

      {/* Right on Mobile: Hamburger button */}
      <div className="md:hidden">
        <button
          type="button"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="p-1.5 rounded-[4px] text-white hover:text-[#F5B700] transition-colors cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-[#F5B700]"
          aria-label={mobileMenuOpen ? 'Zavřít menu' : 'Otevřít menu'}
        >
          {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="md:hidden absolute top-14 left-0 right-0 bg-[#14294B] border-b-2 border-[#1E3A67] p-5 space-y-3 font-['Archivo',sans-serif] shadow-2xl">
          <nav aria-label="Mobilní navigace" className="flex flex-col space-y-3 text-sm font-[900] uppercase tracking-wider text-left">
            {SHOW_MISTA && (
              <button
                type="button"
                onClick={() => handleLinkClick('mista')}
                className="text-left text-white hover:text-[#F5B700] py-1 cursor-pointer"
              >
                Kde si odskočit
              </button>
            )}

            <button
              type="button"
              onClick={() => handleLinkClick('pro-podniky')}
              className="text-left text-white hover:text-[#F5B700] py-1 cursor-pointer"
            >
              Pro kavárny a&nbsp;restaurace
            </button>

            <button
              type="button"
              onClick={() => handleLinkClick('pro-mesta')}
              className="text-left text-white hover:text-[#F5B700] py-1 cursor-pointer"
            >
              Pro města a&nbsp;regiony
            </button>

            <button
              type="button"
              onClick={() => handleLinkClick('faq')}
              className="text-left text-white hover:text-[#F5B700] py-1 cursor-pointer"
            >
              FAQ
            </button>

            <button
              type="button"
              onClick={() => handleLinkClick('pro-podniky')}
              className="w-full inline-flex items-center justify-center text-center bg-[#F5B700] hover:bg-[#E0A600] active:bg-[#C99500] text-[#14294B] font-['Archivo',sans-serif] font-[800] text-[15px] normal-case tracking-normal leading-tight px-[18px] py-[10px] rounded-[10px] transition-colors cursor-pointer mt-2"
            >
              Přidat podnik&nbsp;→
            </button>
          </nav>
        </div>
      )}
    </header>
  );
};
