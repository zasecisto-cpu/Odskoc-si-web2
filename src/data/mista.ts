export type Misto = {
  nazev: string;
  adresa: string;
  lat: number;
  lng: number;
  proKolemjdouci: string;
  bezbarierove: boolean;
  prebalovaciPult: boolean;
  zverejnit: boolean;
};

export type Mesto = {
  nazev: string;
  stav: 'pripravujeme' | 'v-provozu';
  pocetPripravenych: number;
  mista: Misto[];
};

export const MESTA_DATA: Mesto[] = [
  {
    nazev: 'Český Těšín',
    stav: 'pripravujeme',
    pocetPripravenych: 3,
    mista: [],
  },
  {
    nazev: 'Karviná',
    stav: 'pripravujeme',
    pocetPripravenych: 1,
    mista: [],
  },
  {
    nazev: 'Třinec',
    stav: 'pripravujeme',
    pocetPripravenych: 0,
    mista: [],
  },
];
