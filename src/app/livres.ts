export interface Livre {
  id: number;
  titre: string;
  auteur: string;
  prix: number;
}

export const LIVRES: Livre[] = [
  { id: 1000, titre: 'Les lointains veilleurs', auteur: 'Yann Ferrand', prix: 18.84 },
  { id: 1001, titre: 'Les clairs veilleurs', auteur: 'Camille Baddou', prix: 18.41 },
  { id: 1002, titre: 'Les perdus rivages', auteur: 'Camille Sorel', prix: 24.54 },
  { id: 1003, titre: 'Les perdus veilleurs', auteur: 'Ines Ngassa', prix: 21.89 },
  { id: 1004, titre: 'Les vrais carnets', auteur: 'Awa Klein', prix: 19.01 },
  { id: 1005, titre: 'Les clairs carnets', auteur: 'Awa Ferrand', prix: 20.97 },
  { id: 1006, titre: 'Les lointains jardins', auteur: 'Ines Roux', prix: 12.8 },
  { id: 1007, titre: 'Les vrais rivages', auteur: 'Elodie Lefebvre', prix: 18.86 }
];
