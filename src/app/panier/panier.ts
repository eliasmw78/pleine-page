import { Component, computed, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { PanierService } from './panier.service';

const CITATIONS = [
  { texte: '« Lire, c’est voyager ; voyager, c’est lire. »', auteur: 'Victor Hugo' },
  { texte: '« Une heure passée à lire est une heure volée au paradis. »', auteur: 'Marguerite Duras' },
  { texte: '« Les livres sont des amis froids et sûrs. »', auteur: 'Victor Hugo' },
  { texte: '« La lecture est une amitié. »', auteur: 'Marcel Proust' },
  { texte: '« On ne lit jamais un livre. On se lit à travers les livres. »', auteur: 'Romain Rolland' }
];

@Component({
  selector: 'app-panier',
  imports: [RouterLink],
  templateUrl: './panier.html',
  styleUrl: './panier.css'
})
export class Panier {
  protected readonly panierService = inject(PanierService);

  protected readonly codePromoSaisi = signal('');
  protected readonly commandeValidee = signal(false);
  protected readonly modeVue = signal<'standard' | 'ticket'>('standard');
  protected readonly indexCitation = signal(0);
  protected readonly dateAujourdhui = new Date().toLocaleDateString('fr-FR', {
    day: '2-digit',
    month: 'long',
    year: 'numeric'
  });
  protected readonly heureAujourdhui = new Date().toLocaleTimeString('fr-FR', {
    hour: '2-digit',
    minute: '2-digit'
  });

  protected readonly citationActuelle = computed(() => CITATIONS[this.indexCitation() % CITATIONS.length]);

  // Génère la pile 3D en aplatissant les exemplaires pour un rendu physique réel
  protected readonly pileLivres3D = computed(() => {
    const pile: Array<{
      id: number;
      titre: string;
      auteur: string;
      couleur: string;
      pages: number;
      epaisseurMm: number;
      indexGlobal: number;
    }> = [];

    let count = 0;
    for (const item of this.panierService.articles()) {
      for (let i = 0; i < item.quantite; i++) {
        pile.push({
          id: item.livre.id,
          titre: item.livre.titre,
          auteur: item.livre.auteur,
          couleur: item.livre.couleur || '#8a4a24',
          pages: item.livre.pages || 300,
          epaisseurMm: Math.round(((item.livre.pages || 300) / 100) * 8) + 12,
          indexGlobal: count++
        });
      }
    }
    return pile;
  });

  protected changerCitation(): void {
    this.indexCitation.update(i => i + 1);
  }

  protected appliquerCode(): void {
    if (this.codePromoSaisi().trim()) {
      this.panierService.appliquerCodePromo(this.codePromoSaisi());
    }
  }

  protected finaliserCommande(): void {
    this.commandeValidee.set(true);
  }

  protected fermerCommande(): void {
    this.commandeValidee.set(false);
    this.panierService.vider();
  }

  protected imprimerTicket(): void {
    window.print();
  }
}
