export interface Livre {
  id: number;
  titre: string;
  auteur: string;
  prix: number;
  pages?: number;
  couleur?: string;
  genre?: string;
  annee?: number;
}

export const LIVRES: Livre[] = [
  { id: 1000, titre: 'Les lointains veilleurs', auteur: 'Yann Ferrand', prix: 18.84, pages: 320, couleur: '#2d4059', genre: 'Aventure maritime', annee: 2023 },
  { id: 1001, titre: 'Les clairs veilleurs', auteur: 'Camille Baddou', prix: 18.41, pages: 290, couleur: '#0f4c81', genre: 'Poésie & Contemplation', annee: 2022 },
  { id: 1002, titre: 'Les perdus rivages', auteur: 'Camille Sorel', prix: 24.54, pages: 440, couleur: '#8a4a24', genre: 'Fresque historique', annee: 2021 },
  { id: 1003, titre: 'Les perdus veilleurs', auteur: 'Ines Ngassa', prix: 21.89, pages: 380, couleur: '#1f4e5b', genre: 'Thriller philosophique', annee: 2024 },
  { id: 1004, titre: 'Les vrais carnets', auteur: 'Awa Klein', prix: 19.01, pages: 260, couleur: '#5c3d75', genre: 'Essai littéraire', annee: 2020 },
  { id: 1005, titre: 'Les clairs carnets', auteur: 'Awa Ferrand', prix: 20.97, pages: 350, couleur: '#9e3d52', genre: 'Mémoires sensibles', annee: 2023 },
  { id: 1006, titre: 'Les lointains jardins', auteur: 'Ines Roux', prix: 12.8, pages: 180, couleur: '#2b580c', genre: 'Nouvelles botaniques', annee: 2024 },
  { id: 1007, titre: 'Les vrais rivages', auteur: 'Elodie Lefebvre', prix: 18.86, pages: 310, couleur: '#6d4c41', genre: 'Roman d\'initiation', annee: 2022 }
];
